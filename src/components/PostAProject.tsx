"use client";

import { useState } from "react";

export default function PostAProject({
  onCreated,
}: {
  onCreated?: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [category, setCategory] = useState("");
  const [deadline, setDeadline] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/client-projects/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          budget: Number(budget),
          category,
          deadline,
        }),
      });
      if (res.ok) {
        setTitle("");
        setDescription("");
        setBudget("");
        setCategory("");
        setDeadline("");
        onCreated?.();
        // notify any listeners (lists) to refresh immediately
        try {
          window.dispatchEvent(new CustomEvent('clientProject:created'));
        } catch (e) {
          // ignore in non-browser environments
        }
        alert("Project posted");
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data?.message || "Failed to create project");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to create project");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Post a Project</h3>

      <div className="grid grid-cols-1 gap-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
          className="border px-3 py-2 rounded"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
          className="border px-3 py-2 rounded"
          rows={4}
        />
        <input
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          placeholder="Budget"
          required
          type="number"
          className="border px-3 py-2 rounded"
        />
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
          className="border px-3 py-2 rounded"
        />
        <label className="block font-semibold">Deadline (optional)</label>
        <input
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          placeholder="Deadline"
          type="date"
          className="border px-3 py-2 rounded"
        />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {isSubmitting ? "Posting..." : "Post Project"}
          </button>
        </div>
      </div>
    </form>
  );
}
