// filename: backend/src/index.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import { randomUUID } from 'crypto'; // ใช้สร้าง ID สุ่มแบบไม่ซ้ำ
import db from './db/database';
import { calculateInspection } from './services/calculator';
import { standardsDB } from './data/standards';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
// ขยาย limit เผื่อไฟล์อัปโหลด raw.json มีขนาดใหญ่
app.use(express.json({ limit: '50mb' }));

// --- Helper Function ช่วยจัดการ SQLite ให้รองรับ async/await ---
const runQuery = (query: string, params: any[] = []): Promise<void> => {
    return new Promise((resolve, reject) => {
        db.run(query, params, function (err) {
            if (err) reject(err);
            else resolve();
        });
    });
};

const getQuery = (query: string, params: any[] = []): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.get(query, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

const allQuery = (query: string, params: any[] = []): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

// ==========================================
// 📌 ROUTES (APIs)
// ==========================================

// 1. ดึงข้อมูล Standard ไปแสดงใน Dropdown หน้า Create Inspection
app.get('/standard', (req: Request, res: Response) => {
    // ส่งไปแค่ id กับ name ให้ Dropdown หน้าบ้าน
    const standardList = standardsDB.map(s => ({ id: s.id, name: s.name }));
    res.json(standardList);
});

// 2. [POST] /history - รับข้อมูลจากฟอร์ม คำนวณ และบันทึกลง DB
app.post('/history', async (req: Request, res: Response): Promise<any> => {
    try {
        const {
            name, standard_id, note, price,
            sampling_point, sampling_datetime, raw_data
        } = req.body;

        // 1. ตรวจสอบว่าส่งข้อมูลจำเป็นมาครบไหม
        if (!name || !standard_id || !raw_data) {
            return res.status(400).json({ error: "Missing required fields: name, standard_id, or raw_data" });
        }

        // 2. ดึงเกณฑ์ Standard ที่ User เลือกมา
        const standard = standardsDB.find(s => s.id === standard_id);
        if (!standard) {
            return res.status(404).json({ error: "Standard not found" });
        }

        // 3. 🧠 ส่งไปให้ฟังก์ชันคำนวณประมวลผล
        const result = calculateInspection(raw_data, standard.standardData);

        // 4. บันทึกข้อมูลลงฐานข้อมูล (Database)
        const inspectionId = randomUUID(); // สร้าง ID ให้ History เช่น "123e4567-e89b..."
        const samplingPointStr = Array.isArray(sampling_point) ? JSON.stringify(sampling_point) : sampling_point;

        // Insert ลง Table หลัก
        await runQuery(
            `INSERT INTO inspection_history (id, name, standard_name, note, price, sampling_point, sampling_datetime, total_sample) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [inspectionId, name, standard.name, note, price, samplingPointStr, sampling_datetime, result.totalSample]
        );

        // Insert ผลลัพธ์ Composition ลง Table ย่อย
        for (const comp of result.composition) {
            await runQuery(
                `INSERT INTO inspection_results (inspection_id, category, name, actual) VALUES (?, ?, ?, ?)`,
                [inspectionId, 'composition', comp.name, comp.actual]
            );
        }

        // Insert ผลลัพธ์ Defect ลง Table ย่อย
        for (const def of result.defect) {
            await runQuery(
                `INSERT INTO inspection_results (inspection_id, category, name, actual) VALUES (?, ?, ?, ?)`,
                [inspectionId, 'defect', def.name, def.actual]
            );
        }

        // 5. ตอบกลับสำเร็จ พร้อมส่งผลลัพธ์ที่คำนวณแล้วกลับไปให้หน้าบ้านโชว์ทันที!
        return res.status(201).json({
            message: "Inspection created successfully",
            inspection_id: inspectionId,
            result: result
        });

    } catch (error) {
        console.error("Error creating inspection:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// ==========================================
// 📌 API สำหรับระบบ History (List, View, Edit, Delete)
// ==========================================

// 3. [GET] /history - ดึงรายการประวัติทั้งหมด (รองรับ Search, Date Filter และ Pagination)
app.get('/history', async (req: Request, res: Response) => {
    try {
        const search = req.query.search as string;
        const startDate = req.query.startDate as string;
        const endDate = req.query.endDate as string;

        // ตั้งค่า Pagination (ถ้าไม่ส่งมา ให้เป็นหน้าที่ 1 และดึง 10 รายการ)
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = (page - 1) * limit;

        // ใช้ 1=1 เป็นทริคเพื่อให้ต่อ WHERE AND ได้ง่ายๆ
        let query = `SELECT id, name, standard_name, note, created_at FROM inspection_history WHERE 1=1`;
        let countQuery = `SELECT COUNT(*) as total FROM inspection_history WHERE 1=1`;
        let params: any[] = [];

        // 🔍 กรองด้วย ID
        if (search) {
            query += ` AND id LIKE ?`;
            countQuery += ` AND id LIKE ?`;
            params.push(`%${search}%`);
        }

        // 📅 กรองด้วยวันที่ (Date Range)
        if (startDate && endDate) {
            query += ` AND created_at BETWEEN ? AND ?`;
            countQuery += ` AND created_at BETWEEN ? AND ?`;
            // เติมเวลาให้ครอบคลุมตั้งแต่ เที่ยงคืน ถึง ห้าทุ่มห้าสิบเก้า
            params.push(`${startDate} 00:00:00`, `${endDate} 23:59:59`);
        }

        // เรียงจากใหม่ไปเก่า พร้อมจำกัดจำนวน (LIMIT / OFFSET)
        query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;

        // นับจำนวนข้อมูลทั้งหมดที่ตรงกับเงื่อนไข (เพื่อเอาไปทำปุ่มเปลี่ยนหน้า)
        const countResult = await getQuery(countQuery, params);
        const totalItems = countResult.total;
        const totalPages = Math.ceil(totalItems / limit);

        // ดึงข้อมูลจริง
        const histories = await allQuery(query, [...params, limit, offset]);

        // ส่งกลับไปแบบมี Metadata ให้หน้าบ้านรู้ว่ามีกี่หน้า
        res.json({
            data: histories,
            pagination: {
                total_items: totalItems,
                total_pages: totalPages,
                current_page: page,
                limit: limit
            }
        });
    } catch (error) {
        console.error("Error fetching history:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// 4. [GET] /history/:id - ดึงข้อมูลประวัติแบบเจาะจง (View by ID)
app.get('/history/:id', async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;

        // ดึงข้อมูลหลัก
        const history = await getQuery(`SELECT * FROM inspection_history WHERE id = ?`, [id]);
        if (!history) {
            return res.status(404).json({ error: "Inspection not found" });
        }

        // ดึงข้อมูลผลลัพธ์ (Composition & Defect)
        const results = await allQuery(`SELECT category, name, actual FROM inspection_results WHERE inspection_id = ?`, [id]);

        // แยกหมวดหมู่ให้ Frontend เอาไปโชว์ง่ายๆ
        const composition = results.filter((r: any) => r.category === 'composition').map((r: any) => ({ name: r.name, actual: r.actual }));
        const defect = results.filter((r: any) => r.category === 'defect').map((r: any) => ({ name: r.name, actual: r.actual }));

        // แปลง sampling_point กลับเป็น Array ถ้ามันถูกเก็บเป็น String
        let parsedSamplingPoint = history.sampling_point;
        if (typeof history.sampling_point === 'string' && history.sampling_point.startsWith('[')) {
            try { parsedSamplingPoint = JSON.parse(history.sampling_point); } catch (e) { }
        }

        res.json({
            basic_information: {
                created_at: history.created_at,
                updated_at: history.updated_at,
                inspection_id: history.id,
                name: history.name,
                standard: history.standard_name,
                total_sample: history.total_sample,
                note: history.note,
                price: history.price,
                sampling_point: parsedSamplingPoint,
                sampling_datetime: history.sampling_datetime
            },
            inspection_result: {
                composition,
                defect
            }
        });
    } catch (error) {
        console.error("Error fetching history detail:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// 5. [PUT] /history/:id - แก้ไขข้อมูล (Edit Result)
app.put('/history/:id', async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const { note, price, sampling_point, sampling_datetime } = req.body;

        const history = await getQuery(`SELECT id FROM inspection_history WHERE id = ?`, [id]);
        if (!history) {
            return res.status(404).json({ error: "Inspection not found" });
        }

        const samplingPointStr = Array.isArray(sampling_point) ? JSON.stringify(sampling_point) : sampling_point;

        await runQuery(
            `UPDATE inspection_history 
             SET note = ?, price = ?, sampling_point = ?, sampling_datetime = ?, updated_at = CURRENT_TIMESTAMP 
             WHERE id = ?`,
            [note, price, samplingPointStr, sampling_datetime, id]
        );

        res.json({ message: "Inspection updated successfully" });
    } catch (error) {
        console.error("Error updating history:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// 6. [DELETE] /history - ลบข้อมูล (รองรับการลบหลายๆ อันพร้อมกัน)
app.delete('/history', async (req: Request, res: Response): Promise<any> => {
    try {
        // รับ Array ของ ID ที่ต้องการลบ เช่น { "ids": ["id1", "id2"] }
        const { ids } = req.body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ error: "Please provide an array of ids to delete" });
        }

        const placeholders = ids.map(() => '?').join(',');

        // ข้อมูลใน inspection_results จะโดนลบอัตโนมัติ เพราะเราตั้ง ON DELETE CASCADE ไว้ตอนสร้าง DB
        await runQuery(`DELETE FROM inspection_history WHERE id IN (${placeholders})`, ids);

        res.json({ message: "Inspections deleted successfully" });
    } catch (error) {
        console.error("Error deleting history:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// เริ่ม Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});