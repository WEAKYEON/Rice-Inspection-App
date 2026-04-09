# EASYRICE Rice Inspection App 

โปรเจกต์ระบบตรวจสอบคุณภาพข้าว เน้นการใช้งานที่ลื่นไหล รองรับการแสดงผลทั้งภาษาไทยและอังกฤษ พร้อมระบบสลับธีม (Dark Theme) เพื่อประสบการณ์ใช้งานที่ดีที่สุด

---

## Key Features (Highlights)
นอกจากฟีเจอร์พื้นฐานตามโจทย์แล้ว โปรเจกต์นี้ยังได้รับการพัฒนาเพิ่มเติมในส่วนของ:

* **Dual Theme System:** รองรับโหมดสว่าง (Light Theme) และโหมดมืด (Dark Theme) เพื่อความถนัดของผู้ใช้
* **Real-time i18n:** ระบบสลับภาษา ไทย-อังกฤษ (Multi-language) ที่ทำงานครอบคลุมทั้ง UI และข้อมูลที่ดึงมาจาก Database โดยใช้ React Context API
* **Dynamic Calculation:** ระบบคำนวณสัดส่วนข้าว (Composition) และข้าวตำหนิ (Defect) อัตโนมัติจากการอัปโหลดข้อมูล JSON
* **Modern Stack:** พัฒนาด้วย TypeScript ทั้งระบบเพื่อความแม่นยำของข้อมูลและความง่ายในการบำรุงรักษาโค้ด

---

## Tech Stack
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Axios, React Router.
- **Backend:** Node.js, Express, TypeScript, SQLite3.
- **Database:** SQLite (Relational Database) พร้อมระบบ `ON DELETE CASCADE`.

---

## Project Structure
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

## Live Demo
- **Frontend (Web App):** [https://easyrice-inspection-app.vercel.app](https://easyrice-inspection-app.vercel.app)
- **Backend (API):** [https://easyrice-exam-web.onrender.com](https://easyrice-exam-web.onrender.com)

---

## Screenshots
<img width="1919" height="914" alt="Screenshot 2026-03-19 032610" src="https://github.com/user-attachments/assets/2518875a-add1-48c3-9cdd-c069415bed4c" />
<img width="1919" height="912" alt="Screenshot 2026-03-19 032621" src="https://github.com/user-attachments/assets/efee08ab-6c31-4a14-80ab-95a96507bcfd" />

<img width="1919" height="910" alt="Screenshot 2026-03-19 032641" src="https://github.com/user-attachments/assets/c4e2929b-bca5-4ac1-89df-75a106f652cd" />
<img width="1919" height="918" alt="Screenshot 2026-03-19 033625" src="https://github.com/user-attachments/assets/c737bcd6-249f-4727-83a4-d3b9dc586f59" />

<img width="1902" height="913" alt="Screenshot 2026-03-19 032652" src="https://github.com/user-attachments/assets/9653884f-3d53-4610-a972-c3e5b2e677d6" />
<img width="1902" height="912" alt="Screenshot 2026-03-19 033446" src="https://github.com/user-attachments/assets/c6ef6df2-d5c5-4936-b636-2b701a6e9187" />

---

## Getting Started (การติดตั้งและรันโปรเจกต์)

หากต้องการรันโปรเจกต์นี้บนเครื่อง Local (localhost) สามารถทำตามขั้นตอนด้านล่างนี้:

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 1. Backend Setup (รันเซิร์ฟเวอร์หลังบ้าน)
เปิด Terminal และเข้าไปที่โฟลเดอร์ `backend`

```bash
cd backend
npm install
npm run dev
```

Backend จะรันอยู่ที่ ``http://localhost:5000`` (ระบบจะสร้างไฟล์ ``easyrice.db`` ให้อัตโนมัติเมื่อรันครั้งแรก)

### 2. Frontend Setup (รันหน้าเว็บ)
เปิด Terminal ใหม่ และเข้าไปที่โฟลเดอร์ ``frontend``

```bash
cd frontend
npm install
```

### ตั้งค่า Environment Variable:
สร้างไฟล์ ``.env`` ในโฟลเดอร์ ``frontend`` และกำหนดค่า API URL ชี้ไปยัง Backend:

```text
VITE_API_URL=http://localhost:5000
```

### เริ่มรันโปรเจกต์:
```bash
npm run dev
```

Frontend จะรันอยู่ที่ ``http://localhost:5173`` (หรือตามที่ Vite กำหนด)

---

### API Endpoints (Brief)
- ``GET /standard`` - ดึงข้อมูลมาตรฐานข้าวทั้งหมด
- ``GET /history`` - ดึงข้อมูลประวัติการตรวจสอบทั้งหมด
- ``GET /history/:id`` - ดึงข้อมูลการตรวจสอบราย ID (พร้อมคำนวณผลลัพธ์)
- ``POST /history`` - บันทึกข้อมูลการตรวจสอบใหม่
- ``PUT /history/:id`` - อัปเดตข้อมูลการตรวจสอบ
- ``DELETE /history/:id`` - ลบข้อมูลการตรวจสอบ
