import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { BookOpen, Layout, Megaphone } from "lucide-react";
import FeaturedDesigners from "@/components/FeaturedDesigners";

export default async function HomePage() {
  const session = await auth();
  // if (!session) {
  //   redirect("/auth/signin");
  // }

  // If user has a role, redirect to dashboard
  // if (session?.user?.role) {
  //   redirect("/dashboard");
  // }
  // Featured designers are fetched client-side from /api/designers/featured

  return (
    <div className="bg-linear-to-br from-indigo-50 via-white to-cyan-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 md:py-4">
            <h1 className="text-xl sm:text-2xl font-bold text-indigo-600">
              Creative Link
            </h1>
            <nav>
              {session ? (
                <div className="flex items-center space-x-4">
                  <span className="hidden sm:block text-gray-700">
                    Welcome, {session?.user?.name}
                  </span>
                  <Link
                    href="/dashboard"
                    className="bg-indigo-600 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Dashboard
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/auth/signin"
                    className="text-gray-700 hover:text-indigo-600 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="bg-indigo-600 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>
      {/* spacer to offset fixed header (same height as header) */}
      <div aria-hidden className="h-14 md:h-16" />

      {/* Hero Section */}
      <main>
        <div className="relative h-screen flex items-center justify-center">
          {/* background image for hero only */}
          <div
            className="absolute inset-0 bg-center bg-cover"
            style={{ backgroundImage: "url('/bg-home.jpg')" }}
            aria-hidden
          />
          <div className="absolute inset-0 bg-white/70 dark:bg-black/40" />

          <div className="relative text-center max-w-7xl mx-auto px-4 sm:px-6 md:px-9 lg:px-8 py-12 -mt-20">
            <h2 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl">
              Connect with
              <span className="text-indigo-600"> Talented Designers</span>
            </h2>
            <p className="mt-3 max-w-md mx-auto text-md text-gray-500 sm:text-lg md:mt-5 md:text-lg md:max-w-2xl">
              Find and hire graphic designers for branding, marketing, and UI/UX
              projects. Or showcase your design skills and get hired by amazing
              clients.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8 ">
              <div className="max-w-xs mx-auto sm:w-full rounded-md shadow flex-1">
                <Link
                  href="/auth/signup"
                  className="flex items-center justify-center h-full px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-8"
                >
                  Get Started Free
                </Link>
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
      <div className="mt-5 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-gray-300">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
          <div className="text-center w-full sm:w-1/3">
            <div className="flex items-center justify-center h-8 w-8 md:h-10 md:w-10 rounded-md bg-indigo-500 text-white mx-auto">
              <BookOpen className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <h3 className="mt-4 text-sm md:text-base font-medium text-gray-900">
              Brand & Identity
            </h3>
            <p className="mt-2 max-w-xs mx-auto text-sm text-gray-500">
              Logo design, brand guidelines, and visual identity systems.
            </p>
          </div>

          <div className="text-center w-full sm:w-1/3">
            <div className="flex items-center justify-center h-8 w-8 md:h-10 md:w-10 rounded-md bg-indigo-500 text-white mx-auto">
              <Layout className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <h3 className="mt-4 text-sm md:text-base font-medium text-gray-900">
              UI/UX Design
            </h3>
            <p className="mt-2 max-w-xs mx-auto text-sm text-gray-500">
              User interface and user experience design for web and mobile.
            </p>
          </div>

          <div className="text-center w-full sm:w-1/3">
            <div className="flex items-center justify-center h-8 w-8 md:h-10 md:w-10 rounded-md bg-indigo-500 text-white mx-auto">
              <Megaphone className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <h3 className="mt-4 text-sm md:text-base font-medium text-gray-900">
              Marketing & Ads
            </h3>
            <p className="mt-2 max-w-xs mx-auto text-sm text-gray-500">
              Marketing materials, social media graphics, and advertising
              campaigns.
            </p>
          </div>
        </div>
      </div>
      {/* Featured Designers */}
      <FeaturedDesigners />
      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-base text-gray-400">
              &copy; 2025 Creative Link. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
