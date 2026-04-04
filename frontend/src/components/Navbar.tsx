'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';
import { useAuth } from '@/lib/useAuth';

export default function Navbar() {
  const router = useRouter();
  const { isAuthenticated, email, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="bg-black text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          🔐 TALA
        </Link>
        
        <div className="flex gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm">{email}</span>
              <Link href="/dashboard" className="hover:underline">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="hover:underline">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline">
                Login
              </Link>
              <Link href="/register" className="hover:underline">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
