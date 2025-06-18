import { NextResponse } from 'next/server';
import { verifyToken } from '../../../../middleware/auth';
import pool from '../../../../lib/db';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

async function getMenu(id) {
  const [rows] = await pool.query('SELECT * FROM menus WHERE id = ?', [id]);
  return rows[0];
}

export async function GET(req, { params }) {
  try {
    const menu = await getMenu(params.id);
    if (!menu) return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    return NextResponse.json(menu);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Fehler beim Laden des Menüs' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
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

  if (!title || !studentPrice || !teacherPrice || !day) {
    return NextResponse.json({ error: 'Alle Felder erforderlich' }, { status: 400 });
  }

  let imagePath = null;
  if (file && typeof file === 'object') {
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.promises.mkdir(uploadsDir, { recursive: true });
    const filename = `${uuidv4()}_${file.name}`;
    const filePath = path.join(uploadsDir, filename);
    await fs.promises.writeFile(filePath, buffer);
    imagePath = `/uploads/${filename}`;
  }

  try {
    const fields = [title, studentPrice, teacherPrice, day, ingredients, allergens];
    let query =
      'UPDATE menus SET title=?, student_price=?, teacher_price=?, day=?, ingredients=?, allergens=?';
    if (imagePath) {
      query += ', image=?';
      fields.push(imagePath);
    }
    query += ' WHERE id=?';
    fields.push(params.id);

    await pool.query(query, fields);
    const updated = await getMenu(params.id);
    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Update fehlgeschlagen' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  let user;
  try {
    user = verifyToken(req);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    await pool.query('DELETE FROM menus WHERE id = ?', [params.id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Löschen fehlgeschlagen' }, { status: 500 });
  }
}
