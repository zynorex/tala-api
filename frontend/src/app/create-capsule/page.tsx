'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { capsuleAPI } from '@/lib/api';
import { useAuth } from '@/lib/useAuth';

export default function CreateCapsule() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fileHash: '',
    unlockDays: 7,
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const hash = require('crypto').createHash('sha256').update(event.target?.result).digest('hex');
        setFormData({
          ...formData,
          fileHash: hash,
        });
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const unlockTime = Math.floor(Date.now() / 1000) + formData.unlockDays * 24 * 60 * 60;

      const response = await capsuleAPI.create(
        formData.title,
        formData.description,
        formData.fileHash,
        unlockTime
      );

      router.push(`/capsule/${response.data.id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create capsule');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated && !isLoading) {
    return <Layout><div className="p-8">Redirecting...</div></Layout>;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-black mb-8">CREATE CAPSULE</h1>

          <div className="card">
            {error && (
              <div className="bg-red-100 border-2 border-red-600 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block font-bold mb-2">Capsule Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Board Exam Results - March 2026"
                  className="w-full border-2 border-black p-3"
                  required
                />
              </div>

              <div>
                <label className="block font-bold mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe what this capsule contains..."
                  className="w-full border-2 border-black p-3 h-24"
                  required
                />
              </div>

              <div>
                <label className="block font-bold mb-2">Upload File</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full border-2 border-black p-3"
                  required
                />
                {formData.fileHash && (
                  <p className="text-xs mt-2 text-green-600 font-mono break-all">
                    ✓ Hash: {formData.fileHash.substring(0, 32)}...
                  </p>
                )}
              </div>

              <div>
                <label className="block font-bold mb-2">Unlock After (Days)</label>
                <select
                  name="unlockDays"
                  value={formData.unlockDays}
                  onChange={handleChange}
                  className="w-full border-2 border-black p-3"
                >
                  <option value="1">1 Day</option>
                  <option value="7">7 Days</option>
                  <option value="30">30 Days</option>
                  <option value="90">90 Days</option>
                  <option value="180">180 Days</option>
                  <option value="365">1 Year</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading || !formData.fileHash}
                className="btn-primary w-full"
              >
                {loading ? 'Creating...' : 'CREATE CAPSULE'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
