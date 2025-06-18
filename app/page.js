'use client';

import { useState, useEffect } from 'react';
import PreorderModal from '../components/PreorderModal';
import { useAuth } from '../context/AuthContext';

const weekDays = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'];
const dayKeys = ['montag', 'dienstag', 'mittwoch', 'donnerstag', 'freitag'];

export default function Home() {
  const [currentDay, setCurrentDay] = useState(0);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [menus, setMenus] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAllergenModal, setShowAllergenModal] = useState(false);
  const [selectedMealForAllergen, setSelectedMealForAllergen] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const { user, logout } = useAuth();

  // Funktion um zu prüfen, ob ein Tag heute ist
  const isToday = (dayKey) => {
    const today = new Date();
    const dayNames = ['sonntag', 'montag', 'dienstag', 'mittwoch', 'donnerstag', 'freitag', 'samstag'];
    const todayName = dayNames[today.getDay()];
    return todayName === dayKey;
  };

  // Funktion um den heutigen Tag zu finden
  const getTodayIndex = () => {
    const today = new Date();
    const dayNames = ['sonntag', 'montag', 'dienstag', 'mittwoch', 'donnerstag', 'freitag', 'samstag'];
    const todayName = dayNames[today.getDay()];
    const todayIndex = dayKeys.indexOf(todayName);
    return todayIndex >= 0 ? todayIndex : 0; // Fallback auf Montag wenn nicht in der Liste
  };

  // Funktion um zu prüfen, ob ein Gericht bestellbar ist
  const isMealOrderable = (meal) => {
    return isToday(meal.day);
  };

  // Funktion um Allergen-Info zu öffnen
  const handleAllergenInfo = (meal) => {
    setSelectedMealForAllergen(meal);
    setShowAllergenModal(true);
  };

  // Funktion um Logout durchzuführen
  const handleLogout = () => {
    logout();
    setShowUserDropdown(false);
  };

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/menus');
      const data = await res.json();
      const grouped = dayKeys.reduce((acc, key) => {
        acc[key] = data.menus.filter(m => m.day === key);
        return acc;
      }, {});
      setMenus(grouped);
    } catch (error) {
      console.error('Fehler beim Laden der Menüs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
    // Setze automatisch auf den heutigen Tag
    const todayIndex = getTodayIndex();
    setCurrentDay(todayIndex);
  }, [showForm]);

  const handleDelete = async (id) => {
    if (!confirm('Möchten Sie dieses Gericht wirklich löschen?')) return;
    
    const token = localStorage.getItem('token');
    try {
      await fetch(`/api/menus/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowForm(false);
      fetchMenus();
    } catch (error) {
      console.error('Fehler beim Löschen:', error);
    }
  };

  const handleEdit = (meal) => {
    setEditing(meal);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditing(null);
    setShowForm(true);
  };

  const currentDayKey = dayKeys[currentDay];
  const menuItems = menus[currentDayKey] || [];
  const isCurrentDayToday = isToday(currentDayKey);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-12 h-12 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Lade Menüs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      {/* Header */}
      <header className="header-gradient text-white shadow-xl">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-3xl font-bold">Mensa-BZZ</h1>
                <p className="text-blue-100 text-sm">Ihre digitale Mensa</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center space-x-3 hover:bg-white/10 rounded-lg p-2 transition-all duration-200"
                  >
                    <div className="text-right">
                      <p className="text-sm text-blue-100">Willkommen</p>
                      <p className="font-semibold">{user.name}</p>
                    </div>
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <svg className="w-4 h-4 text-blue-100 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Dropdown Menu */}
                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-white/20 z-50">
                      <div className="py-2">
                        <div className="px-4 py-2 border-b border-slate-100">
                          <p className="text-sm text-slate-500">Angemeldet als</p>
                          <p className="font-semibold text-slate-800">{user.name}</p>
                          <p className="text-xs text-slate-400 capitalize">{user.role}</p>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-3 text-left text-slate-700 hover:bg-slate-50 transition-colors duration-200 flex items-center space-x-3"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span>Abmelden</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <a href="/login" className="btn-secondary">
                  Anmelden
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Click outside to close dropdown */}
      {showUserDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserDropdown(false)}
        />
      )}

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Day Navigation */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gradient">
                {weekDays[currentDay]} - Speiseplan
              </h2>
              <div className="flex items-center space-x-2">
                <span className="text-slate-600 font-medium">
                  {new Date().toLocaleDateString('de-DE', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
            
            {/* Day Tabs */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-2 shadow-lg border border-white/30">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setCurrentDay((prev) => (prev > 0 ? prev - 1 : dayKeys.length - 1))}
                  className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="flex space-x-2">
                  {weekDays.map((day, index) => (
                    <button
                      key={day}
                      onClick={() => setCurrentDay(index)}
                      className={`nav-tab ${currentDay === index ? 'nav-tab-active' : ''}`}
                    >
                      <span className="hidden sm:inline">{day}</span>
                      <span className="sm:hidden">{day.substring(0, 2)}</span>
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => setCurrentDay((prev) => (prev < dayKeys.length - 1 ? prev + 1 : 0))}
                  className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Menu Grid */}
          {menuItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">Keine Gerichte verfügbar</h3>
              <p className="text-slate-500">Für {weekDays[currentDay]} sind noch keine Gerichte eingetragen.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {menuItems.map((item, index) => {
                const isOrderable = isMealOrderable(item);
                return (
                  <div
                    key={item.id}
                    className="meal-card bg-card-hover fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="meal-image"
                      />
                      <div className="meal-overlay"></div>
                      <div className="meal-content">
                        <h3 className="text-xl font-bold mb-2 line-clamp-2">{item.title}</h3>
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-3">
                            <div className="text-center">
                              <p className="text-xs text-blue-200">Schüler</p>
                              <p className="font-bold text-lg">{item.student_price} CHF</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-blue-200">Lehrer</p>
                              <p className="font-bold text-lg">{item.teacher_price} CHF</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          {isOrderable ? (
                            <span className="badge badge-success">Heute verfügbar</span>
                          ) : (
                            <span className="badge badge-primary">Nicht verfügbar</span>
                          )}
                          <span className="text-sm text-slate-500">
                            {isCurrentDayToday ? 'Heute' : weekDays[currentDay]}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleAllergenInfo(item)}
                            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                            title="Allergen-Informationen"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                          {user?.role === 'admin' && (
                            <>
                              <button
                                onClick={() => handleEdit(item)}
                                className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                title="Bearbeiten"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                                title="Löschen"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <button
                          onClick={() => setSelectedMeal(item)}
                          className={`flex-1 font-semibold rounded-lg px-6 py-3 transition-all duration-200 ${
                            isOrderable 
                              ? 'btn-primary' 
                              : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                          }`}
                          disabled={!isOrderable}
                        >
                          <span className="flex items-center justify-center space-x-2">
                            <span>Vorbestellen</span>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Verfügbare Gerichte</p>
                  <p className="text-2xl font-bold text-slate-800">{menuItems.length}</p>
                </div>
              </div>
            </div>
            
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Bestellzeit</p>
                  <p className="text-2xl font-bold text-slate-800">11:00-13:00</p>
                </div>
              </div>
            </div>
            
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Aktueller Tag</p>
                  <p className="text-2xl font-bold text-slate-800">{weekDays[currentDay]}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Button for Admin */}
      {user?.role === 'admin' && (
        <button
          onClick={handleAdd}
          className="fab"
          title="Neues Gericht hinzufügen"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      )}

      {/* Modals */}
      <PreorderModal 
        meal={selectedMeal || {}} 
        isOpen={selectedMeal !== null} 
        onClose={() => setSelectedMeal(null)} 
      />
      
      {showForm && (
        <MealForm 
          day={currentDayKey} 
          meal={editing} 
          onClose={() => setShowForm(false)} 
          onSuccess={() => {
            setShowForm(false);
            fetchMenus();
          }}
        />
      )}

      {/* Allergen Info Modal */}
      {showAllergenModal && (
        <AllergenModal 
          meal={selectedMealForAllergen} 
          isOpen={showAllergenModal} 
          onClose={() => setShowAllergenModal(false)} 
        />
      )}
    </div>
  );
}

function AllergenModal({ meal, isOpen, onClose }) {
  if (!isOpen || !meal) return null;

  // Beispiel-Allergene (können später aus der Datenbank kommen)
  const allergens = {
    'Hähnchen-Gemüsepfanne mit Reis': ['Gluten', 'Soja'],
    'Spaghetti mit Hackfleisch-Tomatensauce': ['Gluten', 'Milch'],
    'Gemüse-Lasagne mit Spinat und Ricotta': ['Gluten', 'Milch', 'Eier'],
    'Rindergeschnetzeltes mit Reis': ['Soja'],
    'Penne Arrabiata': ['Gluten'],
    'Gemüse-Curry': ['Soja'],
    'Fischstäbchen mit Kartoffelsalat': ['Gluten', 'Fisch', 'Eier'],
    'Käsespätzle': ['Gluten', 'Milch'],
    'Tomaten-Mozzarella-Auflauf': ['Milch'],
    'Schweinebraten mit Knödel': ['Gluten'],
    'Nudelauflauf': ['Gluten', 'Milch'],
    'Grüne Bohnen Eintopf': [],
    'Currywurst mit Pommes': ['Gluten'],
    'Pizza Margherita': ['Gluten', 'Milch'],
    'Linsensuppe': []
  };

  const mealAllergens = allergens[meal.title] || [];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/20 slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Allergen-Informationen</h3>
              <p className="text-sm text-slate-500">Wichtige Hinweise zu Allergenen</p>
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
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 mb-6 border border-orange-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 text-lg">{meal.title}</h4>
              <p className="text-sm text-slate-600">Allergen-Übersicht</p>
            </div>
          </div>
        </div>

        {/* Allergen List */}
        <div className="space-y-4">
          {mealAllergens.length > 0 ? (
            <div>
              <h4 className="font-semibold text-slate-800 mb-3">Enthält folgende Allergene:</h4>
              <div className="space-y-2">
                {mealAllergens.map((allergen, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <span className="font-medium text-red-800">{allergen}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="font-semibold text-green-800 mb-2">Keine bekannten Allergene</h4>
              <p className="text-green-600 text-sm">Dieses Gericht enthält keine der häufigsten Allergene.</p>
            </div>
          )}

          {/* Important Notice */}
          <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-start space-x-2">
              <svg className="w-5 h-5 text-slate-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-slate-600">
                <p className="font-medium mb-1">Wichtiger Hinweis:</p>
                <p>Diese Informationen dienen nur zur Orientierung. Bei Allergien oder Unverträglichkeiten wenden Sie sich bitte an unser Küchenpersonal.</p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-end pt-4">
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              Schließen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MealForm({ day, meal, onClose, onSuccess }) {
  const isEdit = Boolean(meal);
  const [title, setTitle] = useState(meal?.title || '');
  const [studentPrice, setStudentPrice] = useState(meal?.student_price || '');
  const [teacherPrice, setTeacherPrice] = useState(meal?.teacher_price || '');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !studentPrice || !teacherPrice) {
      alert('Bitte füllen Sie alle Felder aus');
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('token');
    const form = new FormData();
    form.append('title', title);
    form.append('studentPrice', studentPrice);
    form.append('teacherPrice', teacherPrice);
    form.append('day', day);
    if (image) form.append('image', image);

    try {
      const res = await fetch(isEdit ? `/api/menus/${meal.id}` : '/api/menus', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      
      if (res.ok) {
        onSuccess();
      } else {
        const data = await res.json();
        alert(data.error || 'Fehler beim Speichern');
      }
    } catch (error) {
      console.error('Fehler:', error);
      alert('Fehler beim Speichern');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-800">
            {isEdit ? 'Gericht bearbeiten' : 'Neues Gericht hinzufügen'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Gerichtname</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="z.B. Spaghetti Bolognese"
              className="input-field"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Schülerpreis (CHF)</label>
              <input
                type="number"
                step="0.10"
                value={studentPrice}
                onChange={e => setStudentPrice(e.target.value)}
                placeholder="8.90"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Lehrerpreis (CHF)</label>
              <input
                type="number"
                step="0.10"
                value={teacherPrice}
                onChange={e => setTeacherPrice(e.target.value)}
                placeholder="10.90"
                className="input-field"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Bild</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => setImage(e.target.files[0])}
              className="input-field"
            />
          </div>
          
          <div className="flex items-center justify-between pt-4">
            <button
              onClick={onClose}
              className="btn-secondary"
              disabled={loading}
            >
              Abbrechen
            </button>
            <button
              onClick={handleSubmit}
              className="btn-primary"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <div className="spinner w-4 h-4"></div>
                  <span>Speichern...</span>
                </span>
              ) : (
                <span>{isEdit ? 'Aktualisieren' : 'Hinzufügen'}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
