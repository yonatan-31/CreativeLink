import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Creative Link</h4>
            <p className="text-sm text-gray-500">Connecting clients and talented designers.</p>
          </div>

          <div>
            <h5 className="font-medium text-gray-900 mb-2">Product</h5>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/designers">Find designers</Link></li>
              <li><Link href="/">Pricing</Link></li>
              <li><Link href="/">Features</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-medium text-gray-900 mb-2">Company</h5>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/about">About</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/terms">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-400">&copy; {new Date().getFullYear()} Creative Link. All rights reserved.</div>
      </div>
    </footer>
  );
}
