'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
    router.push('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-800 hover:text-gray-600 transition-colors">
          Mensa-BZZ
        </Link>
        <div className="space-x-6">
          {loggedIn ? (
            <button onClick={handleLogout} className="text-gray-600 hover:text-gray-800 font-medium transition-colors">
              Logout
            </button>
          ) : (
            <>
              <Link href="/login" className="text-gray-600 hover:text-gray-800 font-medium transition-colors">
                Anmelden
              </Link>
              <Link href="/register" className="text-gray-600 hover:text-gray-800 font-medium transition-colors">
                Registrieren
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
