'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function OrdersPage() {
  // State für Bestellungen und UI
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  // Lädt Bestellungen von der API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/order', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
      } else {
        setError('Fehler beim Laden der Bestellungen');
      }
    } catch (error) {
      setError('Netzwerkfehler beim Laden der Bestellungen');
    } finally {
      setLoading(false);
    }
  };

  // Lädt Daten beim Start
  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  // Formatiert Datum für Anzeige
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Formatiert Zeit für Anzeige
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Bestimmt Status-Badge Styling
  const getStatusBadge = (status) => {
    if (status === 'completed') {
      return 'bg-green-100 text-green-800 border-green-200';
    }
    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  // Übersetzt Status
  const getStatusText = (status) => {
    return status === 'completed' ? 'Abgeschlossen' : 'Ausstehend';
  };

  // Berechnet Gesamtpreis für eine Bestellung
  const calculateTotalPrice = (order) => {
    const price = user?.role === 'teacher' ? order.teacher_price : order.student_price;
    return (price * order.quantity).toFixed(2);
  };

  // Loading-Zustand
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-12 h-12 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Lade Bestellungen...</p>
        </div>
      </div>
    );
  }

  // Fehler-Zustand
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">Fehler beim Laden</h3>
          <p className="text-slate-500 mb-4">{error}</p>
          <button
            onClick={fetchOrders}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      {/* Header */}
      <header className="header-gradient text-white shadow-xl">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                onClick={() => window.history.back()}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Bestellhistorie</h1>
                <p className="text-blue-100 text-xs sm:text-sm">Ihre vergangenen und aktuellen Bestellungen</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hauptinhalt */}
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Statistik-Karten */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="glass-card rounded-2xl p-4 sm:p-6">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-slate-600">Gesamt Bestellungen</p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-800">{orders.length}</p>
                </div>
              </div>
            </div>
            
            <div className="glass-card rounded-2xl p-4 sm:p-6">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-slate-600">Ausstehend</p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-800">
                    {orders.filter(order => order.status === 'pending').length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="glass-card rounded-2xl p-4 sm:p-6">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-slate-600">Abgeschlossen</p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-800">
                    {orders.filter(order => order.status === 'completed').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bestellungen-Liste */}
          {orders.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">Keine Bestellungen</h3>
              <p className="text-slate-500 mb-4">Sie haben noch keine Bestellungen getätigt.</p>
              <a
                href="/"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Erste Bestellung aufgeben
              </a>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="glass-card rounded-2xl p-4 sm:p-6">
                  {/* Bestellung-Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <img 
                        src={order.image} 
                        alt={order.title} 
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-slate-800 text-base sm:text-lg">{order.title}</h3>
                        <p className="text-sm text-slate-500">
                          Bestellt am {formatDate(order.created_at)}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>

                  {/* Bestellung-Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center sm:text-left">
                      <p className="text-xs text-slate-500 mb-1">Menge</p>
                      <p className="font-semibold text-slate-800">{order.quantity}x</p>
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-xs text-slate-500 mb-1">Preis pro Stück</p>
                      <p className="font-semibold text-slate-800">
                        {user?.role === 'teacher' ? order.teacher_price : order.student_price} CHF
                      </p>
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-xs text-slate-500 mb-1">Gesamtpreis</p>
                      <p className="font-semibold text-blue-600">{calculateTotalPrice(order)} CHF</p>
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-xs text-slate-500 mb-1">Abholzeit</p>
                      <p className="font-semibold text-slate-800">
                        {formatDate(order.pickup_time)}<br />
                        <span className="text-sm">{formatTime(order.pickup_time)}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 