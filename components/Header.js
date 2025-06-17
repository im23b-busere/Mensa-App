'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Header() {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();
  const { cartItems } = useCart();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary hover:text-primary-dark transition-colors">
          Mensa-BZZ
        </Link>
        <div className="space-x-6">
          <Link href="/cart" className="text-gray-600 hover:text-primary-dark font-medium transition-colors">
            Warenkorb ({cartItems.length})
          </Link>
          {isAuthenticated ? (
            <button onClick={handleLogout} className="text-gray-600 hover:text-gray-800 font-medium transition-colors">
              Logout
            </button>
          ) : (
            <>
              <Link href="/login" className="text-gray-600 hover:text-primary-dark font-medium transition-colors">
                Anmelden
              </Link>
              <Link href="/register" className="text-gray-600 hover:text-primary-dark font-medium transition-colors">
                Registrieren
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
