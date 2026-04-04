'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import StatCard from '@/components/StatCard';
import { statsAPI } from '@/lib/api';

export default function Home() {
  const [stats, setStats] = useState({
    pilot_exam_windows: 0,
    active_tender_rounds: 0,
    evidence_capsules: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    statsAPI.getPublic()
      .then(res => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-pink-100 border-b-4 border-black py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 items-center">
            <div>
              <div className="mb-4">
                <span className="badge mb-4 inline-block">V2.0 PROTOCOL</span>
              </div>
              <h1 className="text-6xl font-black mb-4">
                TRUST<br />IS CODE.
              </h1>
              <p className="text-lg mb-8 font-semibold">
                Zero-trust time capsules for Indian exam, tender, and evidence workflows.
              </p>
              <div className="flex gap-4">
                <Link href="/dashboard" className="btn-primary">
                  LAUNCH VAULT →
                </Link>
                <button className="btn-secondary">
                  EXPLORE DOCS 📖
                </button>
              </div>
            </div>

            {/* Dynamic Timeline Preview */}
            <div className="border-4 border-green-500 p-6 bg-green-50">
              <div className="badge bg-green-600 mb-4 inline-block">DYNAMIC TIMELINE</div>
              <h3 className="font-bold text-lg mb-4">EVERY UNLOCK<br />PRE-WRITTEN<br />IN CODE.</h3>
              
              <div className="space-y-3 text-sm">
                <div className="border-2 border-black p-3">
                  <div className="font-bold">T-72H</div>
                  <div>CREATE CAPSULE</div>
                  <div className="text-xs mt-1">File encrypted on-device with AES-256-GCM. Metadata hashed client-side.</div>
                </div>
                
                <div className="border-2 border-black p-3">
                  <div className="font-bold">T-48H</div>
                  <div>SIGN & COMMIT</div>
                  <div className="text-xs mt-1">Wallet signs the unlock schedule, contract records checksums and IPFS pin occurs.</div>
                </div>
                
                <div className="border-2 border-black p-3">
                  <div className="font-bold">T-00H</div>
                  <div>UNLOCK MOMENT</div>
                  <div className="text-xs mt-1">$maj</div>
                </div>

                <div className="border-2 border-black p-3">
                  <div className="font-bold">T+05M</div>
                  <div>AUDIT TRAIL FOREVER</div>
                  <div className="text-xs mt-1">Public verifiers read on-chain log + IPFS CID for compliance reports.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-black mb-8">LIVE STATUS</h2>
        <div className="grid grid-cols-3 gap-6">
          <StatCard number={stats.pilot_exam_windows?.toString() || '184'} label="Pilot Exam Windows" />
          <StatCard number={stats.active_tender_rounds?.toString() || '62'} label="Active Tender Rounds" />
          <StatCard number={stats.evidence_capsules?.toString() || '310'} label="Evidence Capsules Queued" />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white p-8 mt-16">
        <div className="container mx-auto text-center">
          <p className="mb-2">© 2026 TALA - Trust is Code</p>
          <p className="text-sm">Zero-trust time capsules for Indian workflows</p>
        </div>
      </footer>
    </Layout>
  );
}
