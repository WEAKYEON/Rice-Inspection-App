// filename: frontend/src/App.tsx
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

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      <div className="min-h-screen bg-white dark:bg-[#0a0f1c] text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <BrowserRouter>

          {/* 🌟 แถบเมนูด้านบน (Navbar) 🌟 */}
          <nav className="bg-gray-50 dark:bg-[#111827] border-b dark:border-gray-800 px-8 py-4 flex justify-between items-center transition-colors sticky top-0 z-50 shadow-sm">

            {/* ฝั่งซ้าย: โลโก้ และ ลิงก์เมนู */}
            <div className="flex gap-8 items-center">
              <Link to="/">
                <img
                  src="https://easyrice.ai/logo/easyrice_logo_full.svg"
                  alt="EASYRICE Logo"
                  className="h-8 w-auto hover:opacity-80 transition-opacity"
                />
              </Link>

              <div className="flex gap-4">
                <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-green-700 dark:hover:text-cyan-400 font-medium transition-colors">
                  {t.inspection || "Create Inspection"}
                </Link>
                <Link to="/history" className="text-gray-600 dark:text-gray-300 hover:text-green-700 dark:hover:text-cyan-400 font-medium transition-colors">
                  {t.history || "History"}
                </Link>
              </div>
            </div>

            {/* ฝั่งขวา: ปุ่มสลับภาษา และ ธีม */}
            <div className="flex gap-3">
              {/* ปุ่มเปลี่ยนภาษา */}
              <button
                onClick={() => setLang(lang === "en" ? "th" : "en")}
                className="w-48 text-center flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              >
                {t.langBtn}
              </button>

              {/* ปุ่มเปลี่ยนโหมด */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="w-48 text-center flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium bg-gray-800 text-white dark:bg-cyan-500 dark:text-black hover:bg-gray-700 dark:hover:bg-cyan-400 transition-colors dark:shadow-[0_0_10px_rgba(6,182,212,0.4)]"
              >
                {isDarkMode ? t.themeLight : t.themeDark}
              </button>
            </div>
          </nav>

          {/* พื้นที่สำหรับแสดงเนื้อหาแต่ละหน้า */}
          <div className="pt-4 pb-12">
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