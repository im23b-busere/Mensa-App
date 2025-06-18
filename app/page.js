'use client';

import { useState, useEffect } from 'react';
import PreorderModal from '../components/PreorderModal';
import { useAuth } from '../context/AuthContext';

const weekDays = ['Mo', 'Di', 'Mi', 'Do', 'Fr'];
const dayKeys = ['montag', 'dienstag', 'mittwoch', 'donnerstag', 'freitag'];


export default function Home() {
  const [currentDay, setCurrentDay] = useState(0);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [menus, setMenus] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const { user } = useAuth();

  const fetchMenus = async () => {
    const res = await fetch('/api/menus');
    const data = await res.json();
    const grouped = dayKeys.reduce((acc, key) => {
      acc[key] = data.menus.filter(m => m.day === key);
      return acc;
    }, {});
    setMenus(grouped);
  };

  useEffect(() => {
    fetchMenus();
  }, [showForm]);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    await fetch(`/api/menus/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    setShowForm(false);
    fetchMenus();
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-blue-50">
      <main className="container mx-auto px-2 pt-8 pb-32">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-4xl font-extrabold text-black drop-shadow-sm">
              {`Menu-${currentDayKey.charAt(0).toUpperCase() + currentDayKey.slice(1)}`}
            </h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="relative bg-card p-0 overflow-hidden shadow-xl rounded-3xl group border border-gray-100 flex flex-col h-[420px]"
              >
                <div className="relative h-2/3 w-full overflow-hidden flex items-center justify-center">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-3xl font-bold text-white drop-shadow-lg mb-2">{item.title}</h3>
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-between p-6">
                  <div className="space-y-2">
                    <p className="text-gray-700 text-lg">
                      <span className="font-semibold text-black">Schüler:</span> {item.student_price} CHF
                    </p>
                    <p className="text-gray-700 text-lg">
                      <span className="font-semibold text-black">Lehrer:</span> {item.teacher_price} CHF
                    </p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 justify-end">
                    <button
                      onClick={() => setSelectedMeal(item)}
                      className="btn-primary"
                    >
                      Vorbestellen
                    </button>
                    {user?.role === 'admin' && (
                      <>
                        <button
                          onClick={() => handleEdit(item)}
                          className="btn-secondary"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl px-5 py-2 transition"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {user?.role === 'admin' && (
            <button
              onClick={handleAdd}
              className="fixed bottom-24 right-8 z-30 btn-primary w-16 h-16 rounded-full text-3xl flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
              title="Add new meal"
            >
              +
            </button>
          )}
        </div>
      </main>
      <PreorderModal meal={selectedMeal || {}} isOpen={selectedMeal !== null} onClose={() => setSelectedMeal(null)} />
      {showForm && <MealForm day={currentDayKey} meal={editing} onClose={() => setShowForm(false)} />}
      <footer className="fixed bottom-0 left-0 right-0 bg-white bg-opacity-90 shadow-lg backdrop-blur-md z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <button
              onClick={() => setCurrentDay((prev) => (prev > 0 ? prev - 1 : dayKeys.length - 1))}
              className="text-3xl text-gray-500 hover:text-blue-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
            >
              ←
            </button>
            <div className="flex space-x-4">
              {weekDays.map((day, index) => (
                <button
                  key={day}
                  onClick={() => setCurrentDay(index)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors shadow-sm ${
                    currentDay === index
                      ? 'text-white bg-blue-500 shadow-md'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentDay((prev) => (prev < dayKeys.length - 1 ? prev + 1 : 0))}
              className="text-3xl text-gray-500 hover:text-blue-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
            >
              →
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

function MealForm({ day, meal, onClose }) {
  const isEdit = Boolean(meal);
  const [title, setTitle] = useState(meal?.title || '');
  const [studentPrice, setStudentPrice] = useState(meal?.student_price || '');
  const [teacherPrice, setTeacherPrice] = useState(meal?.teacher_price || '');
  const [image, setImage] = useState(null);

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    const form = new FormData();
    form.append('title', title);
    form.append('studentPrice', studentPrice);
    form.append('teacherPrice', teacherPrice);
    form.append('day', day);
    if (image) form.append('image', image);

    const res = await fetch(isEdit ? `/api/menus/${meal.id}` : '/api/menus', {
      method: isEdit ? 'PUT' : 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    if (res.ok) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <div className="bg-white rounded-lg p-6 w-80 space-y-4">
        <h3 className="text-lg font-semibold">{isEdit ? 'Menu bearbeiten' : 'Menu hinzufügen'}</h3>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Titel"
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          value={studentPrice}
          onChange={e => setStudentPrice(e.target.value)}
          placeholder="Preis Schüler"
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          value={teacherPrice}
          onChange={e => setTeacherPrice(e.target.value)}
          placeholder="Preis Lehrer"
          className="w-full border p-2 rounded"
        />
        <input type="file" onChange={e => setImage(e.target.files[0])} className="w-full" />
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200">Abbrechen</button>
          <button onClick={handleSubmit} className="px-4 py-2 rounded bg-primary text-white">
            {isEdit ? 'Speichern' : 'Hinzufügen'}
          </button>
        </div>
      </div>
    </div>
  );
}
