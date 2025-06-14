'use client';
import { useState } from 'react';

export default function PreorderModal({ meal, isOpen, onClose }) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [message, setMessage] = useState('');

  const handleOrder = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Bitte zuerst anmelden');
      return;
    }

    // Zeitfenster prüfen (nur zwischen 11:00 und 13:00 Uhr)
    if (!time) {
      setMessage('Bitte eine Abholzeit auswählen');
      return;
    }
    const [hour, minute] = time.split(':').map(Number);
    if (hour < 11 || hour > 13 || (hour === 13 && minute > 0)) {
      setMessage('Bestellungen sind nur von 11:00 bis 13:00 Uhr möglich');
      return;
    }

    // Tag prüfen, falls im Meal definiert
    if (meal.day && date) {
      const weekday = new Date(date)
        .toLocaleDateString('de-DE', { weekday: 'long' })
        .toLowerCase();
      if (weekday !== meal.day.toLowerCase()) {
        setMessage('Gericht an diesem Tag nicht verfügbar');
        return;
      }
    }

    const res = await fetch('/api/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ mealName: meal.title, date, time, day: meal.day }),
    });
    if (res.ok) {
      setMessage('Vorbestellung erfolgreich!');
      setTimeout(() => {
        setMessage('');
        onClose();
      }, 1500);
    } else {
      const data = await res.json();
      setMessage(data.error || 'Fehler beim Bestellen');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <div className="bg-white rounded-lg p-6 w-80 space-y-4">
        <h3 className="text-lg font-semibold">{meal.title}</h3>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="time"
          min="11:00"
          max="13:00"
          value={time}
          onChange={e => setTime(e.target.value)}
          className="w-full border p-2 rounded"
        />
        {message && (
          <p
            className={`text-center text-sm ${
              message.toLowerCase().includes('erfolgreich')
                ? 'text-green-600'
                : 'text-red-600'
            }`}
          >
            {message}
          </p>
        )}
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200">Abbrechen</button>
          <button onClick={handleOrder} className="px-4 py-2 rounded bg-indigo-600 text-white">Bestellen</button>
        </div>
      </div>
    </div>
  );
}
