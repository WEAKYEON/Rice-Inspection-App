```markdown
# 🌾 EASYRICE Rice Inspection App 
### Full Stack Developer Intern Exam Project

โปรเจกต์ระบบตรวจสอบคุณภาพข้าวแบบครบวงจร พัฒนาด้วยเทคโนโลยีสมัยใหม่ เน้นการใช้งานที่ลื่นไหล รองรับการแสดงผลทั้งภาษาไทยและอังกฤษ พร้อมระบบสลับธีม (Dark Mode) เพื่อประสบการณ์ใช้งานที่ดีที่สุด

---

## ✨ Key Features (Highlights)
นอกจากฟีเจอร์พื้นฐานตามโจทย์แล้ว โปรเจกต์นี้ยังได้รับการพัฒนาเพิ่มเติมในส่วนของ:
* **🌓 Dual Theme System:** รองรับโหมดสว่าง (EASYRICE Theme) และโหมดมืด (SoySelect Theme) เพื่อความถนัดของผู้ใช้
* **🌐 Real-time i18n:** ระบบสลับภาษา ไทย-อังกฤษ (Multi-language) ที่ทำงานครอบคลุมทั้ง UI และข้อมูลที่ดึงมาจาก Database โดยใช้ React Context API
* **📊 Dynamic Calculation:** ระบบคำนวณสัดส่วนข้าว (Composition) และข้าวตำหนิ (Defect) อัตโนมัติจากการอัปโหลดข้อมูล JSON
* **⚡ Modern Stack:** พัฒนาด้วย TypeScript ทั้งระบบเพื่อความแม่นยำของข้อมูลและความง่ายในการบำรุงรักษาโค้ด

---

## 🛠 Tech Stack
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Axios, React Router.
- **Backend:** Node.js, Express, TypeScript, SQLite3.
- **Database:** SQLite (Relational Database) พร้อมระบบ `ON DELETE CASCADE`.

---

## 📂 Project Structure
```text
.
├── backend/            # Express Server & SQLite Database
│   ├── src/
│   │   ├── services/   # Business Logic (Calculations)
│   │   ├── data/       # Standards & Mock Data
│   │   └── index.ts    # Main API Routes
├── frontend/           # React App (Vite)
│   ├── src/
│   │   ├── pages/      # Create, Result, History, Edit
│   │   ├── components/ # Shared Components
│   │   └── translations.ts # Multi-language Dictionary
└── easyrice.db         # Database File (SQLite)
```

---

## 🚀 How to Run (Local)

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```
*Backend will run on:* `http://localhost:5000`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Frontend will run on:* `http://localhost:5173`

---

## 📖 Features Overview
* **Create Inspection:** แบบฟอร์มสร้างรายการตรวจสอบ พร้อมอัปโหลดไฟล์ Raw Data (.json)
* **Result View:** แสดงผลการตรวจสอบแบบละเอียด พร้อมรูปภาพตัวอย่างและตารางสรุปเปอร์เซ็นต์
* **Inspection History:** ระบบจัดการประวัติการตรวจสอบ ค้นหาตาม ID, กรองตามวันที่ และลบข้อมูลครั้งละหลายรายการ (Bulk Delete)
* **Edit Result:** แก้ไขข้อมูลพื้นฐาน (ราคา, จุดสุ่มตัวอย่าง, หมายเหตุ) ของรายการที่ตรวจสอบแล้ว