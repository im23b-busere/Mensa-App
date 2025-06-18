'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login fehlgeschlagen');
        return;
      }
      login(data.token);
      router.push('/');
    } catch {
      setError('Login fehlgeschlagen');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="w-full max-w-md space-y-6 bg-white/90 backdrop-blur p-8 rounded-2xl shadow-xl border border-gray-100">
        <h1 className="text-center text-3xl font-extrabold text-gray-900 tracking-tight">Anmelden</h1>
        {error && <p className="text-center text-red-500 text-sm font-medium">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="E-Mail-Adresse"
            className="w-full border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary/30 p-3 rounded-lg bg-gray-50 text-gray-800 placeholder-gray-400 transition"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Passwort"
            className="w-full border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary/30 p-3 rounded-lg bg-gray-50 text-gray-800 placeholder-gray-400 transition"
          />
          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold shadow hover:bg-primary-dark transition"
          >
            Anmelden
          </button>
        </form>
        <p className="text-center text-sm text-gray-500">
          Noch keinen Account?{' '}
          <Link href="/register" className="text-primary font-medium hover:underline">
            Registrieren
          </Link>
        </p>
      </div>
    </div>
  );
}
