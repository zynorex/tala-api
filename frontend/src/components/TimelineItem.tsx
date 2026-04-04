'use client';

import { formatTime, formatDate } from '@/lib/utils';

interface TimelineItemProps {
  time: string;
  title: string;
  description: string;
  status?: 'pending' | 'completed';
}

export default function TimelineItem({ time, title, description, status = 'pending' }: TimelineItemProps) {
  const isCompleted = status === 'completed';

  return (
    <div className="timeline-item pl-16 relative">
      <div className={`absolute left-0 top-0 w-12 h-12 border-4 border-black rounded-full flex items-center justify-center text-xs font-bold ${
        isCompleted ? 'bg-green-400 border-green-600' : 'bg-white border-black'
      }`}>
        {time}
      </div>
      <div className={`border-4 border-black p-4 ${isCompleted ? 'bg-green-50' : 'bg-white'}`}>
        <h4 className="font-bold text-lg">{title}</h4>
        <p className="text-sm mt-1">{description}</p>
      </div>
    </div>
  );
}
