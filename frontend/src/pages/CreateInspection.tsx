import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LanguageContext } from "../App"; // ดึงระบบแปลภาษามาใช้

// กำหนด URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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
        <div className="p-4 md:p-6 max-w-xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
                {t.createTitle || "Create Inspection"}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-[#111827] dark:border dark:border-gray-800 p-6 rounded-lg border shadow-sm transition-colors duration-300">

                {/* Name */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{t.nameReq || "Name*"}</label>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Please Holder"
                        className="block w-full rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white p-2 text-sm shadow-sm focus:border-green-500 focus:ring-green-500 transition-colors" />
                </div>

                {/* Standard Dropdown */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{t.stdReq || "Standard*"}</label>
                    <select required value={standardId} onChange={(e) => setStandardId(e.target.value)}
                        className="block w-full rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white p-2 text-sm shadow-sm focus:border-green-500 focus:ring-green-500 transition-colors">
                        <option value="" disabled>{t.selectStd || "Please Select Standard"}</option>
                        {standards.map((std) => (
                            <option key={std.id} value={std.id}>
                                {t[std.name] || std.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Upload JSON */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{t.uploadReq || "Upload File*"}</label>
                    <input type="file" accept=".json" required onChange={handleFileUpload}
                        className="block w-full text-sm text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-700 rounded-md p-1.5 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 dark:file:bg-gray-700 dark:file:text-gray-200" />
                </div>

                {/* Note */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{t.note || "Note"}</label>
                    <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Please Holder"
                        className="block w-full rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white p-2 text-sm shadow-sm focus:border-green-500 focus:ring-green-500 transition-colors" />
                </div>

                {/* Price */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{t.priceRange || "Price"}</label>
                    <input type="number" min="0" max="100000" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="10,000"
                        className="block w-full rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white p-2 text-sm shadow-sm focus:border-green-500 focus:ring-green-500 transition-colors" />
                </div>

                {/* Sampling Point */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t.samplingPoint || "Sampling Point"}</label>
                    <div className="flex gap-6">
                        {["Front End", "Back End", "Other"].map((point) => (
                            <label key={point} className="flex items-center text-sm font-medium text-gray-800 dark:text-gray-300">
                                <input type="checkbox" checked={samplingPoint.includes(point)} onChange={() => handleCheckboxChange(point)}
                                    className="rounded border-gray-400 w-4 h-4 text-green-600 focus:ring-green-500 mr-2" />
                                {point === "Front End" ? t.frontEnd : point === "Back End" ? t.backEnd : t.other}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Datetime */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{t.samplingDate || "Date/Time of Sampling"}</label>
                    <input type="datetime-local" value={samplingDatetime} onChange={(e) => setSamplingDatetime(e.target.value)}
                        className="block w-full rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white p-2 text-sm shadow-sm focus:border-green-500 focus:ring-green-500 transition-colors" />
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={() => navigate(-1)}
                        className="px-6 py-2 bg-white dark:bg-gray-800 border border-green-600 dark:border-green-500 text-green-700 dark:text-cyan-400 font-bold rounded hover:bg-green-50 dark:hover:bg-gray-700 transition">
                        {t.cancel || "Cancel"}
                    </button>
                    <button type="submit" disabled={isLoading}
                        className="px-6 py-2 bg-[#1A8754] dark:bg-cyan-500 text-white dark:text-black font-bold rounded hover:bg-green-800 dark:hover:bg-cyan-400 dark:shadow-[0_0_10px_rgba(6,182,212,0.5)] transition disabled:opacity-50 disabled:cursor-not-allowed">
                        {isLoading ? (t.loading || "Submitting...") : (t.submit || "Submit")}
                    </button>
                </div>

            </form>
        </div>
    );
}