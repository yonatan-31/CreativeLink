'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Loader from '@/components/Loader';

interface Designer {
  _id: string;
  userId: {
    _id: string;
    name: string;
    avatarUrl?: string;
  };
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
  ratingAvg: number;
  reviewsCount: number;
}

interface Review {
  _id: string;
  clientId: {
    name: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

export default function DesignerProfile() {
  const params = useParams();
  const { data: session } = useSession();
  const [designer, setDesigner] = useState<Designer | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    budget: '',
  });
console.log('reviews',reviews);
  useEffect(() => {
    if (params.id) {
      fetchDesigner();
      fetchReviews();
    }
  }, [params.id]);

  const fetchDesigner = async () => {
    try {
      const response = await fetch(`/api/designers/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setDesigner(data);
      }
    } catch (error) {
      console.error('Error fetching designer:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews?designerId=${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !designer) return;

    try {
      const response = await fetch('/api/projects/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          designerId: designer.userId._id,
          title: projectForm.title,
          description: projectForm.description,
          budget: Number(projectForm.budget),
        }),
      });

      if (response.ok) {
        alert('Project request sent successfully!');
        setShowProjectForm(false);
        setProjectForm({ title: '', description: '', budget: '' });
      } else {
        alert('Failed to send project request');      }
    } catch (error) {
      console.error('Error sending project request:', error);
      alert('Failed to send project request');
    }
  };

  if (loading) {
    return (
      <Loader message="Loading designer profile..." />  
    );
  }

  if (!designer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Designer not found</h1>
          <Link href="/designers" className="text-indigo-600 hover:text-indigo-500">
            ← Back to designers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-indigo-600">
                Creative Link
              </Link>
            </div>
            <nav className="flex items-center space-x-4">
              <Link href="/designers" className="text-gray-700 hover:text-indigo-600">
                ← Back to Designers
              </Link>
              <Link href="/dashboard" className="text-gray-700 hover:text-indigo-600">
                Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Designer Info */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-start space-x-4">
                  <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
                    {designer.userId.avatarUrl ? (
                      <img
                        src={designer.userId.avatarUrl}
                        alt={designer.userId.name}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-indigo-600 font-bold text-2xl">
                        {designer.userId.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900">{designer.userId.name}</h1>
                    <p className="text-xl text-gray-600">{designer.title}</p>
                    <div className="mt-2 flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        designer.availability === 'available' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {designer.availability}
                      </span>
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                        {designer.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">About</h2>
                  <p className="text-gray-600">{designer.bio}</p>
                </div>

                <div className="mt-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {designer.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Portfolio</h2>
                  {designer.portfolio.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {designer.portfolio.map((item, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <img
                            src={item.url}
                            alt={item.title}
                            className="w-full h-48 object-cover rounded-md mb-3"
                          />
                          <h3 className="font-semibold text-gray-900">{item.title}</h3>
                          <p className="text-gray-600 text-sm">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No portfolio items yet.</p>
                  )}
                </div>
              </div>

              {/* Reviews */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Reviews</h2>
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review._id} className="border-b pb-4 last:border-b-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">{review.clientId.name}</span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={`text-2xl ${
                                  i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                        <p className="text-gray-400 text-sm mt-2">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No reviews yet.</p>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-yellow-400 text-2xl">★</span>
                    <span className="ml-2 text-2xl font-bold">
                      {designer.ratingAvg.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-gray-600">({designer.reviewsCount} reviews)</p>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Rate</h3>
                  <p className="text-2xl font-bold text-indigo-600">Birr {designer.rate}/hr</p>
                </div>

                {session && (session.user)?.role === 'client' && (
                  <div>
                    {!showProjectForm ? (
                      <button
                        onClick={() => setShowProjectForm(true)}
                        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors font-medium"
                      >
                        Request Project
                      </button>
                    ) : (
                      <form onSubmit={handleProjectSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Project Title
                          </label>
                          <input
                            type="text"
                            required
                            value={projectForm.title}
                            onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <textarea
                            required
                            rows={3}
                            value={projectForm.description}
                            onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Budget (Birr)
                          </label>
                          <input
                            type="number"
                            required
                            min="0"
                            value={projectForm.budget}
                            onChange={(e) => setProjectForm({ ...projectForm, budget: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>

                        <div className="flex space-x-2">
                          <button
                            type="submit"
                            className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
                          >
                            Send Request
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowProjectForm(false)}
                            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}

                {!session && (
                  <div className="text-center">
                    <p className="text-gray-600 mb-4">Sign in to request a project</p>
                    <Link
                      href="/auth/signin"
                      className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors font-medium block"
                    >
                      Sign In
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

