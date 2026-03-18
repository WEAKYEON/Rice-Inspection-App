// filename: frontend/src/pages/CreateInspection.tsx
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LanguageContext } from "../App"; // ดึงระบบแปลภาษามาใช้

// กำหนด URL ของ Backend ของเรา
const API_URL = "http://localhost:5000";

interface Standard {
    id: string;
    name: string;
}

export default function CreateInspection() {
    const navigate = useNavigate();
    const { t } = useContext(LanguageContext); // เรียกใช้ t สำหรับแปลภาษา

    // State สำหรับเก็บข้อมูลฟอร์ม
    const [name, setName] = useState("");
    const [standardId, setStandardId] = useState("");
    const [note, setNote] = useState("");
    const [price, setPrice] = useState("");
    const [samplingPoint, setSamplingPoint] = useState<string[]>([]);
    const [samplingDatetime, setSamplingDatetime] = useState("");

    // State สำหรับเก็บข้อมูลไฟล์และรายการ Standard
    const [rawData, setRawData] = useState<any>(null);
    const [fileName, setFileName] = useState("");
    const [standards, setStandards] = useState<Standard[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // ดึงข้อมูล Standard จาก Backend ตอนโหลดหน้าเว็บครั้งแรก
    useEffect(() => {
        axios.get(`${API_URL}/standard`)
            .then((res) => setStandards(res.data))
            .catch((err) => console.error("Error fetching standards:", err));
    }, []);

    // ฟังก์ชันจัดการ Checkbox ของ Sampling Point
    const handleCheckboxChange = (value: string) => {
        setSamplingPoint((prev) =>
            prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
        );
    };

    // ฟังก์ชันอ่านไฟล์ JSON ที่อัปโหลด
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target?.result as string);
                setRawData(json);
            } catch (error) {
                alert("Invalid JSON file");
            }
        };
        reader.readAsText(file);
    };

    // ฟังก์ชันกดปุ่ม Submit เพื่อส่งข้อมูลไป Backend
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !standardId || !rawData) {
            alert("กรุณากรอก Name, Standard และอัปโหลดไฟล์ JSON");
            return;
        }

        setIsLoading(true);
        try {
            const payload = {
                name,
                standard_id: standardId,
                note,
                price: price ? parseFloat(price) : null,
                sampling_point: samplingPoint,
                sampling_datetime: samplingDatetime,
                raw_data: rawData
            };

            // ยิง API แบบ POST ไปที่ /history
            const response = await axios.post(`${API_URL}/history`, payload);

            // ถ้าสำเร็จ ให้เปลี่ยนหน้าไปที่ Result (พร้อมแนบ ID ไปด้วย)
            navigate(`/result/${response.data.inspection_id}`);
        } catch (error) {
            console.error("Submit error:", error);
            alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto transition-colors duration-300">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">{t.createTitle}</h1>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-[#111827] dark:border dark:border-gray-800 p-8 rounded-lg border shadow-sm transition-colors duration-300">
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.nameReq}</label>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white p-2 shadow-sm focus:border-green-500 focus:ring-green-500 transition-colors" />
                </div>

                {/* Standard Dropdown */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.stdReq}</label>
                    <select required value={standardId} onChange={(e) => setStandardId(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white p-2 shadow-sm focus:border-green-500 focus:ring-green-500 transition-colors">
                        <option value="" disabled>{t.selectStd}</option>
                        {standards.map((std) => (
                            <option key={std.id} value={std.id}>
                                {t[std.name] || std.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Upload JSON */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.uploadReq}</label>
                    <input type="file" accept=".json" required onChange={handleFileUpload}
                        className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 dark:file:bg-gray-700 dark:file:text-cyan-400 transition-colors" />
                    {fileName && <p className="text-sm text-green-600 dark:text-cyan-400 mt-2">Selected: {fileName}</p>}
                </div>

                <hr className="my-6 border-gray-200 dark:border-gray-700" />
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">{t.optFields}</h3>

                {/* Price */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.priceRange}</label>
                    <input type="number" min="0" max="100000" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white p-2 shadow-sm focus:border-green-500 focus:ring-green-500 transition-colors" />
                </div>

                {/* Sampling Point */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.samplingPoint}</label>
                    <div className="flex gap-4">
                        {["Front End", "Back End", "Other"].map((point) => (
                            <label key={point} className="flex items-center text-sm dark:text-gray-300">
                                <input type="checkbox" checked={samplingPoint.includes(point)} onChange={() => handleCheckboxChange(point)}
                                    className="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-green-600 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50 mr-2" />
                                {point === "Front End" ? t.frontEnd : point === "Back End" ? t.backEnd : t.other}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Datetime */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.samplingDate}</label>
                    <input type="datetime-local" value={samplingDatetime} onChange={(e) => setSamplingDatetime(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white p-2 shadow-sm focus:border-green-500 focus:ring-green-500 transition-colors" />
                </div>

                {/* Note */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.note}</label>
                    <textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white p-2 shadow-sm focus:border-green-500 focus:ring-green-500 transition-colors"></textarea>
                </div>

                {/* Submit Button */}
                <button type="submit" disabled={isLoading}
                    className="w-full bg-green-700 dark:bg-cyan-500 text-white dark:text-black font-bold py-3 px-4 rounded hover:bg-green-800 dark:hover:bg-cyan-400 dark:shadow-[0_0_10px_rgba(6,182,212,0.5)] transition disabled:opacity-50 disabled:cursor-not-allowed">
                    {isLoading ? t.loading : t.submit}
                </button>
            </form>
        </div>
    );
}