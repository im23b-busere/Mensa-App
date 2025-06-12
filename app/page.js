'use client';

import { useState } from 'react';
import PreorderModal from '../components/PreorderModal';

const menus = {
  montag: [
    {
      title: 'Hähnchen-Gemüsepfanne mit Reis',
      image: '/reis_haehnchen_pfanne_2.jpg',
      studentPrice: '10.00',
      teacherPrice: '12.00',
      day: 'montag'
    },
    {
      title: 'Spaghetti mit Hackfleisch-Tomatensauce',
      image: '/202_spaghetti-bolognese.jpg',
      studentPrice: '10.00',
      teacherPrice: '12.00',
      day: 'montag'
    },
    {
      title: 'Gemüse-Lasagne mit Spinat und Ricotta',
      image: '/Download.jpg',
      studentPrice: '10.00',
      teacherPrice: '12.00',
      day: 'montag'
    }
  ],
  dienstag: [
    {
      title: 'Rindergeschnetzeltes mit Reis',
      image: '/reis_haehnchen_pfanne_2.jpg',
      studentPrice: '10.00',
      teacherPrice: '12.00',
      day: 'dienstag'
    },
    {
      title: 'Penne Arrabiata',
      image: '/202_spaghetti-bolognese.jpg',
      studentPrice: '10.00',
      teacherPrice: '12.00',
      day: 'dienstag'
    },
    {
      title: 'Gemüse-Curry',
      image: '/Download.jpg',
      studentPrice: '10.00',
      teacherPrice: '12.00',
      day: 'dienstag'
    }
  ],
  mittwoch: [
    {
      title: 'Fischstäbchen mit Kartoffelsalat',
      image: '/reis_haehnchen_pfanne_2.jpg',
      studentPrice: '10.00',
      teacherPrice: '12.00',
      day: 'mittwoch'
    },
    {
      title: 'Käsespätzle',
      image: '/202_spaghetti-bolognese.jpg',
      studentPrice: '10.00',
      teacherPrice: '12.00',
      day: 'mittwoch'
    },
    {
      title: 'Tomaten-Mozzarella-Auflauf',
      image: '/Download.jpg',
      studentPrice: '10.00',
      teacherPrice: '12.00',
      day: 'mittwoch'
    }
  ],
  donnerstag: [
    {
      title: 'Schweinebraten mit Knödel',
      image: '/reis_haehnchen_pfanne_2.jpg',
      studentPrice: '10.00',
      teacherPrice: '12.00',
      day: 'donnerstag'
    },
    {
      title: 'Nudelauflauf',
      image: '/202_spaghetti-bolognese.jpg',
      studentPrice: '10.00',
      teacherPrice: '12.00',
      day: 'donnerstag'
    },
    {
      title: 'Grüne Bohnen Eintopf',
      image: '/Download.jpg',
      studentPrice: '10.00',
      teacherPrice: '12.00',
      day: 'donnerstag'
    }
  ],
  freitag: [
    {
      title: 'Currywurst mit Pommes',
      image: '/reis_haehnchen_pfanne_2.jpg',
      studentPrice: '10.00',
      teacherPrice: '12.00',
      day: 'freitag'
    },
    {
      title: 'Pizza Margherita',
      image: '/202_spaghetti-bolognese.jpg',
      studentPrice: '10.00',
      teacherPrice: '12.00',
      day: 'freitag'
    },
    {
      title: 'Linsensuppe',
      image: '/Download.jpg',
      studentPrice: '10.00',
      teacherPrice: '12.00',
      day: 'freitag'
    }
  ]
};

const weekDays = ['Mo', 'Di', 'Mi', 'Do', 'Fr'];
const dayKeys = ['montag', 'dienstag', 'mittwoch', 'donnerstag', 'freitag'];

export default function Home() {
  const [currentDay, setCurrentDay] = useState(0);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const currentDayKey = dayKeys[currentDay];
  const menuItems = menus[currentDayKey];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Main Content */}
      <main className="container mx-auto px-6 pt-8 pb-24">
        <div className="max-w-4xl mx-auto bg-[#fdf1cc] rounded-3xl p-8 shadow-lg">
          <h1 className="text-4xl font-bold text-center mb-3 text-gray-800">{`Menu-${currentDayKey.charAt(0).toUpperCase() + currentDayKey.slice(1)}`}</h1>
          <h2 className="text-2xl font-semibold text-center mb-12 text-gray-700">Hauptgang</h2>

          <div className="grid gap-10 sm:grid-cols-2">
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
                  <div className="mt-4">
                    <button
                      onClick={() => setSelectedMeal(item)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    >
                      Vorbestellen
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <PreorderModal
        meal={selectedMeal || {}}
        isOpen={selectedMeal !== null}
        onClose={() => setSelectedMeal(null)}
      />

      {/* Footer Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <button
              onClick={() => setCurrentDay((prev) => (prev > 0 ? prev - 1 : dayKeys.length - 1))}
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
              onClick={() => setCurrentDay((prev) => (prev < dayKeys.length - 1 ? prev + 1 : 0))}
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