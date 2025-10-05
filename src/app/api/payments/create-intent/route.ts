import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { connectToDatabase } from "@/lib/db";
import { PaymentModel } from "@/models/Payment";
import { z } from "zod";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

const CreatePaymentIntentSchema = z.object({
  amount: z.number().min(1),
  currency: z.string().default("aud"),
  tripId: z.string(),
  userId: z.string(),
  description: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await req.json();
    const parsed = CreatePaymentIntentSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { amount, currency, tripId, userId, description } = parsed.data;

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata: {
        tripId,
        userId,
      },
      description: description || `RideShare payment for trip ${tripId}`,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Save payment record to database
    const payment = await PaymentModel.create({
      tripId,
      userId,
      amount,
      currency,
      stripePaymentIntentId: paymentIntent.id,
      status: "pending",
      description,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id,
      amount,
      currency,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
