'use client';
import { useState } from 'react';
import Speiseplan from '../components/Speiseplan';

export default function Home() {
  const [filter, setFilter] = useState('alle');

  return (
    <main className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-gray-900">Mensa App</h1>
            <div className="flex space-x-2">
              <button
                  onClick={() => setFilter('alle')}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                      filter === 'alle'
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:text-gray-900'
                  }`}
              >
                Alle
              </button>
              <button
                  onClick={() => setFilter('vegetarisch')}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                      filter === 'vegetarisch'
                          ? 'bg-green-100 text-green-700'
                          : 'text-gray-700 hover:text-gray-900'
                  }`}
              >
                Vegetarisch
              </button>
              <button
                  onClick={() => setFilter('vegan')}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                      filter === 'vegan'
                          ? 'bg-green-100 text-green-700'
                          : 'text-gray-700 hover:text-gray-900'
                  }`}
              >
                Vegan
              </button>
              <button
                  onClick={() => setFilter('hauptgericht')}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                      filter === 'hauptgericht'
                          ? 'bg-orange-100 text-orange-700'
                          : 'text-gray-700 hover:text-gray-900'
                  }`}
              >
                Hauptgerichte
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Speiseplan filter={filter}/>
      </div>
    </main>
  );
} 