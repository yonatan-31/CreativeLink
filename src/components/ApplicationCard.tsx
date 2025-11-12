"use client";

import React, { useState } from "react";
import Link from "next/link";
import MessageButton from "./MessageButton";

interface Application {
  _id: string;
  coverLetter?: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  clientProjectId?: {
    _id: string;
    title: string;
    description: string;
    category?: string;
    budget?: number;
    clientId?: string;
  } | null;
}

interface ApplicationCardProps {
  app: Application;
  onRemoved?: (id: string) => void;
  onUpdated?: (updatedApp: Application) => void;
}

export default function ApplicationCard({
  app,
  onRemoved,
  onUpdated,
}: ApplicationCardProps) {
  const [showCover, setShowCover] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(app.coverLetter || "");
  const [saving, setSaving] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/applications/${app._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverLetter: editText }),
      });
      if (res.ok) {
        const data = await res.json();
        console.log("Saved application data:", data.application);
        if (onUpdated) onUpdated(data.application);

        setEditing(false);
      } else {
        const d = await res.json().catch(() => ({}));
        alert(d?.message || "Failed to save");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleWithdraw = async () => {
    if (!confirm("Withdraw this application?")) return;
    setWithdrawing(true);
    try {
      const res = await fetch(`/api/applications/${app._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        if (onRemoved) onRemoved(app._id);
      } else {
        const d = await res.json().catch(() => ({}));
        alert(d?.message || "Failed to withdraw");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to withdraw");
    } finally {
      setWithdrawing(false);
    }
  };

  const proj = app.clientProjectId || null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col md:flex-row md:justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {proj?.title ?? "Project removed"}
          </h3>
          <p className="text-sm text-gray-600 mt-2 line-clamp-3">
            {proj?.description}
          </p>
          <div className="text-xs text-gray-400 mt-3">
            {proj?.category} • Budget: {proj?.budget ?? "—"}
          </div>
        </div>

        <div className="w-full md:w-48 flex flex-col items-start md:items-end gap-2">
          <div className="text-sm">
            Applied:{" "}
            <span className="text-gray-600">
              {new Date(app.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="text-sm">
            Status:{" "}
            <span
              className={`font-medium ${
                app.status === "accepted"
                  ? "text-green-600"
                  : app.status === "rejected"
                  ? "text-red-600"
                  : "text-yellow-600"
              }`}
            >
              {app.status}
            </span>
          </div>

          <div className="mt-2 flex gap-2">
            {proj ? (
              <Link
                href={`/designers/project/${proj._id}`}
                className="text-indigo-600 hover:underline text-sm"
              >
                View project
              </Link>
            ) : null}
            <MessageButton clientId={proj?.clientId} />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCover((s) => !s)}
            className="text-sm text-indigo-600 hover:bg-blue-100 bg-gray-100 px-2 py-1 rounded"
          >
            {showCover ? "Hide cover letter" : "Show cover letter"}
          </button>
          {app.status === "pending" && (
            <>
              <button
                onClick={() => setEditing(true)}
                className="text-sm text-gray-700 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={handleWithdraw}
                disabled={withdrawing}
                className="text-sm text-red-600 hover:underline"
              >
                {withdrawing ? "Withdrawing..." : "Withdraw"}
              </button>
            </>
          )}
        </div>

        {showCover && (
          <div className="mt-3 bg-gray-50 p-4 rounded text-sm text-gray-800">
            {!editing ? (
              <div className="whitespace-pre-wrap">
                {app.coverLetter || (
                  <span className="text-gray-400">No cover letter</span>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows={6}
                  className="w-full border rounded p-2"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setEditing(false)}
                    className="px-3 py-1 border rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-3 py-1 bg-indigo-600 text-white rounded disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
