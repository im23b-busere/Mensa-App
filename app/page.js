'use client';

import { useState, useEffect } from 'react';
import PreorderModal from '../components/PreorderModal';
import { useAuth } from '../context/AuthContext';

const weekDays = ['Mo', 'Di', 'Mi', 'Do', 'Fr'];
const dayKeys = ['montag', 'dienstag', 'mittwoch', 'donnerstag', 'freitag'];

const defaultMenus = {
  montag: [
    {
      id: 'default-montag-1',
      title: 'H\xE4hnchen-Gem\xFCsepfanne mit Reis',
      image: '/reis_haehnchen_pfanne_2.jpg',
      student_price: '10.00',
      teacher_price: '12.00',
      day: 'montag',
    },
    {
      id: 'default-montag-2',
      title: 'Spaghetti mit Hackfleisch-Tomatensauce',
      image: '/202_spaghetti-bolognese.jpg',
      student_price: '10.00',
      teacher_price: '12.00',
      day: 'montag',
    },
    {
      id: 'default-montag-3',
      title: 'Gem\xFCse-Lasagne mit Spinat und Ricotta',
      image: '/Download.jpg',
      student_price: '10.00',
      teacher_price: '12.00',
      day: 'montag',
    },
  ],
  dienstag: [
    {
      id: 'default-dienstag-1',
      title: 'Rindergeschnetzeltes mit Reis',
      image: '/reis_haehnchen_pfanne_2.jpg',
      student_price: '10.00',
      teacher_price: '12.00',
      day: 'dienstag',
    },
    {
      id: 'default-dienstag-2',
      title: 'Penne Arrabiata',
      image: '/202_spaghetti-bolognese.jpg',
      student_price: '10.00',
      teacher_price: '12.00',
      day: 'dienstag',
    },
    {
      id: 'default-dienstag-3',
      title: 'Gem\xFCse-Curry',
      image: '/Download.jpg',
      student_price: '10.00',
      teacher_price: '12.00',
      day: 'dienstag',
    },
  ],
  mittwoch: [
    {
      id: 'default-mittwoch-1',
      title: 'Fischst\xE4bchen mit Kartoffelsalat',
      image: '/reis_haehnchen_pfanne_2.jpg',
      student_price: '10.00',
      teacher_price: '12.00',
      day: 'mittwoch',
    },
    {
      id: 'default-mittwoch-2',
      title: 'K\xE4sesp\xE4tzle',
      image: '/202_spaghetti-bolognese.jpg',
      student_price: '10.00',
      teacher_price: '12.00',
      day: 'mittwoch',
    },
    {
      id: 'default-mittwoch-3',
      title: 'Tomaten-Mozzarella-Auflauf',
      image: '/Download.jpg',
      student_price: '10.00',
      teacher_price: '12.00',
      day: 'mittwoch',
    },
  ],
  donnerstag: [
    {
      id: 'default-donnerstag-1',
      title: 'Schweinebraten mit Kn\xF6del',
      image: '/reis_haehnchen_pfanne_2.jpg',
      student_price: '10.00',
      teacher_price: '12.00',
      day: 'donnerstag',
    },
    {
      id: 'default-donnerstag-2',
      title: 'Nudelauflauf',
      image: '/202_spaghetti-bolognese.jpg',
      student_price: '10.00',
      teacher_price: '12.00',
      day: 'donnerstag',
    },
    {
      id: 'default-donnerstag-3',
      title: 'Gr\xFCne Bohnen Eintopf',
      image: '/Download.jpg',
      student_price: '10.00',
      teacher_price: '12.00',
      day: 'donnerstag',
    },
  ],
  freitag: [
    {
      id: 'default-freitag-1',
      title: 'Currywurst mit Pommes',
      image: '/reis_haehnchen_pfanne_2.jpg',
      student_price: '10.00',
      teacher_price: '12.00',
      day: 'freitag',
    },
    {
      id: 'default-freitag-2',
      title: 'Pizza Margherita',
      image: '/202_spaghetti-bolognese.jpg',
      student_price: '10.00',
      teacher_price: '12.00',
      day: 'freitag',
    },
    {
      id: 'default-freitag-3',
      title: 'Linsensuppe',
      image: '/Download.jpg',
      student_price: '10.00',
      teacher_price: '12.00',
      day: 'freitag',
    },
  ],
};

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
      const fromDb = data.menus.filter(m => m.day === key);
      acc[key] = [...defaultMenus[key], ...fromDb];
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
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-6 pt-8 pb-24">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold text-gray-800">
              {`Menu-${currentDayKey.charAt(0).toUpperCase() + currentDayKey.slice(1)}`}
            </h1>
            {user?.role === 'admin' && (
              <button
                onClick={handleAdd}
                className="text-3xl text-primary hover:text-primary-dark"
              >
                +
              </button>
            )}
          </div>
          <div className="space-y-10">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-full md:w-56 h-56 bg-gray-100 rounded-full overflow-hidden shadow-md">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-semibold mb-6 text-gray-800">{item.title}</h3>
                    <div className="space-y-3">
                      <p className="text-gray-600 text-lg">
                        <span className="font-medium">Schüler:</span> {item.student_price} CHF
                      </p>
                      <p className="text-gray-600 text-lg">
                        <span className="font-medium">Lehrer:</span> {item.teacher_price} CHF
                      </p>
                    </div>
                    <div className="mt-4 space-x-2">
                      <button
                        onClick={() => setSelectedMeal(item)}
                        className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
                      >
                        Vorbestellen
                      </button>
                      {user?.role === 'admin' && (
                        <>
                          <button
                            onClick={() => handleEdit(item)}
                            className="px-3 py-2 bg-yellow-500 text-white rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="px-3 py-2 bg-red-500 text-white rounded"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <PreorderModal meal={selectedMeal || {}} isOpen={selectedMeal !== null} onClose={() => setSelectedMeal(null)} />
      {showForm && <MealForm day={currentDayKey} meal={editing} onClose={() => setShowForm(false)} />}
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
                      ? 'font-bold text-primary bg-gray-100'
                      : 'text-gray-600 hover:text-primary hover:bg-gray-50'
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
