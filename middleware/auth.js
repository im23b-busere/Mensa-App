import jwt from 'jsonwebtoken';

export function verifyToken(req) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    throw new Error('Unauthorized');
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    throw new Error('Unauthorized');
  }
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new Error('Unauthorized');
  }
}
