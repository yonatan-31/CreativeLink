"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession, signOut } from "next-auth/react";

export default function GoogleRolePage() {
  const [role, setRole] = useState<"client" | "designer">("client");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Ensure user is signed in via NextAuth; getSession returns the session or null
    getSession().then((session) => {
      if (!session) {
        // not signed in, redirect to sign in page
        router.replace("/auth/signin");
      } else {
        setLoading(false);
      }
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/auth/google-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      if (res.ok) {
        // role saved, go to dashboard
        router.push("/dashboard");
      } else {
        const data = await res.json();
        setError(data.message || "Failed to save role");
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async () => {
    // allow user to sign out if they don't want to complete
    await signOut({ callbackUrl: "/" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Checking sign-in...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Complete your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Choose whether you want to join as a client or a designer.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="text-red-600">{error}</div>}

            <fieldset>
              <legend className="sr-only">Role</legend>
              <div className="flex gap-4">
                <label className={`p-4 border rounded w-1/2 text-center cursor-pointer ${role === 'client' ? 'border-indigo-600 bg-indigo-50' : ''}`}>
                  <input
                    type="radio"
                    name="role"
                    value="client"
                    checked={role === 'client'}
                    onChange={() => setRole("client")}
                    className="hidden"
                  />
                  <div className="font-medium">Client</div>
                  <div className="text-sm text-gray-500">Looking for designers</div>
                </label>

                <label className={`p-4 border rounded w-1/2 text-center cursor-pointer ${role === 'designer' ? 'border-indigo-600 bg-indigo-50' : ''}`}>
                  <input
                    type="radio"
                    name="role"
                    value="designer"
                    checked={role === 'designer'}
                    onChange={() => setRole("designer")}
                    className="hidden"
                  />
                  <div className="font-medium">Designer</div>
                  <div className="text-sm text-gray-500">Looking for projects</div>
                </label>
              </div>
            </fieldset>
          

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Continue to Dashboard'}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 py-2 px-4 border rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
