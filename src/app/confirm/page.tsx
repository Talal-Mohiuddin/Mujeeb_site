"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/context/useAuthStore";

const AuthRedirect = () => {
  const router = useRouter();
  const { handleAuthRedirect, loading, isSubscribed, checkSubscriptionStatus, user } = useAuthStore();

  useEffect(() => {
    const redirect = async () => {
      try {
        const hash = window.location.hash;
        const params = new URLSearchParams(hash.slice(1));

        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        if (accessToken && refreshToken) {
          await handleAuthRedirect();
          
          // Wait for user to be set, then check subscription
          const currentUser = useAuthStore.getState().user;
          if (currentUser) {
            await checkSubscriptionStatus(currentUser.id);
            
            // Check subscription status after fetching
            const { isSubscribed: currentSubscriptionStatus } = useAuthStore.getState();
            
            if (currentSubscriptionStatus) {
              router.push("/start-test");
            } else {
              router.push("/dashboard");
            }
          } else {
            router.push("/dashboard");
          }
        } else {
          router.push("/?showSignuppop=true");
        }
      } catch (error) {
        console.error("Error during auth redirect:", error);
        router.push("/?showSignuppop=true");
      }
    };

    redirect();
  }, [handleAuthRedirect, checkSubscriptionStatus, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
    </div>
  );
};

export default AuthRedirect;
