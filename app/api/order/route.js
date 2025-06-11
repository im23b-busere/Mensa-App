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

  const { mealName, date, time } = await req.json();
  if (!mealName || !date || !time) {
    return NextResponse.json({ error: 'Alle Felder erforderlich' }, { status: 400 });
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
