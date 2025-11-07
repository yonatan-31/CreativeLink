import { auth } from "@/lib/auth";
import Link from "next/link";
import FeaturedDesigners from "@/components/FeaturedDesigners";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="bg-linear-to-br from-indigo-50 via-white to-cyan-50">
      <main>
        <div className="relative h-screen flex items-center justify-center">
          {/* background image for hero only */}
          <div
            className="absolute inset-0 bg-center bg-cover"
            style={{ backgroundImage: "url('/bg-home.jpg')" }}
            aria-hidden
          />
          {/* stronger overlay to reduce background prominence and improve text contrast */}
          <div className="absolute inset-0 bg-black/40" />

          <div className="relative text-center max-w-7xl mx-auto px-4 sm:px-6 md:px-9 lg:px-8 py-12 -mt-20">
            <h2 className="text-3xl font-bold text-white drop-shadow-lg sm:text-4xl md:text-5xl">
              Connect with
              <span className="text-indigo-300"> Talented Designers</span>
            </h2>
            <p className="mt-3 max-w-md mx-auto text-md text-gray-100 sm:text-lg md:mt-5 md:text-lg md:max-w-2xl">
              Find and hire graphic designers for branding, marketing, and UI/UX
              projects. Or showcase your design skills and get hired by amazing
              clients.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8 ">
              <div className="max-w-xs mx-auto sm:w-full rounded-md shadow flex-1">
                {!session ? (
                  <Link
                    href="/auth/signup"
                    className="flex items-center justify-center h-full px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-8"
                  >
                    Get Started Free
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    className="flex items-center justify-center h-full px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-8"
                  >
                    Go to Dashboard
                  </Link>
                )}
              </div>
              <div className="max-w-xs mx-auto sm:w-full rounded-md shadow flex-1 mt-5 sm:mt-0 sm:ml-3">
                <Link
                  href="/designers"
                  className="flex items-center justify-center h-full px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-8"
                >
                  Browse Designers
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Features */}
      <HowItWorks />

      {/* Featured Designers */}
      <FeaturedDesigners />

      {/* Footer */}
      <Footer />
    </div>
  );
}
