import React from "react";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Application from "@/models/application";
import ClientProjects from "@/models/clientProjects";
import MessageButton from "@/components/MessageButton";
interface PopulatedApplication {
  _id: string;
  clientProjectId: string;
  coverLetter: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
  designerId?: {
    _id: string;
    name: string;
  } | null;
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session || !session.user) return <div>Unauthorized</div>;
  const { id } = await params;
  await connectDB();
  const project = await ClientProjects.findById(id);
  if (!project) return <div>Client project not found</div>;
  if (project.clientId.toString() !== session.user.id)
    return <div>Forbidden</div>;

  const apps = await Application.find({ clientProjectId: id }).populate(
    "designerId",
    " name"
  );
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">
        Applications for {project.title}
      </h1>
      <div className="space-y-4">
        {apps.length === 0 && (
          <div className="text-gray-500">No applications yet.</div>
        )}
        {apps.map((a: PopulatedApplication) => (
          <div key={a._id} className="bg-white p-4 rounded shadow">
            <div className="flex flex-col sm:flex-row justify-between items-start">
              <div>
                <div className="font-medium">
                  {a.designerId?.name || "Designer"}
                </div>
                <div className="text-sm text-gray-700 mt-2">
                  {a.coverLetter}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 pl-5">
                <a
                  href={`/designers/${a.designerId?._id}`}
                  className="bg-indigo-500 text-white px-2 py-0 rounded"
                >
                  View profile
                </a>
                {a.status === "pending" ? (
                  <form
                    method="post"
                    action={`/api/client-projects/${id}/select`}
                  >
                    <input
                      type="hidden"
                      name="applicationId"
                      value={a._id.toString()}
                    />
                    <button
                      type="submit"
                      className="bg-indigo-600 text-white px-3 py-1 rounded"
                    >
                      Select
                    </button>
                  </form>
                ) : (
                  <div className="text-sm">Status: {a.status}</div>
                )}
                <MessageButton designerId={a.designerId?._id.toString()} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
