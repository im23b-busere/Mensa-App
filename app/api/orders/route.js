import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import pool from '../../../lib/db';

export async function GET(request) {
  try {
    // Token aus dem Authorization Header extrahieren
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token erforderlich' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let user;
    
    try {
      // Token direkt verifizieren
      user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.json({ error: 'Ungültiger Token' }, { status: 401 });
    }

    // Bestellungen des Benutzers abrufen
    const [orders] = await pool.execute(
      `SELECT 
        o.id,
        o.meal_name as mealName,
        DATE(o.pickup_at) as date,
        TIME(o.pickup_at) as time,
        o.created_at,
        o.user_id
      FROM orders o
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC`,
      [user.id]
    );

    return NextResponse.json({ 
      orders: orders,
      message: 'Bestellungen erfolgreich abgerufen'
    });

  } catch (error) {
    console.error('Fehler beim Abrufen der Bestellungen:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' }, 
      { status: 500 }
    );
  }
} 