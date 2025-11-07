import Link from "next/link";
import { BookOpen, Layout, Megaphone } from "lucide-react";

export default function HowItWorks() {
  return (
    <section id="how" className="max-w-7xl mx-auto px-8 sm:px-6 lg:px-8 py-12 scroll-mt-16">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold">How it works</h2>
        <p className="text-gray-500 mt-2">Find designers, collaborate, and ship great work — in three easy steps.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-5">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="h-12 w-12 flex items-center justify-center rounded-md bg-indigo-50 text-indigo-600 mb-4">
            <BookOpen />
          </div>
          <h3 className="font-medium">Post a brief</h3>
          <p className="text-sm text-gray-500 mt-2">Describe your project and budget — designers will reach out with proposals.</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="h-12 w-12 flex items-center justify-center rounded-md bg-indigo-50 text-indigo-600 mb-4">
            <Layout />
          </div>
          <h3 className="font-medium">Review portfolios</h3>
          <p className="text-sm text-gray-500 mt-2">Browse curated portfolios and pick a designer that fits your style.</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="h-12 w-12 flex items-center justify-center rounded-md bg-indigo-50 text-indigo-600 mb-4">
            <Megaphone />
          </div>
          <h3 className="font-medium">Hire & collaborate</h3>
          <p className="text-sm text-gray-500 mt-2">Manage the project, message the designer, and finalize deliverables.</p>
        </div>
      </div>
    </section>
  );
}
