'use client';

export default function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="border-4 border-black p-6 bg-white text-center">
      <div className="text-4xl font-black mb-2">~{number}</div>
      <div className="text-sm font-bold uppercase">{label}</div>
    </div>
  );
}
