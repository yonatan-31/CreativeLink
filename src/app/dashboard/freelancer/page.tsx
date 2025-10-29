"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { User, Trash2 } from "lucide-react";

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
  });

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    fetchProfile();
  }, [session, status, router]);

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
          });
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/designers/profile", {
        method: profile ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...profileForm,
          skills: profileForm.skills
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s),
        }),
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

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
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

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
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
