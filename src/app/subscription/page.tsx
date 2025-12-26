"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import useAuthStore from "@/context/useAuthStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import RouteProtection from "@/components/RouteProtection";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

function SubscriptionPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!;

  const handlePurchase = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const stripe = await stripePromise;

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          userId: user.id,
          userEmail: user.email,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const session = await response.json();

      if (stripe) {
        const result = await stripe.redirectToCheckout({
          sessionId: session.sessionId,
        });

        if (result.error) {
          throw new Error(result.error.message);
        }
      } else {
        throw new Error("Failed to load Stripe");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      // Stay on subscription page on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl sm:text-2xl font-bold">
            <h1>Theory Test Prep</h1>
          </Link>
          <Link href="/" className="flex items-center hover:text-blue-200">
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back to Home
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto">
          <Card className="bg-white shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-blue-800">
                Unlock Full Access
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Get unlimited access to AI-powered theory test practice
              </p>
            </CardHeader>
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <p className="text-5xl font-bold text-blue-600 mb-2">99kr</p>
                <p className="text-gray-600">One-time payment</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                {[
                  "Real-time AI-guided practice tests",
                  "Unlimited practice sessions",
                  "Access to 2000+ up-to-date questions",
                  "Lifetime access",
                  "Performance tracking",
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="text-green-500 mr-3" size={20} />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                onClick={handlePurchase}
                disabled={loading}
                className="w-full bg-blue-600 text-white hover:bg-blue-700 text-lg py-3"
              >
                {loading ? "Processing..." : "Get Started Now"}
              </Button>

              <p className="text-center text-sm text-gray-500 mt-4">
                Secure payment powered by Stripe
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function ProtectedSubscriptionPage() {
  return (
    <RouteProtection
      requireAuth={true}
      requireSubscription={false}
    >
      <SubscriptionPage />
    </RouteProtection>
  );
}
