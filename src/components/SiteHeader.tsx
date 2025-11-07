"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";

export default function SiteHeader() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const showHomeNav = pathname === "/";

  return (
    <header className="bg-white/95 backdrop-blur fixed top-0 w-full z-50 border-b mb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-12">
            <Link href="/" className="text-xl font-bold text-indigo-600">Creative Link</Link>
            <nav className="hidden md:flex items-center gap-4 text-sm text-gray-700" aria-label="Primary navigation">
              {showHomeNav ? (
                <>
                  <Link href="/designers" className="hover:text-indigo-600">Designers</Link>
                  <Link href="#how" className="hover:text-indigo-600">How it works</Link>
                  <Link href="/" className="hover:text-indigo-600">Pricing</Link>
                </>
              ) : null}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3">
              {session ? (
                <>
                  <Link href="/dashboard" className="text-sm px-3 py-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">Dashboard</Link>
                  <button onClick={() => signOut({ callbackUrl: "/" })} className="text-sm text-gray-700 hover:text-gray-900">Sign out</button>
                </>
              ) : (
                <>
                  <Link href="/auth/signin" className="text-sm text-gray-700 hover:text-indigo-600">Sign in</Link>
                  <Link href="/auth/signup" className="text-sm px-3 py-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">Get started</Link>
                </>
              )}
            </div>

            <button
              className="md:hidden p-2 rounded-md text-gray-600"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <Menu />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div id="mobile-menu" className="md:hidden border-t bg-white/50">
          <div className="px-4 py-3 flex flex-col gap-2">
            {showHomeNav ? (
              <>
                <Link href="/designers" className="py-2 hover:text-indigo-600">Designers</Link>
                <Link href="#how" className="py-2 hover:text-indigo-600">How it works</Link>
                <Link href="/" className="py-2 hover:text-indigo-600">Pricing</Link>
              </>
            ) : null}
            {session ? (
              <>
                <Link href="/dashboard" className="py-2 hover:text-indigo-600">Dashboard</Link>
                <button onClick={() => signOut({ callbackUrl: "/" })} className="text-left py-2 hover:text-indigo-600">Sign out</button>
              </>
            ) : (
              <>
                <Link href="/auth/signin" className="py-2 hover:text-indigo-600">Sign in</Link>
                <Link href="/auth/signup" className="py-2 hover:text-indigo-600">Get started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
