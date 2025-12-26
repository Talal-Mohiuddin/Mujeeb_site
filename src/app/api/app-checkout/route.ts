import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// ✅ Define CORS headers
const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*", // ❗ change this in production to your app domain
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// ✅ Utility to add CORS headers to any response
function withCORS(response: NextResponse) {
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

// ✅ Handle preflight OPTIONS requests
export async function OPTIONS() {
  return withCORS(new NextResponse(null, { status: 200 }));
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia", // Using the same version as in create-checkout-session
});

export async function POST(req: NextRequest) {
  // ✅ Handle preflight manually (just in case)
  if (req.method === "OPTIONS") {
    return withCORS(new NextResponse(null, { status: 200 }));
  }

  try {
    const { priceId, userId, userEmail } = await req.json();

    if (!priceId || !userId || !userEmail) {
      return withCORS(NextResponse.json(
        { error: "Missing required fields: priceId, userId, userEmail" },
        { status: 400 }
      ));
    }

    // Fetch the price to get the amount
    const price = await stripe.prices.retrieve(priceId);
    
    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: price.unit_amount || 0,
      currency: price.currency || 'sek',
      payment_method_types: ['card'],
      metadata: {
        userId,
        userEmail,
        priceId,
      },
    });

    // Return the client secret to the client with CORS headers
    return withCORS(NextResponse.json(
      { clientSecret: paymentIntent.client_secret },
      { status: 200 }
    ));
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return withCORS(NextResponse.json(
      { error: "Error creating payment intent" },
      { status: 500 }
    ));
  }
}
