import { NextResponse } from 'next/server';
import { verifyToken } from '../../middleware/auth';
import { query } from '../../../lib/db';

// POST: Neue Bestellung erstellen
export async function POST(request) {
  try {
    // Token verifizieren und Benutzer-ID extrahieren
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Token erforderlich' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Ungültiger Token' }, { status: 401 });
    }

    // Benutzer-ID aus Datenbank abrufen (da JWT nur Email enthält)
    const userResult = await query('SELECT id FROM users WHERE email = ?', [decoded.email]);
    if (userResult.length === 0) {
      return NextResponse.json({ error: 'Benutzer nicht gefunden' }, { status: 404 });
    }
    const userId = userResult[0].id;

    // Request-Body parsen
    const { mealId, pickupTime, quantity } = await request.json();

    // Validierung der Eingaben
    if (!mealId || !pickupTime || !quantity) {
      return NextResponse.json({ error: 'Alle Felder sind erforderlich' }, { status: 400 });
    }

    if (quantity < 1 || quantity > 10) {
      return NextResponse.json({ error: 'Menge muss zwischen 1 und 10 liegen' }, { status: 400 });
    }

    // Prüfen ob das Gericht existiert
    const mealResult = await query('SELECT * FROM menus WHERE id = ?', [mealId]);
    if (mealResult.length === 0) {
      return NextResponse.json({ error: 'Gericht nicht gefunden' }, { status: 404 });
    }

    const meal = mealResult[0];

    // Validierung der Abholzeit
    const pickupDateTime = new Date(pickupTime);
    const now = new Date();

    // Prüfen ob Abholzeit in der Zukunft liegt
    if (pickupDateTime <= now) {
      return NextResponse.json({ error: 'Abholzeit muss in der Zukunft liegen' }, { status: 400 });
    }

    // Prüfen ob Abholzeit nicht zu weit in der Zukunft liegt (max. 7 Tage)
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7);
    if (pickupDateTime > maxDate) {
      return NextResponse.json({ error: 'Bestellungen sind nur bis zu 7 Tage im Voraus möglich' }, { status: 400 });
    }

    // Prüfen ob das Gericht am gewählten Tag verfügbar ist
    const selectedDay = pickupDateTime.toLocaleDateString('de-DE', { weekday: 'long' }).toLowerCase();
    if (selectedDay !== meal.day) {
      return NextResponse.json({ 
        error: `Dieses Gericht ist nur am ${meal.day.charAt(0).toUpperCase() + meal.day.slice(1)} verfügbar` 
      }, { status: 400 });
    }

    // Prüfen ob Abholzeit im erlaubten Zeitfenster liegt (11:00-13:00)
    const hour = pickupDateTime.getHours();
    if (hour < 11 || hour >= 13) {
      return NextResponse.json({ error: 'Abholungen sind nur zwischen 11:00 und 13:00 Uhr möglich' }, { status: 400 });
    }

    // Bestellung in Datenbank speichern
    const result = await query(
      'INSERT INTO orders (user_id, meal_id, pickup_time, quantity, created_at) VALUES (?, ?, ?, ?, NOW())',
      [userId, mealId, pickupTime, quantity]
    );

    return NextResponse.json({ 
      message: 'Bestellung erfolgreich erstellt',
      orderId: result.insertId 
    });

  } catch (error) {
    console.error('Fehler beim Erstellen der Bestellung:', error);
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 });
  }
}

// GET: Bestellungen eines Benutzers abrufen
export async function GET(request) {
  try {
    // Token verifizieren
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Token erforderlich' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Ungültiger Token' }, { status: 401 });
    }

    // Benutzer-ID aus Datenbank abrufen
    const userResult = await query('SELECT id FROM users WHERE email = ?', [decoded.email]);
    if (userResult.length === 0) {
      return NextResponse.json({ error: 'Benutzer nicht gefunden' }, { status: 404 });
    }
    const userId = userResult[0].id;

    // Bestellungen mit Gericht-Details abrufen
    const orders = await query(`
      SELECT 
        o.id,
        o.pickup_time,
        o.quantity,
        o.created_at,
        m.title,
        m.image,
        m.student_price,
        m.teacher_price,
        m.day,
        CASE 
          WHEN o.pickup_time < NOW() THEN 'completed'
          ELSE 'pending'
        END as status
      FROM orders o
      JOIN menus m ON o.meal_id = m.id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `, [userId]);

    return NextResponse.json({ orders });

  } catch (error) {
    console.error('Fehler beim Abrufen der Bestellungen:', error);
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 });
  }
}
