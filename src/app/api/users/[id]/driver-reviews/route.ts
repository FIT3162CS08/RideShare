import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { UserModel } from "@/models/User";

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
    
    // Get user with reviews
    const user = await UserModel.findById(userId)
      .select("reviews name")
      .lean();
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    const reviews = user.reviews || [];
    const total = reviews.length;
    
    // Paginate reviews
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedReviews = reviews.slice(startIndex, endIndex);
    
    // Calculate statistics
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0;
    
    const ratingDistribution = {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length,
    };
    
    return NextResponse.json({
      reviews: paginatedReviews,
      stats: {
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews: total,
        ratingDistribution,
      },
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      driverName: user.name,
    });
  } catch (error) {
    console.error("Error fetching driver reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch driver reviews" },
      { status: 500 }
    );
  }
}
