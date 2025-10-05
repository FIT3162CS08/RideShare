"use client";

import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY 
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

interface StripePaymentProps {
  amount: number;
  tripId: string;
  userId: string;
  onSuccess: (paymentId: string) => void;
  onError: (error: string) => void;
  description?: string;
}

function PaymentForm({ 
  amount, 
  tripId, 
  userId, 
  onSuccess, 
  onError, 
  description 
}: StripePaymentProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/trip/${tripId}`,
        },
        redirect: "if_required",
      });

      if (error) {
        onError(error.message || "Payment failed");
      } else if (paymentIntent.status === "succeeded") {
        // Confirm payment on our backend for local development
        const confirmResponse = await fetch("/api/payments/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            tripId,
            userId,
          }),
        });

        if (confirmResponse.ok) {
          onSuccess(paymentIntent.id);
        } else {
          const errorData = await confirmResponse.json();
          onError(`Payment confirmation failed: ${errorData.error || "Unknown error"}`);
        }
      }
    } catch (error) {
      console.error("Payment error:", error);
      onError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
        <PaymentElement 
          options={{
            layout: "tabs",
          }}
        />
      </div>

      <div className="bg-gray-50 p-4 rounded-2xl">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total Amount</span>
          <span className="text-2xl font-bold text-gray-900">
            ${amount.toFixed(2)} AUD
          </span>
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-2xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? "Processing..." : `Pay $${amount.toFixed(2)} AUD`}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Your payment information is secure and encrypted. Powered by Stripe.
      </p>
    </form>
  );
}

export default function StripePayment(props: StripePaymentProps) {
  const [clientSecret, setClientSecret] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Create payment intent when component mounts
    const createPaymentIntent = async () => {
      try {
        const response = await fetch("/api/payments/create-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: props.amount,
            tripId: props.tripId,
            userId: props.userId,
            description: props.description || `RideShare payment - $${props.amount.toFixed(2)}`,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create payment intent");
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error("Error creating payment intent:", error);
        setError("Failed to initialize payment");
      } finally {
        setIsLoading(false);
      }
    };

    createPaymentIntent();
  }, [props.amount, props.tripId, props.userId, props.description]);

  if (!stripePromise) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-2xl">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Stripe Not Configured</h3>
        <p className="text-yellow-700 mb-4">
          Stripe payment gateway is not configured. Please add your Stripe API keys to the environment variables.
        </p>
        <div className="text-sm text-yellow-600">
          <p>Required environment variables:</p>
          <ul className="list-disc list-inside mt-2">
            <li>STRIPE_SECRET_KEY</li>
            <li>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</li>
          </ul>
          <p className="mt-2 text-xs">Note: Webhooks are not needed for local development</p>
        </div>
        <button 
          onClick={() => props.onError("Stripe not configured")}
          className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-2xl hover:bg-yellow-700"
        >
          Continue with Cash Payment
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing payment...</p>
        </div>
      </div>
    );
  }

  if (error || !clientSecret) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-2xl">
        <h3 className="text-lg font-semibold text-red-800 mb-2">Payment Error</h3>
        <p className="text-red-700 mb-4">{error || "Failed to initialize payment"}</p>
        <button 
          onClick={() => props.onError(error || "Payment initialization failed")}
          className="px-4 py-2 bg-red-600 text-white rounded-2xl hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PaymentForm {...props} />
    </Elements>
  );
}
