import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { LanguageContext } from "../App"; // ดึงระบบแปลภาษามาใช้

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function EditResult() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useContext(LanguageContext); // เรียกใช้ t สำหรับแปลภาษา

    const [note, setNote] = useState("");
    const [price, setPrice] = useState("");
    const [samplingPoint, setSamplingPoint] = useState<string[]>([]);
    const [samplingDatetime, setSamplingDatetime] = useState("");
    const [loading, setLoading] = useState(true);

    // ดึงข้อมูลเดิมมาใส่ในฟอร์มก่อน
    useEffect(() => {
        axios.get(`${API_URL}/history/${id}`)
            .then((res) => {
                const basic = res.data.basic_information;
                setNote(basic.note || "");
                setPrice(basic.price ? basic.price.toString() : "");
                setSamplingPoint(basic.sampling_point || []);
                // แปลงรูปแบบวันที่ให้เข้ากับช่อง input type="datetime-local"
                if (basic.sampling_datetime) {
                    setSamplingDatetime(new Date(basic.sampling_datetime).toISOString().slice(0, 16));
                }
            })
            .catch((err) => console.error("Fetch error:", err))
            .finally(() => setLoading(false));
    }, [id]);

    const handleCheckboxChange = (value: string) => {
        setSamplingPoint((prev) =>
            prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.put(`${API_URL}/history/${id}`, {
                note,
                price: price ? parseFloat(price) : null,
                sampling_point: samplingPoint,
                sampling_datetime: samplingDatetime || null
            });
            // แก้ไขเสร็จแล้ว กลับไปหน้า Result
            navigate(`/result/${id}`);
        } catch (error) {
            alert("เกิดข้อผิดพลาดในการอัปเดตข้อมูล");
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500 dark:text-gray-400">{t.loading}</div>;

    return (
        <div className="p-8 max-w-2xl mx-auto transition-colors duration-300">
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">{t.editTitle}</h1>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-[#111827] dark:border dark:border-gray-800 p-8 rounded-lg border shadow-sm transition-colors duration-300">

                {/* Price */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.priceRange}</label>
                    <input type="number" min="0" max="100000" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)}
                        className="mt-1 block w-full rounded-md border dark:border-gray-700 dark:bg-gray-800 dark:text-white p-2 shadow-sm focus:ring-green-500 focus:border-green-500 transition-colors" />
                </div>

                {/* Sampling Point */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.samplingPoint}</label>
                    <div className="flex gap-4">
                        {["Front End", "Back End", "Other"].map((point) => (
                            <label key={point} className="flex items-center text-sm dark:text-gray-300">
                                <input type="checkbox" checked={samplingPoint.includes(point)} onChange={() => handleCheckboxChange(point)}
                                    className="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-green-600 mr-2" />
                                {point === "Front End" ? t.frontEnd : point === "Back End" ? t.backEnd : t.other}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Datetime */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.samplingDate}</label>
                    <input type="datetime-local" value={samplingDatetime} onChange={(e) => setSamplingDatetime(e.target.value)}
                        className="mt-1 block w-full rounded-md border dark:border-gray-700 dark:bg-gray-800 dark:text-white p-2 shadow-sm focus:ring-green-500 focus:border-green-500 transition-colors" />
                </div>

                {/* Note */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.note}</label>
                    <textarea rows={4} value={note} onChange={(e) => setNote(e.target.value)}
                        className="mt-1 block w-full rounded-md border dark:border-gray-700 dark:bg-gray-800 dark:text-white p-2 shadow-sm focus:ring-green-500 focus:border-green-500 transition-colors"></textarea>
                </div>

                {/* ปุ่มกด จัด Layout ให้ชิดขวาเหมือนในรูป Figma ที่ส่งมา */}
                <div className="flex justify-end gap-4 pt-4 border-t dark:border-gray-700">
                    <button type="button" onClick={() => navigate(`/result/${id}`)}
                        className="px-6 py-2 border border-green-700 text-green-700 dark:border-gray-600 dark:text-gray-300 rounded font-medium hover:bg-green-50 dark:hover:bg-gray-800 transition">
                        {t.cancel}
                    </button>
                    <button type="submit"
                        className="px-6 py-2 bg-green-700 dark:bg-cyan-500 text-white dark:text-black rounded font-medium hover:bg-green-800 dark:hover:bg-cyan-400 dark:shadow-[0_0_10px_rgba(6,182,212,0.5)] transition">
                        {t.submit}
                    </button>
                </div>
            </form>
        </div>
    );
}