'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur shadow z-20">
      <div className="container mx-auto px-4 sm:px-8 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-extrabold tracking-tight text-primary hover:text-primary-dark transition-colors">
          Mensa-BZZ
        </Link>
        <nav className="flex items-center gap-4 sm:gap-8">
          {isAuthenticated ? (
            <button onClick={handleLogout} className="text-gray-500 hover:text-primary-dark font-medium px-3 py-1 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30">
              Logout
            </button>
          ) : (
            <>
              <Link href="/login" className="text-gray-500 hover:text-primary-dark font-medium px-3 py-1 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30">
                Anmelden
              </Link>
              <Link href="/register" className="text-gray-500 hover:text-primary-dark font-medium px-3 py-1 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30">
                Registrieren
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
