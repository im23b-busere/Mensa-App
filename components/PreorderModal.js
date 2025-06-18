'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function PreorderModal({ meal, isOpen, onClose }) {
  // State für Formular und UI
  const [pickupTime, setPickupTime] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();

  // Prüft ob ein Tag heute ist
  const isToday = (dayKey) => {
    const today = new Date();
    const dayNames = ['sonntag', 'montag', 'dienstag', 'mittwoch', 'donnerstag', 'freitag', 'samstag'];
    const todayName = dayNames[today.getDay()];
    return todayName === dayKey;
  };

  // Prüft ob ein Gericht heute verfügbar ist
  const isMealAvailableToday = (meal) => {
    return isToday(meal.day);
  };

  // Setzt Standard-Werte beim Öffnen des Modals
  useEffect(() => {
    if (isOpen && meal) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      // Setze Standard-Zeit und Datum
      setPickupTime('12:00');
      setPickupDate(tomorrow.toISOString().split('T')[0]);
      setQuantity(1);
      setError('');
      setSuccess(false);
    }
  }, [isOpen, meal]);

  // Schließt Modal und setzt State zurück
  const handleClose = () => {
    setPickupTime('');
    setPickupDate('');
    setQuantity(1);
    setError('');
    setSuccess(false);
    onClose();
  };

  // Validiert die Eingaben
  const validateForm = () => {
    if (!pickupTime || !pickupDate) {
      setError('Bitte füllen Sie alle Felder aus.');
      return false;
    }

    const selectedDateTime = new Date(`${pickupDate}T${pickupTime}`);
    const now = new Date();
    
    // Prüfe ob Datum in der Zukunft liegt
    if (selectedDateTime <= now) {
      setError('Die Abholzeit muss in der Zukunft liegen.');
      return false;
    }

    // Prüfe ob Datum nicht zu weit in der Zukunft liegt (max. 7 Tage)
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7);
    if (selectedDateTime > maxDate) {
      setError('Bestellungen sind nur bis zu 7 Tage im Voraus möglich.');
      return false;
    }

    // Prüfe ob das Gericht am gewählten Tag verfügbar ist
    const selectedDay = selectedDateTime.toLocaleDateString('de-DE', { weekday: 'long' }).toLowerCase();
    const mealDay = meal.day;
    
    if (selectedDay !== mealDay) {
      setError(`Dieses Gericht ist nur am ${mealDay.charAt(0).toUpperCase() + mealDay.slice(1)} verfügbar.`);
      return false;
    }

    // Prüfe Abholzeit (nur zwischen 11:00 und 13:00)
    const hour = parseInt(pickupTime.split(':')[0]);
    if (hour < 11 || hour >= 13) {
      setError('Abholungen sind nur zwischen 11:00 und 13:00 Uhr möglich.');
      return false;
    }

    return true;
  };

  // Sendet Bestellung an API
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          mealId: meal.id,
          pickupTime: `${pickupDate}T${pickupTime}:00`,
          quantity: quantity
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setError(data.error || 'Ein Fehler ist aufgetreten.');
      }
    } catch (error) {
      setError('Netzwerkfehler. Bitte versuchen Sie es erneut.');
    } finally {
      setLoading(false);
    }
  };

  // Generiert verfügbare Zeiten für Abholung
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 11; hour < 13; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  // Generiert verfügbare Daten (nächste 7 Tage)
  const generateDateSlots = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('de-DE', { 
          weekday: 'long', 
          day: 'numeric', 
          month: 'long' 
        })
      });
    }
    return dates;
  };

  if (!isOpen || !meal) return null;

  const timeSlots = generateTimeSlots();
  const dateSlots = generateDateSlots();
  const isAvailableToday = isMealAvailableToday(meal);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Vorbestellung</h2>
            <button
              onClick={handleClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {/* Gericht-Info */}
          <div className="mb-6">
            <div className="flex items-center space-x-4">
              <img 
                src={meal.image} 
                alt={meal.title} 
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-semibold text-slate-800">{meal.title}</h3>
                <p className="text-sm text-slate-600">
                  {isAvailableToday ? 'Heute verfügbar' : `Verfügbar am ${meal.day.charAt(0).toUpperCase() + meal.day.slice(1)}`}
                </p>
                <p className="text-sm text-slate-500">
                  Schüler: {meal.student_price} CHF | Lehrer: {meal.teacher_price} CHF
                </p>
              </div>
            </div>
          </div>

          {/* Bestellformular */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Datum-Auswahl */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Abholdatum
              </label>
              <select
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Datum auswählen</option>
                {dateSlots.map((date) => (
                  <option key={date.value} value={date.value}>
                    {date.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Zeit-Auswahl */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Abholzeit
              </label>
              <select
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Zeit auswählen</option>
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time} Uhr
                  </option>
                ))}
              </select>
            </div>

            {/* Menge-Auswahl */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Menge
              </label>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-slate-300 flex items-center justify-center hover:bg-slate-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="text-lg font-semibold min-w-[3rem] text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border border-slate-300 flex items-center justify-center hover:bg-slate-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Fehler-Anzeige */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Erfolg-Anzeige */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-green-600 text-sm">Bestellung erfolgreich aufgegeben!</p>
              </div>
            )}

            {/* Aktions-Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Wird bestellt...' : 'Bestellen'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
