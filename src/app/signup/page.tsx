"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import useAuthStore from "@/context/useAuthStore";
import Footer from "@/components/Footer";

function SignUpForm() {
  const [email, setemail] = useState("");
  const { loading, login } = useAuthStore();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (email === "") {
      toast.error("Please enter your email");
      return;
    }
    try {
      await login(email);
      toast.success("Login successful! Check your email for the magic link.");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "An error occurred. Please try again.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  }

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Welcome
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-sm text-muted-foreground mb-4">
          Sign in or create an account to get started.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            required
          />
          <Button
            type="submit"
            className="w-full bg-blue-700 text-white"
            disabled={loading}
          >
            {loading ? "Sending link..." : "Continue with Email"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function SignUpPage() {
  // useEffect(() => {
  //   fetch("/api/create-payment-intent", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ items: [{ id: "danish-theory-test-prep" }] }),
  //   })
  //     .then((res) => res.json())
  //     .then((data) => setClientSecret(data.clientSecret));
  // }, []);
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl sm:text-2xl font-bold">
            <h1>Theory Test Prep</h1>
          </Link>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link href="/" className="hover:text-blue-200">
                  Home
                </Link>
              </li>
              <li>
                {user ? (
                  <Link href="/start-test" className="hover:text-blue-200">
                    Start Test
                  </Link>
                ) : (
                  <Link href="/signup" className="hover:text-blue-200">
                    Sign up / Login
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto mt-8 px-4 flex-grow">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="w-full lg:w-1/2">
                  <SignUpForm />
                </div>
                <div className="w-full lg:w-1/2 bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-3xl font-bold mb-6 text-blue-800">
                    Why Sign Up?
                  </h2>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <svg
                        className="w-6 h-6 text-green-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      <div>
                        <strong className="font-semibold">
                          Comprehensive Theory Test Preparation
                        </strong>
                        <p className="text-gray-600">
                          Access to 1260 up-to-date questions covering all
                          aspects of the Danish driving theory test.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="w-6 h-6 text-green-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      <div>
                        <strong className="font-semibold">
                          Boost Your Confidence
                        </strong>
                        <p className="text-gray-600">
                          Practice in a format identical to the actual test,
                          building your confidence for exam day.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="w-6 h-6 text-green-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      <div>
                        <strong className="font-semibold">
                          Pass on Your First Try
                        </strong>
                        <p className="text-gray-600">
                          Our comprehensive preparation helps you ace the exam
                          on your first attempt.
                        </p>
                      </div>
                    </li>
                  </ul>
                  <div className="mt-8 bg-blue-100 p-4 rounded-lg">
                    <h3 className="text-xl font-semibold mb-2 text-blue-800">
                      Unbeatable Value
                    </h3>
                    <p className="text-blue-700">
                      One-time fee of only 99kr (Danish Kroner)
                    </p>
                    <p className="text-blue-700">
                      Passing guarantee or your money back!
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="bg-blue-800 text-white mt-16 py-8">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Theory Test Prep. All rights reserved.</p>
          <div className="mt-4">
            <Link
              href="/privacy-policy"
              className="text-blue-300 hover:text-blue-100 mx-2"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="text-blue-300 hover:text-blue-100 mx-2"
            >
              Terms of Service
            </Link>
            <a
              href="mailto:support@lektio.io"
              className="text-blue-300 hover:text-blue-100 mx-2"
            >
              Contact Us
            </a>
          </div>
        </div>
      </footer>
      <Footer />
    </div>
  );
}
