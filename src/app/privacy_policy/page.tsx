"use client";

import { useState } from "react";
import useAuthStore from "@/context/useAuthStore";
import Link from "next/link";
import SignupModal from "@/components/SignupModal";

export default function PrivacyPolicy() {
  const { user } = useAuthStore();
  const { showSignupModal, setShowSignupModal } = useAuthStore();

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
                  <SignupModal
                    open={showSignupModal}
                    onOpenChange={setShowSignupModal}
                  >
                    <button className="hover:text-blue-200">
                      Sign up / Login
                    </button>
                  </SignupModal>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto mt-8 px-4 flex-grow">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-6 text-blue-800">
            Privacy Policy for Danish Theory Test Prep App
          </h1>

          <p className="mb-4 text-gray-600">Last updated: September 17, 2024</p>

          <h2 className="text-2xl font-semibold mt-6 mb-4 text-blue-700">
            1. Introduction
          </h2>
          <p className="mb-4 text-gray-700">
            Welcome to the Danish Theory Test Prep App (&quot;we,&quot;
            &quot;our,&quot; or &quot;us&quot;). We are committed to protecting
            your personal information and your right to privacy. This Privacy
            Policy explains how we collect, use, disclose, and safeguard your
            information when you use our mobile application and website
            (collectively, the &quot;Service&quot;).
          </p>
          <p className="mb-4 text-gray-700">
            Please read this privacy policy carefully. If you do not agree with
            the terms of this privacy policy, please do not access the Service.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4 text-blue-700">
            2. Information We Collect
          </h2>
          <p className="mb-4 text-gray-700">
            We collect information that you provide directly to us when you:
          </p>
          <ul className="list-disc pl-8 mb-4 text-gray-700">
            <li>Register for an account</li>
            <li>Use our Service</li>
            <li>Contact our customer support</li>
          </ul>
          <p className="mb-4 text-gray-700">
            The types of data we may collect include:
          </p>
          <ul className="list-disc pl-8 mb-4 text-gray-700">
            <li>Name and contact information (e.g., email address)</li>
            <li>
              Payment information (processed securely through our payment
              provider)
            </li>
            <li>Usage data (e.g., questions answered, test scores)</li>
            <li>Device information (e.g., device ID, IP address)</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-4 text-blue-700">
            3. How We Use Your Information
          </h2>
          <p className="mb-4 text-gray-700">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-8 mb-4 text-gray-700">
            <li>Provide, maintain, and improve our Service</li>
            <li>Process payments and send transaction notifications</li>
            <li>Respond to your comments and questions</li>
            <li>
              Send you related information, including confirmations, updates,
              and security alerts
            </li>
            <li>
              Monitor and analyze trends, usage, and activities in connection
              with our Service
            </li>
            <li>Personalize and improve your experience</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-4 text-blue-700">
            4. Sharing of Your Information
          </h2>
          <p className="mb-4 text-gray-700">
            We do not sell or rent your personal information to third parties.
            We may share your information in the following situations:
          </p>
          <ul className="list-disc pl-8 mb-4 text-gray-700">
            <li>With service providers who perform services on our behalf</li>
            <li>To comply with legal obligations</li>
            <li>To protect and defend our rights and property</li>
            <li>With your consent or at your direction</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-4 text-blue-700">
            5. Data Retention
          </h2>
          <p className="mb-4 text-gray-700">
            We will retain your personal information only for as long as is
            necessary for the purposes set out in this privacy policy. We will
            retain and use your information to the extent necessary to comply
            with our legal obligations, resolve disputes, and enforce our
            policies.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4 text-blue-700">
            6. Security of Your Information
          </h2>
          <p className="mb-4 text-gray-700">
            We use administrative, technical, and physical security measures to
            protect your personal information. While we have taken reasonable
            steps to secure the personal information you provide to us, please
            be aware that despite our efforts, no security measures are perfect
            or impenetrable.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4 text-blue-700">
            7. Your Data Protection Rights Under GDPR
          </h2>
          <p className="mb-4 text-gray-700">
            If you are a resident of the European Economic Area (EEA), you have
            certain data protection rights. We aim to take reasonable steps to
            allow you to correct, amend, delete, or limit the use of your
            personal information.
          </p>
          <p className="mb-4 text-gray-700">
            If you wish to be informed what personal information we hold about
            you and if you want it to be removed from our systems, please
            contact us.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4 text-blue-700">
            8. Changes to This Privacy Policy
          </h2>
          <p className="mb-4 text-gray-700">
            We may update our Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the &quot;Last updated&quot; date.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4 text-blue-700">
            9. Contact Us
          </h2>
          <p className="mb-4 text-gray-700">
            If you have any questions about this Privacy Policy, please contact
            us:
          </p>
          <ul className="list-disc pl-8 mb-4 text-gray-700">
            <li>By email: contact@danishtheorytestprep.dk</li>
            <li>
              By visiting this page on our website:
              www.danishtheorytestprep.dk/contact
            </li>
          </ul>
          <p className="mb-4 text-gray-700">
            Thank you for trusting us with your personal information and for
            using our Service.
          </p>
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
            <Link href="#" className="text-blue-300 hover:text-blue-100 mx-2">
              Terms of Service
            </Link>
            <Link href="#" className="text-blue-300 hover:text-blue-100 mx-2">
              Contact Us
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
