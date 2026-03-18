import sqlite3 from 'sqlite3';
import path from 'path';

// สร้างไฟล์ Database ไว้ในโฟลเดอร์ backend
const dbPath = path.resolve(__dirname, '../../easyrice.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');

        // สร้าง Table สำหรับ History
        db.run(`
            CREATE TABLE IF NOT EXISTS inspection_history (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                standard_name TEXT NOT NULL,
                note TEXT,
                price REAL,
                sampling_point TEXT,
                sampling_datetime TEXT,
                total_sample INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // สร้าง Table สำหรับเก็บผลลัพธ์ (Composition และ Defect)
        db.run(`
            CREATE TABLE IF NOT EXISTS inspection_results (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                inspection_id TEXT,
                category TEXT, 
                name TEXT,
                actual REAL,
                FOREIGN KEY (inspection_id) REFERENCES inspection_history(id) ON DELETE CASCADE
            )
        `);
    }
});

export default db;