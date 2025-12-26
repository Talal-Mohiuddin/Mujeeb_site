"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useAuthStore from "@/context/useAuthStore";

const PaymentSuccess = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, updateSubscriptionStatus } = useAuthStore();

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    console.log("Session ID:", sessionId);
    console.log("User:", user);

    async function verifyPaymentAndUpdateStatus() {
      if (sessionId && user) {
        try {
          // Verify the payment with your backend
          const response = await fetch("/api/verify-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ sessionId, userId: user.id }),
          });

          if (response.ok) {
            // If payment is verified, update subscription status
            await updateSubscriptionStatus(user.id, true);
            // Redirect to start-test or appropriate page
            router.push("/start-test");
          } else {
            // Handle payment verification failure
            console.error("Payment verification failed");
            router.push("/dashboard");
          }
        } catch (error) {
          console.error("Error verifying payment:", error);
          router.push("/dashboard");
        }
      }
    }

    verifyPaymentAndUpdateStatus();
  }, [searchParams, user, updateSubscriptionStatus, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Processing your payment...</h1>
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
    </div>
  );
};

const PaymentSuccessWrapper = () => (
  <React.Suspense fallback={<div>Loading...</div>}>
    <PaymentSuccess />
  </React.Suspense>
);

export default PaymentSuccessWrapper;
