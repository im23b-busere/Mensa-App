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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-xl shadow">
        <h1 className="text-center text-2xl font-bold text-gray-900">Anmelden</h1>
        {error && <p className="text-center text-red-600">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="E-Mail-Adresse"
            className="w-full border p-2 rounded"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Passwort"
            className="w-full border p-2 rounded"
          />
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded hover:bg-primary-dark"
          >
            Anmelden
          </button>
        </form>
        <p className="text-center text-sm">
          Noch keinen Account?{' '}
          <Link href="/register" className="text-primary hover:underline">
            Registrieren
          </Link>
        </p>
      </div>
    </div>
  );
}
