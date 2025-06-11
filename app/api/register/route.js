import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';

export async function POST(req) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Felder dürfen nicht leer sein' }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Ungültige E-Mail' }, { status: 400 });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashed]
    );

    const token = jwt.sign(
      { id: result.insertId, name, email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return NextResponse.json({ token }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Registrierung fehlgeschlagen' }, { status: 500 });
  }
}
