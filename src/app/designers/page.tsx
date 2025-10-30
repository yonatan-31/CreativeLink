 'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
  ratingAvg: number;
  reviewsCount: number;
}

export default function DesignersPage() {
  const [designers, setDesigners] = useState<Designer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    minRate: '',
    maxRate: '',
    availability: '',
  });

  useEffect(() => {
    fetchDesigners();
  }, []);

  const fetchDesigners = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.minRate) queryParams.append('minRate', filters.minRate);
      if (filters.maxRate) queryParams.append('maxRate', filters.maxRate);
      if (filters.availability) queryParams.append('availability', filters.availability);

      const response = await fetch(`/api/designers?${queryParams}`);
      if (response.ok) {
        const data = await response.json();
        setDesigners(data);
      }
    } catch (error) {
      console.error('Error fetching designers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setLoading(true);
    fetchDesigners();
  };

  if (loading) {
    return <Loader message="Loading designers..." />;
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
              <Link href="/dashboard" className="text-gray-700 hover:text-indigo-600">
                Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-white border-y shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Categories</option>
                <option value="Brand & Identity">Brand & Identity</option>
                <option value="UI/UX">UI/UX</option>
                <option value="Marketing & Advertising">Marketing & Advertising</option>
                <option value="Packaging">Packaging</option>
                <option value="Illustration">Illustration</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Rate ($/hr)
              </label>
              <input
                type="number"
                value={filters.minRate}
                onChange={(e) => handleFilterChange('minRate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Rate ($/hr)
              </label>
              <input
                type="number"
                value={filters.maxRate}
                onChange={(e) => handleFilterChange('maxRate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="1000"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={applyFilters}
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Designers Grid */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Browse Designers</h1>
          
          {designers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No designers found matching your criteria.</p>
              <p className="text-gray-400 mt-2">Try adjusting your filters or check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {designers.map((designer) => (
                <div key={designer._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                        {designer.userId.avatarUrl ? (
                          <img
                            src={designer.userId.avatarUrl}
                            alt={designer.userId.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-indigo-600 font-semibold text-lg">
                            {designer.userId.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {designer.userId.name}
                        </h3>
                        <p className="text-sm text-gray-500">{designer.title}</p>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {designer.bio}
                    </p>

                    <div className="mb-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        designer.availability === 'available' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {designer.availability}
                      </span>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800 ml-2">
                        {designer.category}
                      </span>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Rating</span>
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <span className="ml-1 font-medium">
                            {designer.ratingAvg.toFixed(1)} ({designer.reviewsCount} reviews)
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-1">
                        <span className="text-gray-500">Rate</span>
                        <span className="font-semibold text-indigo-600">
                          ${designer.rate}/hr
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {designer.skills.slice(0, 3).map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                          >
                            {skill}
                          </span>
                        ))}
                        {designer.skills.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            +{designer.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <Link
                      href={`/designers/${designer.userId._id}`}
                      className="w-full bg-indigo-600 text-white text-center py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors block"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

