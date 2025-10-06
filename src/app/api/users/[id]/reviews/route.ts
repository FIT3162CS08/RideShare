import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ReviewModel } from "@/models/Review";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectToDatabase();
  
  try {
    const { id: userId } = await context.params;
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    const type = searchParams.get("type") || "received"; // "received" or "given"
    
    let query = {};
    if (type === "received") {
      // Reviews received as a driver
      query = { driverId: userId };
    } else if (type === "given") {
      // Reviews given as a rider
      query = { userId: userId };
    }
    
    // Get reviews
    const reviews = await ReviewModel.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();
    
    // Get statistics
    const stats = await ReviewModel.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
          ratingDistribution: {
            $push: "$rating"
          }
        }
      }
    ]);
    
    const total = await ReviewModel.countDocuments(query);
    
    // Calculate rating distribution
    const ratingDistribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };
    
    if (stats.length > 0 && stats[0].ratingDistribution) {
      stats[0].ratingDistribution.forEach((rating: number) => {
        if (rating >= 1 && rating <= 5) {
          ratingDistribution[rating as keyof typeof ratingDistribution]++;
        }
      });
    }
    
    return NextResponse.json({
      reviews,
      stats: {
        averageRating: stats.length > 0 ? Math.round(stats[0].averageRating * 10) / 10 : 0,
        totalReviews: stats.length > 0 ? stats[0].totalReviews : 0,
        ratingDistribution,
      },
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      type,
    });
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch user reviews" },
      { status: 500 }
    );
  }
}
