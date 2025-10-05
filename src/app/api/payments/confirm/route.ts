import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { connectToDatabase } from "@/lib/db";
import { PaymentModel } from "@/models/Payment";
import { TripModel } from "@/models/Trip";
import { z } from "zod";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

const ConfirmPaymentSchema = z.object({
  paymentIntentId: z.string(),
  paymentId: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await req.json();
    const parsed = ConfirmPaymentSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { paymentIntentId, paymentId } = parsed.data;

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json(
        { error: "Payment not completed", status: paymentIntent.status },
        { status: 400 }
      );
    }

    // Update payment record in database
    const payment = await PaymentModel.findByIdAndUpdate(
      paymentId,
      {
        status: "completed",
        stripePaymentIntentId: paymentIntentId,
        completedAt: new Date(),
      },
      { new: true }
    );

    if (!payment) {
      return NextResponse.json(
        { error: "Payment record not found" },
        { status: 404 }
      );
    }

    // Update trip status to indicate payment completed
    await TripModel.findByIdAndUpdate(payment.tripId, {
      paymentStatus: "paid",
      paymentId: payment._id,
    });

    return NextResponse.json({
      success: true,
      payment: {
        id: payment._id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        completedAt: payment.completedAt,
      },
    });
  } catch (error) {
    console.error("Error confirming payment:", error);
    return NextResponse.json(
      { error: "Failed to confirm payment" },
      { status: 500 }
    );
  }
}
