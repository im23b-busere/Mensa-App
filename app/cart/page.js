'use client';

import { useCart } from '../../context/CartContext';
import { useState } from 'react';

export default function CartPage() {
  const { cartItems, removeItem, clearCart } = useCart();
  const [message, setMessage] = useState('');

  const handleCheckout = async () => {
    setMessage('');
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Bitte zuerst anmelden');
      return;
    }
    for (const item of cartItems) {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mealName: item.mealName,
          date: item.date,
          time: item.time,
          day: item.day,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setMessage(data.error || 'Fehler beim Bestellen');
        return;
      }
    }
    clearCart();
    setMessage('Bestellung erfolgreich!');
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Warenkorb</h1>
      {cartItems.length === 0 ? (
        <p>Ihr Warenkorb ist leer.</p>
      ) : (
        <>
          <ul className="space-y-4 mb-6">
            {cartItems.map((item, index) => (
              <li
                key={index}
                className="p-4 bg-white shadow rounded flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{item.mealName}</p>
                  <p className="text-sm text-gray-600">
                    {item.date} {item.time}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(index)}
                  className="text-red-600 hover:underline"
                >
                  Entfernen
                </button>
              </li>
            ))}
          </ul>
          {message && (
            <p
              className={`mb-4 ${message.includes('erfolgreich') ? 'text-green-600' : 'text-red-600'}`}
            >
              {message}
            </p>
          )}
          <button
            onClick={handleCheckout}
            className="bg-primary text-white px-4 py-2 rounded"
          >
            Bestellung abschicken
          </button>
        </>
      )}
    </div>
  );
}
