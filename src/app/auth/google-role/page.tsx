"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getSession, signOut } from "next-auth/react";
import { Plus } from "lucide-react";
import Image from "next/image";

export default function GoogleRolePage() {
  const [role, setRole] = useState<"client" | "designer">("client");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      // If user selected a profile image, upload it to Cloudinary first
      let avatarUrl: string | undefined;
      if (selectedFile) {
        try {
          avatarUrl = await uploadToCloudinary(selectedFile);
        } catch (err) {
          console.error("Cloudinary upload failed:", err);
          setError("Failed to upload profile image. Please try again.");
          setSubmitting(false);
          return;
        }
      }

      const res = await fetch("/api/auth/google-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, avatarUrl }),
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

  // Upload selected file to Cloudinary using unsigned upload preset
  async function uploadToCloudinary(file: File) {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error(
        "Cloudinary not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET"
      );
    }

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", uploadPreset);

    const res = await fetch(url, { method: "POST", body: fd });
    if (!res.ok) throw new Error("Cloudinary upload failed");
    const data = await res.json();
    return data.secure_url as string;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    }
  };

  const handleCancelUpload = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
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
          {/* Profile photo upload (same UI as signup) */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Profile Photo (optional)
            </label>

            <div className="flex items-center gap-4">
              {previewUrl ? (
                <div className="relative">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    width={64}
                    height={64}
                    className="rounded-full object-cover ring-2 ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleCancelUpload}
                    className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full p-1 shadow hover:bg-red-50 transition"
                    title="Remove image"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center w-16 h-16 bg-gray-100 border border-dashed border-gray-400 rounded-full text-gray-500">
                  <Plus />
                </div>
              )}

              <div className="flex flex-col">
                <label
                  htmlFor="google-profile-upload"
                  className="cursor-pointer px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md shadow hover:bg-indigo-700 transition"
                >
                  {previewUrl ? "Change Image" : "Upload Image"}
                </label>
                <input
                  id="google-profile-upload"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {previewUrl && (
                  <button
                    type="button"
                    onClick={handleCancelUpload}
                    className="mt-2 text-xs text-red-500 hover:text-red-600 underline transition"
                  >
                    Cancel Upload
                  </button>
                )}
              </div>
            </div>

            <p className="text-xs text-gray-500">
              Supported formats: JPG, PNG. Max size: 5 MB.
            </p>
          </div>
          {error && <div className="text-red-600">{error}</div>}

          <fieldset>
            <legend className="sr-only">Role</legend>
            <div className="flex gap-4">
              <label
                className={`p-4 border rounded w-1/2 text-center cursor-pointer ${
                  role === "client" ? "border-indigo-600 bg-indigo-50" : ""
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="client"
                  checked={role === "client"}
                  onChange={() => setRole("client")}
                  className="hidden"
                />
                <div className="font-medium">Client</div>
                <div className="text-sm text-gray-500">
                  Looking for designers
                </div>
              </label>

              <label
                className={`p-4 border rounded w-1/2 text-center cursor-pointer ${
                  role === "designer" ? "border-indigo-600 bg-indigo-50" : ""
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="designer"
                  checked={role === "designer"}
                  onChange={() => setRole("designer")}
                  className="hidden"
                />
                <div className="font-medium">Designer</div>
                <div className="text-sm text-gray-500">
                  Looking for projects
                </div>
              </label>
            </div>
          </fieldset>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Continue to Dashboard"}
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
