"use client";

import React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import useAuthStore from "@/context/useAuthStore";
import { CheckCircle, X } from "lucide-react";

interface SignupModalProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

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
    <Card className="w-full max-w-sm mx-auto border-0 shadow-none">
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

export default function SignupModal({ children, open, onOpenChange }: SignupModalProps) {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onOpenChange?.(false);
    }
  };

  const handleCloseClick = () => {
    onOpenChange?.(false);
  };

  const triggerElement = React.cloneElement(children as React.ReactElement, {
    onClick: () => onOpenChange?.(true),
  });

  return (
    <>
      {triggerElement}
      {open && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={handleBackdropClick}
        >
          <div className="relative bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
            <button
              onClick={handleCloseClick}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-slate-100 data-[state=open]:text-slate-500 z-10"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
            <div className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:w-1/2">
                  <SignUpForm />
                </div>
                <div className="w-full lg:w-1/2 bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-3xl font-bold mb-6 text-blue-800">
                    Why Sign Up?
                  </h2>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <CheckCircle className="w-6 h-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-semibold">
                          Comprehensive Theory Test Preparation
                        </strong>
                        <p className="text-gray-600">
                          Access to 1260 up-to-date questions covering all aspects of
                          the Danish driving theory test.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-6 h-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-semibold">
                          Boost Your Confidence
                        </strong>
                        <p className="text-gray-600">
                          Practice in a format identical to the actual test, building
                          your confidence for exam day.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-6 h-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-semibold">
                          Pass on Your First Try
                        </strong>
                        <p className="text-gray-600">
                          Our comprehensive preparation helps you ace the exam on your
                          first attempt.
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
            </div>
          </div>
        </div>
      )}
    </>
  );
}
