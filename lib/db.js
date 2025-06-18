import mysql from 'mysql2/promise';

// Datenbank-Konfiguration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mensa_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Erstellt Connection Pool
const pool = mysql.createPool(dbConfig);

// Hilfsfunktion für Datenbankabfragen
export async function query(sql, params) {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Testet Datenbankverbindung
export async function testConnection() {
  try {
    await pool.getConnection();
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

export default pool;
