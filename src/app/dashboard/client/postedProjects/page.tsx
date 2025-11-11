"use client";

import React, { useState } from "react";
import PostAProject from "@/components/PostAProject";
import ClientProjectsList from "@/components/ClientProjectsList";

const PostedProjects = () => {
    const [count, setCount] = useState(0);
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900">Client Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Manage your projects and post a new Project
        </p>
        <div className="mt-4 text-gray-700">
          You’ve posted <strong>{count}</strong> project{count !== 1 && "s"}.
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-5">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Post a new project</h2>
              <PostAProject onCreated={() => {}} />
            </div>
          </div>

          <div className="md:col-span-7 space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Your Posted Projects
              </h2>
              <ClientProjectsList onCountChange={setCount} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostedProjects;
