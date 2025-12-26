import useAuthStore from "@/context/useAuthStore";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import SignupModal from "./SignupModal";

function NavbarContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const { user, logout, setShowSignupModal, showSignupModal } = useAuthStore();
  const router = useRouter();

  const searchParams = useSearchParams();

  useEffect(() => {
    const showSignup = searchParams.get("showSignuppop");
    if (showSignup === "true") {
      setShowSignupModal(true);
    }
  }, [searchParams]);

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
  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          Danish Theory Test Prep
        </Link>
        <div className="hidden md:flex space-x-6 items-center justify-center">
          <Link href="#home" className="text-blue-600 hover:text-blue-800">
            Home
          </Link>
          <Link href="#features" className="text-blue-600 hover:text-blue-800">
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-blue-600 hover:text-blue-800"
          >
            How It Works
          </Link>
          <Link
            href="#testimonials"
            className="text-blue-600 hover:text-blue-800"
          >
            Testimonials
          </Link>
          <Link href="#pricing" className="text-blue-600 hover:text-blue-800">
            Pricing
          </Link>
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
                variant="outline"
                onClick={handleLogout}
                className="border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent"
              >
                Log Out
              </Button>
            </>
          ) : (
            <SignupModal
              open={showSignupModal}
              onOpenChange={setShowSignupModal}
            >
              <Button className="bg-blue-600 text-white hover:bg-blue-700">
                Sign up / Login
              </Button>
            </SignupModal>
          )}
        </div>
        <button className="md:hidden text-blue-600" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>
      {isMenuOpen && (
        <div className="md:hidden bg-white py-2">
          <Link
            href="#home"
            className="block px-4 py-2 text-blue-600 hover:bg-blue-50"
          >
            Home
          </Link>
          <Link
            href="#features"
            className="block px-4 py-2 text-blue-600 hover:bg-blue-50"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="block px-4 py-2 text-blue-600 hover:bg-blue-50"
          >
            How It Works
          </Link>
          <Link
            href="#testimonials"
            className="block px-4 py-2 text-blue-600 hover:bg-blue-50"
          >
            Testimonials
          </Link>
          <Link
            href="#pricing"
            className="block px-4 py-2 text-blue-600 hover:bg-blue-50"
          >
            Pricing
          </Link>
          <Link
            href="/demo-test"
            className="block px-4 py-2 text-blue-600 hover:bg-blue-50"
          >
            Demo Test
          </Link>
          {user ? (
            <>
              <Link
                href="/start-test"
                className="block px-4 py-2 text-blue-600 hover:bg-blue-50"
              >
                Start Test
              </Link>
              <Button
                variant="outline"
                className="w-full mt-2 border-blue-600 text-blue-600 bg-transparent"
                onClick={() => setIsLoggedIn(false)}
              >
                Log Out
              </Button>
            </>
          ) : (
            <SignupModal
              open={showSignupModal}
              onOpenChange={setShowSignupModal}
            >
              <Button className="w-full mt-2 bg-blue-600 text-white">
                Sign up / Login
              </Button>
            </SignupModal>
          )}
        </div>
      )}
    </header>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NavbarContent />
    </Suspense>
  );
}
