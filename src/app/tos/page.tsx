"use client";

import { useState } from "react";
import useAuthStore from "@/context/useAuthStore";
import Link from "next/link";
import SignupModal from "@/components/SignupModal";

export default function TermsOfService() {
  const { user } = useAuthStore();
  const [showSignupModal, setShowSignupModal] = useState(false);
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Theory Test Prep</h1>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link href="/" className="hover:text-blue-200">
                  Home
                </Link>
              </li>

              {user ? (
                <li>
                  <Link href="/start-test" className="hover:text-blue-200">
                    Start Test
                  </Link>
                </li>
              ) : (
                <li>
                  <SignupModal 
                    open={showSignupModal} 
                    onOpenChange={setShowSignupModal}
                  >
                    <button className="hover:text-blue-200">
                      Sign up / Login
                    </button>
                  </SignupModal>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto mt-8 px-4 flex-grow">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-6 text-blue-800">
            Terms of Service for Danish Theory Test Prep App
          </h1>

          <p className="mb-4 text-gray-600">Last updated: September 17, 2024</p>

          <h2 className="text-2xl font-semibold mt-6 mb-4 text-blue-700">
            1. Acceptance of Terms
          </h2>
          <p className="mb-4 text-gray-700">
            By accessing or using the Danish Theory Test Prep App (the
            &quot;Service&quot;), you agree to be bound by these Terms of
            Service (&quot;Terms&quot;). If you disagree with any part of the
            terms, you may not access the Service.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4 text-blue-700">
            2. Description of Service
          </h2>
          <p className="mb-4 text-gray-700">
            The Danish Theory Test Prep App is a mobile and web-based
            application designed to help users prepare for the Danish driving
            theory test. It provides access to practice questions, study
            materials, and mock tests.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4 text-blue-700">
            3. User Accounts and Access
          </h2>
          <p className="mb-4 text-gray-700">
            3.1. To access certain features of the Service, you must create an
            account. You are responsible for maintaining the confidentiality of
            your account and password.
          </p>
          <p className="mb-4 text-gray-700">
            3.2. You agree to provide accurate, current, and complete
            information during the registration process and to update such
            information to keep it accurate, current, and complete.
          </p>
          <p className="mb-4 text-gray-700">
            3.3. Sharing of Login Credentials: You are strictly prohibited from
            sharing your login credentials (username and password) with any
            other individual or entity. Each account is for single user use
            only. Any detected sharing of accounts may result in immediate
            termination of your access to the Service without refund.
          </p>
          <p className="mb-4 text-gray-700">
            3.4. Lifetime Access: Upon payment of the one-time fee, you are
            granted lifetime access to the current version of the Service and
            any future updates we may provide. This lifetime access is subject
            to your compliance with these Terms of Service.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4 text-blue-700">
            4. Payment and Refunds
          </h2>
          <p className="mb-4 text-gray-700">
            4.1. The Service is provided for a one-time fee of 99 DKK.
          </p>
          <p className="mb-4 text-gray-700">
            4.2. All payments are final and non-refundable, except as provided
            in our Passing Guarantee (see Section 5).
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4 text-blue-700">
            5. Passing Guarantee
          </h2>
          <p className="mb-4 text-gray-700">
            We offer a Passing Guarantee subject to the following conditions:
          </p>
          <p className="mb-4 text-gray-700">
            5.1. Eligibility: To be eligible for the guarantee, you must:
          </p>
          <ul className="list-disc pl-8 mb-4 text-gray-700">
            <li>Complete at least 800 unique questions within the app.</li>
            <li>
              Attempt the official Danish theory test within 30 days of
              completing the 800th question.
            </li>
            <li>
              Fail the official test on your first attempt after using our app.
            </li>
          </ul>
          <p className="mb-4 text-gray-700">5.2. Claim Process:</p>
          <ul className="list-disc pl-8 mb-4 text-gray-700">
            <li>
              To claim your refund, you must email us at
              support@danishtheorytestprep.dk within 7 days of failing the test.
            </li>
            <li>
              You must provide a clear photograph of your official test results
              showing the fail status and the date of the test.
            </li>
          </ul>
          <p className="mb-4 text-gray-700">
            5.3. Refund: If all conditions are met and verified, we will refund
            the full purchase price of 99 DKK to the original payment method
            within 14 business days.
          </p>
          <p className="mb-4 text-gray-700">5.4. Limitations:</p>
          <ul className="list-disc pl-8 mb-4 text-gray-700">
            <li>This guarantee is limited to one refund per user.</li>
            <li>
              We reserve the right to deny refunds in cases of suspected fraud
              or abuse.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-4 text-blue-700">
            6. User Conduct
          </h2>
          <p className="mb-4 text-gray-700">You agree not to:</p>
          <ul className="list-disc pl-8 mb-4 text-gray-700">
            <li>
              Use the Service for any unlawful purpose or in violation of any
              local, state, national, or international law.
            </li>
            <li>
              Share your account, password, or access to the Service with any
              third party.
            </li>
            <li>Attempt to circumvent any security features of the Service.</li>
            <li>
              Copy, distribute, or share content from the Service without
              explicit written permission from Danish Theory Test Prep.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-4 text-blue-700">
            7. Intellectual Property
          </h2>
          <p className="mb-4 text-gray-700">
            The Service and its original content, features, and functionality
            are owned by Danish Theory Test Prep and are protected by
            international copyright, trademark, patent, trade secret, and other
            intellectual property or proprietary rights laws.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4 text-blue-700">
            8. Termination
          </h2>
          <p className="mb-4 text-gray-700">
            We may terminate or suspend your account and bar access to the
            Service immediately, without prior notice or liability, under our
            sole discretion, for any reason whatsoever and without limitation,
            including but not limited to a breach of the Terms. Violations of
            the account sharing prohibition may result in immediate termination
            of access without refund.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4 text-blue-700">
            9. Limitation of Liability
          </h2>
          <p className="mb-4 text-gray-700">
            In no event shall Danish Theory Test Prep, nor its directors,
            employees, partners, agents, suppliers, or affiliates, be liable for
            any indirect, incidental, special, consequential or punitive
            damages, including without limitation, loss of profits, data, use,
            goodwill, or other intangible losses, resulting from your access to
            or use of or inability to access or use the Service.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4 text-blue-700">
            10. Changes
          </h2>
          <p className="mb-4 text-gray-700">
            We reserve the right, at our sole discretion, to modify or replace
            these Terms at any time. We will provide notice of any significant
            changes by posting the new Terms on this page.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4 text-blue-700">
            11. Contact Us
          </h2>
          <p className="mb-4 text-gray-700">
            If you have any questions about these Terms, please contact us at
            support@danishtheorytestprep.dk.
          </p>

          <p className="mt-8 text-gray-700">
            By using the Service, you acknowledge that you have read and
            understood these Terms and agree to be bound by them.
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
            <Link
              href="/terms-of-service"
              className="text-blue-300 hover:text-blue-100 mx-2"
            >
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
