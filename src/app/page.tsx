"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle, Menu, X, Star, Users, BarChart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuthStore from "@/context/useAuthStore";
import { toast } from "sonner";
import SignupModal from "@/components/SignupModal";
import Navbar from "@/components/Navbar";

function LandingPageContent() {
  const router = useRouter();

  const { user, showSignupModal, setShowSignupModal } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <main>
        <section id="home" className="py-20">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-blue-800">
                🇩🇰 Ace Your Danish Driving Theory Test with AI 🚗
              </h1>
              <p className="text-xl mb-8 text-gray-600">
                Prepare for your Danish driving theory test like never before
                with our cutting-edge AI-driven platform. Engage in real-time
                with an AI assistant that helps you practice and master the
                official exam content.
              </p>
              <Button
                size="lg"
                className="bg-blue-600 text-white hover:bg-blue-700 mb-4"
                onClick={() => {
                  router.push("/demo-test");
                }}
              >
                Start Free AI Test!
              </Button>
              <div className="space-y-2 mb-8">
                <div className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2" size={20} />
                  <span className="text-gray-700">99kr One time fee</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2" size={20} />
                  <span className="text-gray-700">
                    Real-time interactive testing with AI
                  </span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2" size={20} />
                  <span className="text-gray-700">
                    Access to 2000+ official questions
                  </span>
                </div>
              </div>
              {user ? (
                <Button
                  size="lg"
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent"
                >
                  Start Your Interactive AI Test Now
                </Button>
              ) : (
                <SignupModal
                  open={showSignupModal}
                  onOpenChange={setShowSignupModal}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent"
                  >
                    Sign Up to Start with AI
                  </Button>
                </SignupModal>
              )}
            </div>
            <div className="md:w-1/2">
              <img
                src="/image.png"
                alt="AI-powered Danish driving theory test practice on mobile"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </section>

        <section id="features" className="py-20 bg-blue-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-blue-800">
              Key Features of Our AI-Powered Driving Test
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="text-blue-600 mb-4">
                    <Users size={48} />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-blue-800">
                    AI-Powered Testing Experience
                  </h3>
                  <p className="text-gray-600">
                    Chat with our AI assistant to take interactive, real-time
                    practice tests tailored to your progress and performance.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="text-blue-600 mb-4">
                    <Star size={48} />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-blue-800">
                    Up-to-date 2025 Questions
                  </h3>
                  <p className="text-gray-600">
                    Access a comprehensive database of questions, regularly
                    updated to match the latest Danish driving theory test.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="text-blue-600 mb-4">
                    <BarChart size={48} />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-blue-800">
                    Performance Tracking
                  </h3>
                  <p className="text-gray-600">
                    Monitor your progress and identify areas for improvement
                    with our detailed performance analytics.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-blue-800">
              How Our AI Driving Test Works
            </h2>
            <div className="max-w-4xl mx-auto">
              {[
                "Sign up: Create your account with a one-time payment of 99kr.",
                "Engage with AI: Talk to our AI assistant, which will guide you through real-time interactive practice tests.",
                "Practice: Take unlimited practice tests to improve your knowledge and confidence.",
                "Track progress: Monitor your performance and focus on areas that need improvement.",
                "Pass your test: Feel confident and prepared when you take your official Danish driving theory test.",
              ].map((step, index) => (
                <div key={index} className="flex items-start mb-8">
                  <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg mr-4 flex-shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-lg text-gray-700">{step}</p>
                    {index < 4 && (
                      <div className="border-l-2 border-blue-200 h-8 ml-4 my-2"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="testimonials" className="py-20 bg-blue-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-blue-800">
              What Our Users Say
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <img
                      src="/user1.avif"
                      alt="Maria J., student who passed Danish theory test"
                      className="rounded-full mr-4 w-12 h-12 object-cover"
                    />
                    <div>
                      <p className="font-semibold text-blue-800">Maria J.</p>
                      <div className="flex text-yellow-400">
                        <Star size={16} fill="currentColor" />
                        <Star size={16} fill="currentColor" />
                        <Star size={16} fill="currentColor" />
                        <Star size={16} fill="currentColor" />
                        <Star size={16} fill="currentColor" />
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">
                    &quot;The AI interaction was a game-changer! It felt like I
                    was talking to a real instructor, and the instant feedback
                    helped me improve quickly.&quot;
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <img
                      src="/user2.jpeg"
                      alt="Thomas K., student review after passing"
                      className="rounded-full mr-4 
                      w-12 h-12 object-cover"
                    />
                    <div>
                      <p className="font-semibold text-blue-800">Thomas K.</p>
                      <div className="flex text-yellow-400">
                        <Star size={16} fill="currentColor" />
                        <Star size={16} fill="currentColor" />
                        <Star size={16} fill="currentColor" />
                        <Star size={16} fill="currentColor" />
                        <Star size={16} fill="currentColor" />
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">
                    &quot;Having the AI explain my mistakes made learning much
                    easier. I passed my test on the first try!&quot;
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="pricing" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-blue-800">
              Simple Pricing for Advanced AI Learning
            </h2>
            <div className="max-w-md mx-auto">
              <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-center mb-4 text-blue-800">
                    One-Time Payment
                  </h3>
                  <p className="text-5xl font-bold text-center text-blue-600 mb-6">
                    99kr
                  </p>
                  <ul className="space-y-4 mb-8">
                    {[
                      "Real-time AI-guided practice tests",
                      "Unlimited practice sessions",
                      "Access to 2000 up-to-date questions",
                      "Lifetime access",
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle
                          className="text-green-500 mr-3"
                          size={24}
                        />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <SignupModal
                    open={showSignupModal}
                    onOpenChange={setShowSignupModal}
                  >
                    <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 text-lg py-3">
                      Get Started Now
                    </Button>
                  </SignupModal>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="faq" className="py-20 bg-blue-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-blue-800">
              Frequently Asked Questions
            </h2>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem
                  value="item-1"
                  className="bg-white rounded-lg shadow-sm"
                >
                  <AccordionTrigger className="px-6 py-4 text-left text-xl font-semibold text-blue-700 hover:text-blue-800">
                    Can I take the Danish driving theory test in English?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-gray-600">
                    Yes. Our platform provides full English-language practice
                    tests based on the official Danish driving theory exam, so
                    you can prepare confidently.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="item-2"
                  className="bg-white rounded-lg shadow-sm"
                >
                  <AccordionTrigger className="px-6 py-4 text-left text-xl font-semibold text-blue-700 hover:text-blue-800">
                    How much does theory test practice cost in Denmark?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-gray-600">
                    Many providers charge 199–299 DKK per month. Our platform
                    offers lifetime access for a one-time payment of just{" "}
                    <span className="font-bold text-blue-600">99kr</span>.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="item-3"
                  className="bg-white rounded-lg shadow-sm"
                >
                  <AccordionTrigger className="px-6 py-4 text-left text-xl font-semibold text-blue-700 hover:text-blue-800">
                    How does AI help with driving test prep?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-gray-600">
                    Our AI assistant gives instant feedback, explains mistakes,
                    and adapts questions to your weak areas — helping you pass
                    faster and with more confidence.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-blue-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">
                Danish Theory Test Prep
              </h3>
              <p className="text-blue-200">
                Ace your Danish driving theory test with our AI-powered
                platform.
              </p>
            </div>
            <div>
              <h4 className="text-lg  font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#home" className="text-blue-200 hover:text-white">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="#features"
                    className="text-blue-200 hover:text-white"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#how-it-works"
                    className="text-blue-200 hover:text-white"
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link
                    href="#testimonials"
                    className="text-blue-200 hover:text-white"
                  >
                    Testimonials
                  </Link>
                </li>
                <li>
                  <Link
                    href="#pricing"
                    className="text-blue-200 hover:text-white"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#faq" className="text-blue-200 hover:text-white">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <p className="text-blue-200 mb-2">Email: support@caroloom.com</p>
              <p className="text-blue-200">Phone: +4591828055</p>
            </div>
          </div>
          <div className="border-t border-blue-700 mt-8 pt-8 text-center">
            <p className="text-blue-200">
              &copy; 2025 Danish Theory Test Prep. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function LandingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LandingPageContent />
    </Suspense>
  );
}
