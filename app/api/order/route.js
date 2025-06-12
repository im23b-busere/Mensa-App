import { NextResponse } from 'next/server';
import { verifyToken } from '../../../middleware/auth';
import pool from '../../../lib/db';

export async function POST(req) {
  let user;
  try {
    user = verifyToken(req);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { mealName, date, time, day } = await req.json();
  if (!mealName || !date || !time) {
    return NextResponse.json({ error: 'Alle Felder erforderlich' }, { status: 400 });
  }

  // Zeitfenster validieren (11:00 - 13:00)
  const [hour, minute] = time.split(':').map(Number);
  if (hour < 11 || hour > 13 || (hour === 13 && minute > 0)) {
    return NextResponse.json({ error: 'Zeit ausserhalb des erlaubten Fensters' }, { status: 400 });
  }

  // Wenn ein Tag mitgesendet wird, muss dieser zur gewählten Bestellung passen
  if (day) {
    const weekday = new Date(date).toLocaleDateString('de-DE', { weekday: 'long' }).toLowerCase();
    if (weekday !== day.toLowerCase()) {
      return NextResponse.json({ error: 'Gericht an diesem Tag nicht verfügbar' }, { status: 400 });
    }
  }

  const pickupAt = `${date} ${time}`;
  try {
    await pool.query(
      'INSERT INTO orders (user_id, meal_name, pickup_at) VALUES (?, ?, ?)',
      [user.id, mealName, pickupAt]
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Bestellung fehlgeschlagen' }, { status: 500 });
  }
}
