"use client";

import { useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import useAuthStore from "@/context/useAuthStore";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function Dashboard() {
  const { user, isSubscribed, isFirstTimeLogin, loading } = useAuthStore();
  const router = useRouter();

  const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!;

  const handlePurchase = async () => {
    try {
      const stripe = await stripePromise;

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          userId: user?.id,
          userEmail: user?.email,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const session = await response.json();
      console.log("Session:", session);

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
      // Redirect to homepage with signup modal on error
      router.push("/?showSignuppop=true");
    }
  };

  useEffect(() => {
    if (!loading && user) {
      if (isSubscribed) {
        router.push("/start-test");
      } else if (isFirstTimeLogin) {
        // Only auto-redirect to Stripe for first-time users
        handlePurchase();
      } else {
        // For existing non-subscribed users, redirect to subscription page
        router.push("/subscription");
      }
    }
  }, [user, isSubscribed, isFirstTimeLogin, loading, router]);

  // Show loading spinner while processing
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
    </div>
  );
}
