import { NextResponse } from 'next/server';
import { verifyToken } from '@/middleware/auth';

export async function GET(req) {
  try {
    const user = verifyToken(req);
    return NextResponse.json({ message: `Hallo ${user.name}` });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
