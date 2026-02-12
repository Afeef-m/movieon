import Script from "next/script";
import Footer from "./components/footer";
import Navbar from "./components/navbar";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata = {
  title: "MOVION – Book Movie Tickets Online",
  description: "Book movie tickets online with MOVION. Choose theaters, seats, showtimes and pay securely.",
  keywords: ["movie tickets", "online booking", "theater booking", "movion"],
  openGraph: {
    title: "MOVION – Movie Ticket Booking",
    description: "Fast, simple and secure movie ticket booking",
    url: "https://movion.com",
    siteName: "MOVION",
    images: [
      {
        url: "/images/banner.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-900 text-white">

        <Navbar />

        <Script 
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />

        <main className="flex-grow">
          {children}
          <Toaster position="top-center" />
        </main>

        <Footer />

      </body>
    </html>
  );
}
