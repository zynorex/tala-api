'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/Layout';
import TimelineItem from '@/components/TimelineItem';
import { capsuleAPI, auditAPI } from '@/lib/api';
import { useAuth } from '@/lib/useAuth';
import { formatDate, formatDatetime, formatTime } from '@/lib/utils';

interface Capsule {
  id: string;
  title: string;
  description: string;
  file_hash: string;
  status: string;
  created_at: number;
  unlock_time: number;
  is_locked: boolean;
  time_remaining: number;
  signature_count: number;
}

interface AuditTrail {
  id: string;
  capsule_id: string;
  action: string;
  actor: string;
  details: string;
  timestamp: number;
}

export default function CapsuleDetail() {
  const router = useRouter();
  const params = useParams();
  const capsuleId = params.id as string;
  const { isAuthenticated, isLoading } = useAuth();
  const [capsule, setCapsule] = useState<Capsule | null>(null);
  const [audits, setAudits] = useState<AuditTrail[]>([]);
  const [loading, setLoading] = useState(true);
  const [signingLoading, setSigningLoading] = useState(false);
  const [unlockLoading, setUnlockLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated && capsuleId) {
      fetchData();
      const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, capsuleId]);

  const fetchData = async () => {
    try {
      const [capsuleRes, auditRes] = await Promise.all([
        capsuleAPI.get(capsuleId),
        auditAPI.getForCapsule(capsuleId),
      ]);
      setCapsule(capsuleRes.data);
      setAudits(auditRes.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSign = async () => {
    setSigningLoading(true);
    setError('');
    try {
      // In production, this would use the user's wallet
      const signature = 'mock-signature-' + Date.now();
      await capsuleAPI.sign(capsuleId, signature);
      await fetchData();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to sign capsule');
    } finally {
      setSigningLoading(false);
    }
  };

  const handleUnlock = async () => {
    setUnlockLoading(true);
    setError('');
    try {
      await capsuleAPI.unlock(capsuleId);
      await fetchData();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to unlock capsule');
    } finally {
      setUnlockLoading(false);
    }
  };

  if (loading || !capsule) {
    return <Layout><div className="p-8">Loading...</div></Layout>;
  }

  const canUnlock = !capsule.is_locked && capsule.time_remaining === 0;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Link href="/dashboard" className="text-black underline mb-4 inline-block">
          ← Back to Dashboard
        </Link>

        <div className="grid grid-cols-3 gap-8 mb-8">
          {/* Main Content */}
          <div className="col-span-2">
            <div className="card mb-8">
              <h1 className="text-4xl font-black mb-4">{capsule.title}</h1>
              <p className="text-lg mb-4">{capsule.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-xs text-gray-600">STATUS</p>
                  <p className="text-xl font-bold">{capsule.status}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">SIGNATURES</p>
                  <p className="text-xl font-bold">{capsule.signature_count}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">CREATED</p>
                  <p className="text-sm font-semibold">{formatDate(capsule.created_at)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">FILE HASH</p>
                  <p className="text-xs font-mono">{capsule.file_hash.substring(0, 16)}...</p>
                </div>
              </div>

              <div className="bg-yellow-50 border-2 border-yellow-400 p-4 mb-6">
                <p className="text-xs text-gray-600 mb-1">UNLOCK TIME</p>
                <p className={`text-3xl font-black ${capsule.is_locked ? 'text-red-600' : 'text-green-600'}`}>
                  {formatTime(capsule.time_remaining)}
                </p>
                <p className="text-xs mt-2">{formatDatetime(capsule.unlock_time)}</p>
              </div>

              {error && (
                <div className="bg-red-100 border-2 border-red-600 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                {capsule.status === 'CREATED' && (
                  <button
                    onClick={handleSign}
                    disabled={signingLoading}
                    className="btn-primary flex-1"
                  >
                    {signingLoading ? 'Signing...' : 'SIGN & COMMIT'}
                  </button>
                )}

                {capsule.status === 'SIGNED' && !capsule.is_locked && (
                  <button
                    onClick={handleUnlock}
                    disabled={unlockLoading}
                    className="btn-primary flex-1"
                  >
                    {unlockLoading ? 'Unlocking...' : 'UNLOCK NOW'}
                  </button>
                )}

                {capsule.is_locked && (
                  <button disabled className="btn-secondary flex-1 opacity-50 cursor-not-allowed">
                    UNLOCK IN {formatTime(capsule.time_remaining)}
                  </button>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="card">
              <h2 className="text-2xl font-black mb-6">TIME CAPSULE TIMELINE</h2>
              <div className="space-y-4">
                <TimelineItem
                  time="T-72H"
                  title="CREATE CAPSULE"
                  description="File encrypted on-device with AES-256-GCM. Metadata hashed client-side."
                  status={capsule.status !== 'CREATED' ? 'completed' : 'pending'}
                />
                <TimelineItem
                  time="T-48H"
                  title="SIGN & COMMIT"
                  description="Wallet signs the unlock schedule, contract records checksums and IPFS pin occurs."
                  status={['SIGNED', 'UNLOCKED'].includes(capsule.status) ? 'completed' : 'pending'}
                />
                <TimelineItem
                  time="T-00H"
                  title="UNLOCK MOMENT"
                  description="$maj is displayed to user"
                  status={capsule.status === 'UNLOCKED' ? 'completed' : 'pending'}
                />
                <TimelineItem
                  time="T+05M"
                  title="AUDIT TRAIL FOREVER"
                  description="Public verifiers read on-chain log + IPFS CID for compliance reports."
                  status="pending"
                />
              </div>
            </div>
          </div>

          {/* Sidebar - Audit Trail */}
          <div className="col-span-1">
            <div className="card">
              <h3 className="text-xl font-black mb-4">AUDIT TRAIL</h3>
              <div className="space-y-3">
                {audits.length === 0 ? (
                  <p className="text-sm text-gray-600">No audit entries yet</p>
                ) : (
                  audits.map((audit) => (
                    <div key={audit.id} className="border-l-4 border-black pl-3">
                      <p className="text-xs font-bold uppercase">{audit.action}</p>
                      <p className="text-xs text-gray-600">{formatDatetime(audit.timestamp)}</p>
                      <p className="text-xs mt-1">{audit.details}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
