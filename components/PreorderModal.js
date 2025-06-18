'use client';
import { useState } from 'react';

export default function PreorderModal({ meal, isOpen, onClose }) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

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

    setLoading(true);
    try {
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
        }, 2000);
      } else {
        const data = await res.json();
        setMessage(data.error || 'Fehler beim Bestellen');
      }
    } catch (error) {
      console.error('Fehler beim Bestellen:', error);
      setMessage('Netzwerkfehler beim Bestellen');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/20 slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Vorbestellung</h3>
              <p className="text-sm text-slate-500">Bestellen Sie Ihr Gericht</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Meal Info */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6 border border-blue-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-slate-800 text-lg">{meal.title}</h4>
              <div className="flex items-center space-x-4 mt-1">
                <div className="text-center">
                  <p className="text-xs text-slate-500">Schüler</p>
                  <p className="font-bold text-blue-600">{meal.student_price} CHF</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-500">Lehrer</p>
                  <p className="font-bold text-blue-600">{meal.teacher_price} CHF</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Abholdatum
            </label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="input-field"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Abholzeit
            </label>
            <input
              type="time"
              min="11:00"
              max="13:00"
              value={time}
              onChange={e => setTime(e.target.value)}
              className="input-field"
            />
            <p className="text-xs text-slate-500 mt-1">
              Bestellungen nur von 11:00 bis 13:00 Uhr möglich
            </p>
          </div>

          {/* Message */}
          {message && (
            <div className={`p-3 rounded-xl text-sm font-medium ${
              message.toLowerCase().includes('erfolgreich')
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button 
              onClick={onClose} 
              className="btn-secondary flex-1"
              disabled={loading}
            >
              Abbrechen
            </button>
            <button 
              onClick={handleOrder} 
              className="btn-primary flex-1"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <div className="spinner w-4 h-4"></div>
                  <span>Bestelle...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <span>Bestellen</span>
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-start space-x-2">
            <svg className="w-4 h-4 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-xs text-slate-600">
              <p className="font-medium mb-1">Wichtige Hinweise:</p>
              <ul className="space-y-1">
                <li>• Bestellungen sind nur für den aktuellen Tag möglich</li>
                <li>• Abholung zwischen 11:00 und 13:00 Uhr</li>
                <li>• Bezahlung erfolgt bei der Abholung</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
