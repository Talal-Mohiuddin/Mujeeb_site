"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/context/useAuthStore";

interface RouteProtectionProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireSubscription?: boolean;
  redirectTo?: string;
  loadingComponent?: React.ReactNode;
  onShowSignup?: () => void;
}

const RouteProtection: React.FC<RouteProtectionProps> = ({
  children,
  requireAuth = true,
  requireSubscription = false,
  redirectTo,
  loadingComponent,
  onShowSignup,
}) => {
  const { user, isSubscribed, loading, fetchUser, checkSubscriptionStatus } =
    useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (!user) {
          await fetchUser();
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, [fetchUser]);

  useEffect(() => {
    const checkSubscription = async () => {
      if (user && (requireSubscription || !requireSubscription)) {
        try {
          await checkSubscriptionStatus(user.id);
        } catch (error) {
          console.error("Error checking subscription:", error);
        }
      }
    };

    if (!isInitializing && user) {
      checkSubscription();
    }
  }, [user, isInitializing, checkSubscriptionStatus, requireSubscription]);

  useEffect(() => {
    if (isInitializing || loading) return;

    // Handle authentication requirement
    if (requireAuth && !user) {
      if (onShowSignup) {
        onShowSignup();
        return;
      }
      const fallbackRedirect = redirectTo || "/?showSignuppop=true";
      router.push(fallbackRedirect);
      return;
    }

    // Handle subscription requirement
    if (requireSubscription && user && !isSubscribed) {
      // Redirect to subscription page instead of dashboard
      const fallbackRedirect = redirectTo || "/subscription";
      router.push(fallbackRedirect);
      return;
    }

    // Redirect subscribed users to start-test if they don't need subscription check
    // (e.g., when they're on dashboard page)
    if (!requireSubscription && user && isSubscribed) {
      router.push("/start-test");
      return;
    }
  }, [
    user,
    isSubscribed,
    requireAuth,
    requireSubscription,
    redirectTo,
    router,
    isInitializing,
    loading,
    onShowSignup,
  ]);

  // Show loading state
  if (isInitializing || loading) {
    if (loadingComponent) {
      return <>{loadingComponent}</>;
    }

    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  // Check if user meets requirements
  const userMeetsRequirements =
    (!requireAuth || user) && (!requireSubscription || (user && isSubscribed));

  if (!userMeetsRequirements) {
    // Component will redirect via useEffect, show loading meanwhile
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default RouteProtection;
