import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ReviewModel } from "@/models/Review";
import { UserModel } from "@/models/User";
import { z } from "zod";

const ReviewInput = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(1).max(500),
  driverId: z.string().min(1),
  userId: z.string().min(1),
  tripId: z.string().min(1),
  reviewerName: z.string().min(1).optional(),
});

export async function GET(req: NextRequest) {
  await connectToDatabase();
  
  const { searchParams } = new URL(req.url);
  const driverId = searchParams.get("driverId");
  const limit = parseInt(searchParams.get("limit") || "10");
  const page = parseInt(searchParams.get("page") || "1");
  
  try {
    let query = {};
    if (driverId) {
      query = { driverId };
    }
    
    const reviews = await ReviewModel.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();
    
    const total = await ReviewModel.countDocuments(query);
    
    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  await connectToDatabase();
  
  try {
    const json = await req.json();
    const parsed = ReviewInput.safeParse(json);
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }
    
    const data = parsed.data;
    
    // Check if user has already reviewed this trip
    const existingReview = await ReviewModel.findOne({
      userId: data.userId,
      tripId: data.tripId,
    });
    
    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this trip" },
        { status: 400 }
      );
    }
    
    const review = await ReviewModel.create(data);
    
    // Add review to driver's reviews array
    await UserModel.findByIdAndUpdate(
      data.driverId,
      {
        $push: {
          reviews: {
            rating: data.rating,
            comment: data.comment,
            reviewerId: data.userId,
            reviewerName: data.reviewerName || "Anonymous",
            tripId: data.tripId,
            createdAt: new Date(),
          }
        }
      },
      { new: true }
    );
    
    return NextResponse.json({
      success: true,
      review: {
        id: review._id,
        rating: review.rating,
        comment: review.comment,
        driverId: review.driverId,
        userId: review.userId,
        tripId: review.tripId,
        createdAt: review.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}
