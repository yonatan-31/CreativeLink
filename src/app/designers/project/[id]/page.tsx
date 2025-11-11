"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Loader from "@/components/Loader";

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [project, setProject] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [coverLetter, setCoverLetter] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!params?.id) return;

    if (!session) {
      router.push("/auth/signin");
      return;
    }

    fetchProject();
  }, [params?.id]);

  const fetchProject = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/client-projects?status=open&limit=1&id=${params.id}`
      );
      if (res.ok) {
        const data = await res.json();

        setProject(
          Array.isArray(data.projects) ? data.projects[0] : data.projects
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const apply = async () => {
    if (!coverLetter.trim()) return alert("Please add a cover letter");
    setSubmitting(true);
    try {
      const res = await fetch(`/api/client-projects/${params.id}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverLetter }),
      });
      if (res.ok) {
        alert("Applied");
        router.push("/dashboard/findProjects");
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data?.message || "Failed to apply");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to apply");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;
  if (!project) return <div className="p-6">Project not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">{project.title}</h1>
      <div className="text-sm text-gray-500 mb-4">
        Budget: {project.budget} • Category: {project.category}
      </div>
      <div className="bg-white p-4 rounded mb-4">{project.description}</div>

      <div className="bg-white p-4 rounded">
        <h3 className="font-semibold mb-2">Apply to this project</h3>
        <textarea
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          rows={6}
          className="w-full border rounded p-2 mb-3 outline-none focus:outline-indigo-500 "
          placeholder="Write a short cover letter..."
        ></textarea>
        <div className="flex justify-end">
          <button
            onClick={apply}
            disabled={submitting}
            className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {submitting ? "Applying..." : "Apply"}
          </button>
        </div>
      </div>
    </div>
  );
}
