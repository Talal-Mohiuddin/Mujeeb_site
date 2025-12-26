"use client";

import NavbarDashboard from "@/components/Navbardashboard";
import RouteProtection from "@/components/RouteProtection";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RouteProtection
      requireAuth={true}
      requireSubscription={false}
    >
      <div>
        <NavbarDashboard />
        {children}
      </div>
    </RouteProtection>
  );
}
