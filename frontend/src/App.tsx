import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect, createContext } from "react";
import CreateInspection from "./pages/CreateInspection";
import Result from "./pages/Result";
import EditResult from "./pages/EditResult";
import History from "./pages/History";
import { translations } from "./translations";

export const LanguageContext = createContext<any>(null);

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [lang, setLang] = useState<"en" | "th">("en");

  // 🛠️ แก้ปัญหาที่ 1: พื้นที่สีขาวด้านล่าง
  // สั่งให้ตัว Body ของเว็บเปลี่ยนสีตามโหมดไปด้วยเลย เพื่อไม่ให้มีสีขาวโผล่มาตอนเลื่อนจอ
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#0a0f1c'; // สีพื้นหลังจอ Dark
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#ffffff'; // สีพื้นหลังจอ Light
    }
  }, [isDarkMode]);

  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {/* ใส่ flex และ flex-col เพื่อดันให้เนื้อหาเต็มจอพอดี */}
      <div className="min-h-screen bg-white dark:bg-[#0a0f1c] text-gray-900 dark:text-gray-100 transition-colors duration-300 flex flex-col">
        <BrowserRouter>

          {/* 🛠️ แก้ไข Navbar เพื่อให้โลโก้อยู่บรรทัดเดียวกับเมนูและไปทางซ้าย */}
          {/* ปรับให้เป็น flex-row ตลอดเวลา ไม่ใช้ md:flex-row เพื่อให้เรียงกันบนมือถือ */}
          <nav className="bg-gray-50 dark:bg-[#111827] border-b dark:border-gray-800 px-4 py-2 flex flex-row justify-between items-center transition-colors sticky top-0 z-50 shadow-sm">

            {/* กลุ่มซ้าย: โลโก้ และ เมนู */}
            {/* ทำให้โลโก้และเมนูเป็นแนวราบ (row) ตลอดเวลา */}
            <div className="flex flex-row gap-6 items-center">
              <Link to="/">
                <img
                  src="https://easyrice.ai/logo/easyrice_logo_full.svg"
                  alt="EASYRICE Logo"
                  // ลดขนาดโลโก้ลงนิดหน่อยบนมือถือเพื่อไม่ให้เบียดเกินไป
                  className="h-10 md:h-14 w-auto hover:opacity-80 transition-all duration-300 dark:invert dark:hue-rotate-[240deg] dark:brightness-110"
                />
              </Link>

              {/* เมนู (ลด gap เหลือ 3) */}
              <div className="flex gap-3 text-xs md:text-sm">
                <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-green-700 dark:hover:text-cyan-400 font-medium transition-colors">
                  {t.inspection || "Inspection"}
                </Link>
                <Link to="/history" className="text-gray-600 dark:text-gray-300 hover:text-green-700 dark:hover:text-cyan-400 font-medium transition-colors">
                  {t.history || "History"}
                </Link>
              </div>
            </div>

            {/* กลุ่มขวา: ปุ่มสลับภาษา และ ธีม (ใช้กลุ่มปุ่มเล็กที่เราเพิ่งปรับมา) */}
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setLang(lang === "en" ? "th" : "en")}
                className="w-16 md:w-20 text-center flex items-center justify-center px-2 py-1.5 rounded-md text-xs font-medium border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              >
                {t.langBtn || "TH"}
              </button>

              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="w-24 md:w-28 text-center flex items-center justify-center px-2 py-1.5 rounded-md text-xs font-medium bg-gray-800 text-white dark:bg-cyan-500 dark:text-black hover:bg-gray-700 dark:hover:bg-cyan-400 transition-colors dark:shadow-[0_0_10px_rgba(6,182,212,0.4)]"
              >
                {isDarkMode ? (t.themeLight || "Light Theme") : (t.themeDark || "Dark Theme")}
              </button>
            </div>
          </nav>

          {/* พื้นที่สำหรับแสดงเนื้อหาแต่ละหน้า */}
          <div className="flex-grow pt-4 pb-12">
            <Routes>
              <Route path="/" element={<CreateInspection />} />
              <Route path="/result/:id" element={<Result />} />
              <Route path="/edit/:id" element={<EditResult />} />
              <Route path="/history" element={<History />} />
            </Routes>
          </div>

        </BrowserRouter>
      </div>
    </LanguageContext.Provider>
  );
}