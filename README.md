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