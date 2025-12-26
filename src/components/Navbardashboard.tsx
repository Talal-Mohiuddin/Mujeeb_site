"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useAuthStore from "@/context/useAuthStore";

export default function NavbarDashboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const router = useRouter();

  async function handleLogout() {
    try {
      await logout();
      router.push("/");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "An error occurred. Please try again.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  }

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          Danish Theory Test Prep
        </Link>
        <div className="hidden md:flex space-x-6">
          <Link href="/demo-test" className="text-blue-600 hover:text-blue-800">
            Demo Test
          </Link>
          {user ? (
            <>
              <Link
                href="/start-test"
                className="text-blue-600 hover:text-blue-800"
              >
                Start Test
              </Link>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                Log Out
              </Button>
            </>
          ) : (
            <Button
              onClick={() => {
                router.push("/?showSignuppop=true");
              }}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Sign up / Login
            </Button>
          )}
        </div>
        <button className="md:hidden text-blue-600" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>
      {isMenuOpen && (
        <div className="md:hidden bg-white py-2">
          <Link
            href="/demo-test"
            className="block px-4 py-2 text-blue-600 hover:bg-blue-50"
          >
            Demo Test
          </Link>
          {user && (
            <>
              <Link
                href="/start-test"
                className="block px-4 py-2 text-blue-600 hover:bg-blue-50"
              >
                Start Test
              </Link>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full mt-2 border-blue-600 text-blue-600"
              >
                Log Out
              </Button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
