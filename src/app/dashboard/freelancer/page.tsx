"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { User, Trash2 } from "lucide-react";
import Loader from "@/components/Loader";
interface DesignerProfile {
  _id: string;
  title: string;
  bio: string;
  category: string;
  skills: string[];
  rate: number;
  availability: string;
  portfolio: Array<{
    url: string;
    title: string;
    description: string;
  }>;
  userId: {
    avatarUrl?: string;
  };
}

interface ProjectRequest {
  _id: string;
  clientId: {
    name: string;
    email: string;
  };
  title: string;
  description: string;
  budget: number;
  status: string;
  createdAt: string;
}

export default function FreelancerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<DesignerProfile | null>(null);
  const [projectRequests, setProjectRequests] = useState<ProjectRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [profileForm, setProfileForm] = useState({
    title: "",
    bio: "",
    category: "",
    skills: "",
    rate: "",
    availability: "available",
    portfolio: [
      { url: "", title: "", description: "" }
    ],
  });
  const [portfolioFiles, setPortfolioFiles] = useState<(File | null)[]>([]);
  const [portfolioPreviews, setPortfolioPreviews] = useState<(string | null)[]>([]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    fetchProfile();
    fetchProjectRequests();
  }, [session, status, router]);

  // cleanup any created object URLs for portfolio previews on unmount
  useEffect(() => {
    return () => {
      portfolioPreviews.forEach((p) => {
        if (p && p.startsWith("blob:")) URL.revokeObjectURL(p);
      });
    };
    // we only want cleanup on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/designers/profile");
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        if (data) {
          setProfileForm({
            title: data.title || "",
            bio: data.bio || "",
            category: data.category || "",
            skills: data.skills.join(", ") || "",
            rate: data.rate?.toString() || "",
            availability: data.availability || "available",
            portfolio: data.portfolio || [{ url: "", title: "", description: "" }],
          });
          // initialize portfolio file inputs / previews
          setPortfolioFiles((data.portfolio || [{ url: "", title: "", description: "" }]).map(() => null));
          setPortfolioPreviews((data.portfolio || [{ url: "", title: "", description: "" }]).map((p: any) => p.url || null));
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchProjectRequests = async () => {
    try {
      const response = await fetch("/api/projects/requests");
      if (response.ok) {
        const data = await response.json();
        console.log("Project Requests Response:", data);
        setProjectRequests(data);
      }
    } catch (error) {
      console.error("Error fetching project requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // If any portfolio files were selected, upload them first and replace the url
      const payload = {
        ...profileForm,
        skills: profileForm.skills
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),
        portfolio: [...profileForm.portfolio],
      };

      for (let i = 0; i < payload.portfolio.length; i++) {
        const file = portfolioFiles[i];
        if (file) {
          try {
            const uploadedUrl = await uploadToCloudinary(file);
            payload.portfolio[i].url = uploadedUrl;
          } catch (err) {
            console.error("Failed to upload portfolio image:", err);
            alert("Failed to upload one of the portfolio images. Please try again.");
            return;
          }
        }
      }

      const response = await fetch("/api/designers/profile", {
        method: profile ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await fetchProfile();
        setShowProfileForm(false);
      } else {
        alert("Failed to save profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile");
    }
  };

  const handleDeleteProfile = async () => {
    if (!profile?._id) return;
    if (!confirm("Are you sure you want to delete your profile?")) return;

    try {
      const res = await fetch(`/api/designers/profile/${profile._id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Profile deleted successfully!");
        setProfile(null);
      } else {
        alert("Failed to delete profile");
      }
    } catch (error) {
      console.error("Error deleting profile:", error);
    }
  };

  const addPortfolioItem = () => {
    setProfileForm({
      ...profileForm,
      portfolio: [...profileForm.portfolio, { url: "", title: "", description: "" }],
    });
    setPortfolioFiles([...portfolioFiles, null]);
    setPortfolioPreviews([...portfolioPreviews, null]);
  };

  const updatePortfolioItem = (index: number, field: string, value: string) => {
    const updated = profileForm.portfolio.map((p, i) =>
      i === index ? { ...p, [field]: value } : p
    );
    setProfileForm({ ...profileForm, portfolio: updated });
  };

  const removePortfolioItem = (index: number) => {
    const updated = profileForm.portfolio.filter((_, i) => i !== index);
    setProfileForm({ ...profileForm, portfolio: updated });
    setPortfolioFiles(portfolioFiles.filter((_, i) => i !== index));
    // revoke preview URL if any
    const previewToRevoke = portfolioPreviews[index];
    if (previewToRevoke && previewToRevoke.startsWith("blob:")) {
      URL.revokeObjectURL(previewToRevoke);
    }
    setPortfolioPreviews(portfolioPreviews.filter((_, i) => i !== index));
  };

  const handlePortfolioFileChange = (index: number, file: File | null) => {
    const files = [...portfolioFiles];
    const previews = [...portfolioPreviews];

    // revoke previous preview if present
    const prev = previews[index];
    if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);

    files[index] = file;
    previews[index] = file ? URL.createObjectURL(file) : null;

    setPortfolioFiles(files);
    setPortfolioPreviews(previews);
  };

  // upload helper for Cloudinary (unsigned preset)
  const uploadToCloudinary = async (file: File) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET");
    }

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", uploadPreset);

    const res = await fetch(url, { method: "POST", body: fd });
    if (!res.ok) throw new Error("Cloudinary upload failed");
    const data = await res.json();
    return data.secure_url as string;
  };

  if (status === "loading" || loading) {
    return (
      <Loader message="Loading your dashboard..." />
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
          <Link href="/" className="text-2xl font-bold text-indigo-600">
            Creative Link
          </Link>
          <nav className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="text-gray-700 hover:text-indigo-600 transition-colors"
            >
              Dashboard
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              Sign Out
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Freelancer Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your profile and project requests
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Your Profile
              </h2>
              <div className="flex space-x-2">
                {showProfileForm && profile && (
                  <button
                    onClick={handleDeleteProfile}
                    className="flex items-center gap-1 bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                )}
                <button
                  onClick={() => setShowProfileForm(!showProfileForm)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
                >
                  {showProfileForm ? "Cancel" : profile ? "Edit" : "Create"}
                </button>
              </div>
            </div>

            {showProfileForm ? (
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    value={profileForm.title}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, title: e.target.value })
                    }
                    required
                    className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Bio
                  </label>
                  <textarea
                    value={profileForm.bio}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, bio: e.target.value })
                    }
                    required
                    rows={3}
                    className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    required
                    value={profileForm.category}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        category: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select a category</option>
                    <option value="Brand & Identity">Brand & Identity</option>
                    <option value="UI/UX">UI/UX</option>
                    <option value="Marketing & Advertising">
                      Marketing & Advertising
                    </option>
                    <option value="Packaging">Packaging</option>
                    <option value="Illustration">Illustration</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    value={profileForm.skills}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, skills: e.target.value })
                    }
                    placeholder="e.g. React, Figma, Tailwind"
                    className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hourly Rate ($)
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={profileForm.rate}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, rate: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Availability
                    </label>
                    <select
                      value={profileForm.availability}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          availability: e.target.value,
                        })
                      }
                      className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="available">Available</option>
                      <option value="unavailable">Unavailable</option>
                    </select>
                  </div>
                </div>

                {/* Portfolio inputs */}
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Portfolio</h4>
                  <p className="text-sm text-gray-500 mb-3">Add portfolio items with an image URL, title and short description.</p>

                  <div className="space-y-4">
                    {profileForm.portfolio.map((item, idx) => (
                      <div key={idx} className="border rounded-lg p-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-start">
                          <div className="sm:col-span-1">
                            <label className="block text-sm font-medium text-gray-700">Image</label>
                            <div className="mt-1 flex items-center gap-3">
                              <div className="w-28 h-20 bg-gray-50 flex items-center justify-center overflow-hidden border rounded">
                                {portfolioPreviews[idx] ? (
                                  // preview from selected file
                                  // use img tag to avoid next/image domain restrictions for blob URLs
                                  <img src={portfolioPreviews[idx] || undefined} alt={item.title || `preview-${idx}`} className="object-cover w-full h-full" />
                                ) : item.url ? (
                                  <img src={item.url} alt={item.title || `preview-${idx}`} className="object-cover w-full h-full" />
                                ) : (
                                  <div className="text-gray-400 text-xs">No image</div>
                                )}
                              </div>

                              <div className="flex flex-col">
                                <label htmlFor={`portfolio-file-${idx}`} className="cursor-pointer px-3 py-1 bg-gray-100 rounded text-sm">
                                  Choose image
                                </label>
                                <input
                                  id={`portfolio-file-${idx}`}
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handlePortfolioFileChange(idx, e.target.files?.[0] ?? null)}
                                  className="hidden"
                                />
                                {portfolioPreviews[idx] && (
                                  <button type="button" onClick={() => handlePortfolioFileChange(idx, null)} className="mt-2 text-xs text-red-600 hover:underline">
                                    Remove selected
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="sm:col-span-1">
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => updatePortfolioItem(idx, "title", e.target.value)}
                              placeholder="Project title"
                              className="mt-1 w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>

                          <div className="sm:col-span-1">
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) => updatePortfolioItem(idx, "description", e.target.value)}
                              placeholder="Short description"
                              className="mt-1 w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                        </div>

                        <div className="mt-2 flex justify-end">
                          <button
                            type="button"
                            onClick={() => removePortfolioItem(idx)}
                            className="text-sm text-red-600 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}

                    <div>
                      <button
                        type="button"
                        onClick={addPortfolioItem}
                        className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 px-3 py-2 rounded-md hover:bg-gray-200"
                      >
                        + Add portfolio item
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition mt-4"
                >
                  {profile ? "Update Profile" : "Create Profile"}
                </button>
              </form>
            ) : (
              <div>
                {profile ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="shrink-0 ">
                        {profile.userId?.avatarUrl ? (
                          <Image
                            src={profile.userId.avatarUrl}
                            alt="Profile Image"
                            width={64}
                            height={64}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 flex items-center justify-center rounded-full bg-indigo-100">
                            <User className="text-indigo-600 h-8 w-8" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {profile.title}
                        </h3>
                        <p className="text-gray-600">{profile.bio}</p>
                      </div>
                    </div>

                    <div className="flex items-center flex-wrap gap-3">
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm">
                        {profile.category}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          profile.availability === "available"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {profile.availability}
                      </span>
                      <span className="font-semibold text-indigo-600">
                        ${profile.rate}/hr
                      </span>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Portfolio Display */}
                    <div>
                      <h4 className="font-medium text-gray-900 mt-4 mb-2">Portfolio</h4>
                      {profile.portfolio && profile.portfolio.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {profile.portfolio.map((p, i) => (
                            <div key={i} className="border rounded-lg overflow-hidden bg-white">
                              <div className="h-40 w-full bg-gray-50 flex items-center justify-center overflow-hidden">
                                {p.url ? (
                                  <Image
                                    src={p.url}
                                    alt={p.title || `Portfolio ${i + 1}`}
                                    width={480}
                                    height={240}
                                    className="object-cover w-full h-40"
                                  />
                                ) : (
                                  <div className="text-gray-400">No image</div>
                                )}
                              </div>
                              <div className="p-3">
                                <h5 className="font-semibold text-gray-900">{p.title}</h5>
                                <p className="text-sm text-gray-600 mt-1">{p.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No portfolio items yet.</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <User className="h-16 w-16 text-indigo-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">
                      You haven&apos;t created your profile yet.
                    </p>
                    <button
                      onClick={() => setShowProfileForm(true)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
                    >
                      Create Profile
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Project Requests */}
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Project Requests
            </h2>
            {projectRequests.length > 0 ? (
              <div className="space-y-4">
                {projectRequests.map((request) => (
                  <div
                    key={request._id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {request.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {request.description}
                        </p>
                        <p className="text-sm text-gray-500">
                          Budget: ${request.budget}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-700">
                          {request.clientId?.name}
                        </p>
                        <a
                          href={`mailto:${request.clientId?.email}`}
                          className="text-sm text-indigo-600 hover:underline"
                        >
                          {request.clientId?.email}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No project requests yet.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
