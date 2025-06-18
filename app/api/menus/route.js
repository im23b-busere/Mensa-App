import { NextResponse } from 'next/server';
import { verifyToken } from '../../../middleware/auth';
import pool from '../../../lib/db';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM menus');
    return NextResponse.json({ menus: rows });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Fehler beim Laden der Menüs' }, { status: 500 });
  }
}

export async function POST(req) {
  let user;
  try {
    user = verifyToken(req);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const formData = await req.formData();
  const title = formData.get('title');
  const studentPrice = formData.get('studentPrice');
  const teacherPrice = formData.get('teacherPrice');
  const day = formData.get('day');
  const file = formData.get('image');
  const ingredients = formData.get('ingredients') || '';
  const allergens = formData.get('allergens') || '';

  if (!title || !studentPrice || !teacherPrice || !day || !file) {
    return NextResponse.json({ error: 'Alle Felder erforderlich' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.promises.mkdir(uploadsDir, { recursive: true });
  const filename = `${uuidv4()}_${file.name}`;
  const filePath = path.join(uploadsDir, filename);
  await fs.promises.writeFile(filePath, buffer);

  const imagePath = `/uploads/${filename}`;

  try {
    const [result] = await pool.query(
      'INSERT INTO menus (title, image, student_price, teacher_price, day, ingredients, allergens) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, imagePath, studentPrice, teacherPrice, day, ingredients, allergens]
    );
    return NextResponse.json({ id: result.insertId, title, image: imagePath, student_price: studentPrice, teacher_price: teacherPrice, day, ingredients, allergens });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Speichern fehlgeschlagen' }, { status: 500 });
  }
}
