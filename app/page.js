'use client';

import { useState } from 'react';
import Link from 'next/link';

const menuItems = [
  {
    title: 'Hähnchen-Gemüsepfanne mit Reis',
    image: '/reis_haehnchen_pfanne_2.jpg',
    studentPrice: '10.00',
    teacherPrice: '12.00'
  },
  {
    title: 'Spaghetti mit Hackfleisch-Tomatensauce',
    image: '/202_spaghetti-bolognese.jpg',
    studentPrice: '10.00',
    teacherPrice: '12.00'
  },
  {
    title: 'Gemüse-Lasagne mit Spinat und Ricotta',
    image: '/Download.jpg',
    studentPrice: '10.00',
    teacherPrice: '12.00'
  }
];

const weekDays = ['Mo', 'Di', 'Mi', 'Do', 'Fr'];

export default function Home() {
  const [currentDay, setCurrentDay] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <button className="text-2xl font-bold text-gray-800 hover:text-gray-600 transition-colors">
            Mensa-BZZ
          </button>
          <div className="space-x-6">
            <Link 
              href="/login" 
              className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Anmelden
            </Link>
            <Link 
              href="/register" 
              className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Registrieren
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 pt-28 pb-24">
        <div className="max-w-4xl mx-auto bg-[#fdf1cc] rounded-3xl p-8 shadow-lg">
          <h1 className="text-4xl font-bold text-center mb-3 text-gray-800">Menu-Montag</h1>
          <h2 className="text-2xl font-semibold text-center mb-12 text-gray-700">Hauptgang</h2>

          <div className="space-y-10">
            {menuItems.map((item, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-full md:w-56 h-56 bg-gray-100 rounded-full overflow-hidden shadow-md">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-semibold mb-6 text-gray-800">{item.title}</h3>
                    <div className="space-y-3">
                      <p className="text-gray-600 text-lg">
                        <span className="font-medium">Schüler:</span> {item.studentPrice} CHF
                      </p>
                      <p className="text-gray-600 text-lg">
                        <span className="font-medium">Lehrer:</span> {item.teacherPrice} CHF
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <button
              onClick={() => setCurrentDay((prev) => (prev > 0 ? prev - 1 : 6))}
              className="text-3xl text-gray-600 hover:text-gray-800 transition-colors p-2 hover:bg-gray-100 rounded-full"
            >
              ←
            </button>
            
            <div className="flex space-x-6">
              {weekDays.map((day, index) => (
                <button
                  key={day}
                  onClick={() => setCurrentDay(index)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentDay === index
                      ? 'font-bold text-gray-800 bg-gray-100'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentDay((prev) => (prev < 6 ? prev + 1 : 0))}
              className="text-3xl text-gray-600 hover:text-gray-800 transition-colors p-2 hover:bg-gray-100 rounded-full"
            >
              →
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
} 