import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "sonner";
import Head from "next/head";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "🇩🇰 Danish Driving Theory Test – Practice Free in English upto 2000+ Questions",
  description:
    "Practice 2,000+ updated Danish theory test questions in English. Free demo available. Lifetime access for only 99 kr – cheapest in Denmark.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Can I take the Danish driving theory test in English?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. Our platform provides full English-language practice tests based on the official Danish driving theory exam, so you can prepare confidently."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How much does theory test practice cost in Denmark?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Many providers charge 199–299 DKK per month. Our platform offers lifetime access for a one-time payment of 99kr."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How does AI help with driving test prep?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Our AI assistant gives instant feedback, explains mistakes, and adapts questions to your weak areas — helping you pass faster and with more confidence."
                  }
                }
              ]
            }
          `}
        </script>
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster />
        {children}
      </body>
    </html>
  );
}
