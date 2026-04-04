'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/Layout';
import StatCard from '@/components/StatCard';
import { capsuleAPI, statsAPI } from '@/lib/api';
import { useAuth } from '@/lib/useAuth';
import { formatDate, formatTime } from '@/lib/utils';

interface Capsule {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: number;
  unlock_time: number;
  is_locked: boolean;
  time_remaining: number;
  signature_count: number;
}

export default function Dashboard() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [stats, setStats] = useState({
    pilot_exam_windows: 0,
    active_tender_rounds: 0,
    evidence_capsules: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      const [capsulesRes, statsRes] = await Promise.all([
        capsuleAPI.list(),
        statsAPI.getDashboard(),
      ]);
      setCapsules(capsulesRes.data || []);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || !isAuthenticated) {
    return <Layout><div className="p-8">Loading...</div></Layout>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CREATED':
        return 'bg-blue-100 border-blue-600';
      case 'SIGNED':
        return 'bg-yellow-100 border-yellow-600';
      case 'UNLOCKED':
        return 'bg-green-100 border-green-600';
      default:
        return 'bg-gray-100 border-gray-600';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-black">DASHBOARD</h1>
          <Link href="/create-capsule" className="btn-primary">
            CREATE CAPSULE +
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          <StatCard number={stats.pilot_exam_windows?.toString() || '0'} label="Pilot Exam Windows" />
          <StatCard number={stats.active_tender_rounds?.toString() || '0'} label="Active Tender Rounds" />
          <StatCard number={stats.evidence_capsules?.toString() || '0'} label="Evidence Capsules" />
        </div>

        {/* Capsules List */}
        <div>
          <h2 className="text-2xl font-black mb-6">YOUR CAPSULES</h2>
          {capsules.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-600 mb-4">No capsules created yet</p>
              <Link href="/create-capsule" className="btn-primary inline-block">
                CREATE YOUR FIRST CAPSULE
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {capsules.map((capsule) => (
                <Link
                  key={capsule.id}
                  href={`/capsule/${capsule.id}`}
                  className={`card cursor-pointer hover:shadow-lg transition border-4 ${getStatusColor(
                    capsule.status
                  )}`}
                >
                  <div className="grid grid-cols-4 gap-4 items-center">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{capsule.title}</h3>
                      <p className="text-sm text-gray-600">{capsule.description}</p>
                    </div>
                    <div>
                      <span className="badge bg-black">{capsule.status}</span>
                      <p className="text-xs mt-1">{capsule.signature_count} signatures</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold">Unlock In</p>
                      <p className={`text-lg font-black ${
                        capsule.is_locked ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {formatTime(capsule.time_remaining)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600">Created</p>
                      <p className="text-sm font-semibold">{formatDate(capsule.created_at)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
