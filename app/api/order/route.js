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

  // Datum validieren - muss in der Zukunft liegen
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (selectedDate < today) {
    return NextResponse.json({ error: 'Bestellungen können nur für zukünftige Tage getätigt werden' }, { status: 400 });
  }

  // Tag validieren - das Gericht muss an dem gewählten Tag verfügbar sein
  if (day) {
    const weekday = new Date(date).toLocaleDateString('de-DE', { weekday: 'long' }).toLowerCase();
    if (weekday !== day.toLowerCase()) {
      return NextResponse.json({ error: `Dieses Gericht ist nur am ${day.charAt(0).toUpperCase() + day.slice(1)} verfügbar` }, { status: 400 });
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
