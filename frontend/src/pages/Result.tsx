import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { LanguageContext } from "../App";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Result() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const { t } = useContext(LanguageContext);

    useEffect(() => {
        axios.get(`${API_URL}/history/${id}`)
            .then((res) => setData(res.data))
            .catch((err) => {
                console.error("Error fetching result:", err);
                alert("ไม่พบข้อมูล หรือเกิดข้อผิดพลาด");
            })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="p-8 text-center text-gray-500 font-semibold text-lg dark:text-gray-400">{t.loading}</div>;
    if (!data) return <div className="p-8 text-center text-red-500 font-semibold text-lg">{t.noData}</div>;

    const basic = data.basic_information;
    const result = data.inspection_result;

    return (
        // ลด padding ด้านนอกจาก p-8 เป็น p-4 และใช้ max-w-5xl เพื่อบีบกรอบเข้ามา
        <div className="p-4 max-w-5xl mx-auto transition-colors duration-300">
            {/* ลด margin bottom ของหัวข้อจาก mb-8 เป็น mb-4 */}
            <h1 className="text-3xl font-bold text-center mb-4 text-black dark:text-white transition-colors">
                {t.inspection || "Inspection"}
            </h1>

            {/* ลด gap จาก 8 เป็น 6 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* ฝั่งซ้าย: รูปภาพ และ ปุ่ม */}
                <div className="col-span-1 flex flex-col">
                    {/* ปรับรูปให้มีความสูงไม่เกินไป ใช้ aspect-square หรือจำกัด max-h */}
                    <div className="bg-[#1e1e1e] w-full rounded-md overflow-hidden flex items-center justify-center border dark:border-gray-800 transition-colors shadow-sm">
                        <img src="/rice.jpg" alt="Rice Sample" className="object-contain w-full h-[400px] opacity-90" />
                    </div>
                    <div className="flex justify-end gap-2 mt-3">
                        <button onClick={() => navigate("/")}
                            className="px-5 py-1.5 bg-white border border-green-700 text-green-700 dark:bg-transparent dark:border-gray-500 dark:text-gray-300 rounded text-sm font-bold hover:bg-green-50 dark:hover:bg-gray-800 transition">
                            {t.back || "Back"}
                        </button>
                        <button onClick={() => navigate(`/edit/${id}`)}
                            className="px-5 py-1.5 bg-[#1A8754] text-white dark:bg-cyan-500 dark:text-black rounded text-sm font-bold hover:bg-green-800 dark:hover:bg-cyan-400 transition">
                            {t.edit || "Edit"}
                        </button>
                    </div>
                </div>

                {/* ฝั่งขวา: ข้อมูลเรียงเป็นกล่องๆ */}
                {/* ลด gap ของแต่ละกล่องลงเหลือ gap-3 */}
                <div className="col-span-2 flex flex-col gap-3">

                    {/* Box 1: Basic Info */}
                    <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 shadow-sm transition-colors p-3.5 rounded-md text-sm grid grid-cols-2 gap-y-3">
                        <div><p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{t.createDate || "Create Date - Time"}</p><p className="font-semibold text-gray-800 dark:text-gray-200">{new Date(basic.created_at).toLocaleString()}</p></div>
                        <div><p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{t.id || "Inspection ID:"}</p><p className="font-semibold text-gray-800 dark:text-gray-200">{basic.inspection_id}</p></div>
                        <div><p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{t.standard || "Standard:"}</p><p className="font-semibold text-gray-800 dark:text-gray-200">{t[basic.standard] || basic.standard}</p></div>
                        <div><p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{t.totalSample || "Total Sample:"}</p><p className="font-semibold text-gray-800 dark:text-gray-200">{basic.total_sample} kernal</p></div>
                        <div><p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{t.updateDate || "Update Date - Time:"}</p><p className="font-semibold text-gray-800 dark:text-gray-200">{new Date(basic.updated_at).toLocaleString()}</p></div>
                    </div>

                    {/* Box 2: Optional Info */}
                    <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 shadow-sm transition-colors p-3.5 rounded-md text-sm grid grid-cols-2 gap-y-3">
                        <div><p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{t.note || "Note"}</p><p className="font-semibold text-gray-800 dark:text-gray-200">{basic.note || "-"}</p></div>
                        <div><p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{t.priceRange || "Price"}</p><p className="font-semibold text-gray-800 dark:text-gray-200">{basic.price || "-"}</p></div>
                        <div><p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{t.samplingDate || "Date/Time of Sampling"}</p><p className="font-semibold text-gray-800 dark:text-gray-200">{basic.sampling_datetime ? new Date(basic.sampling_datetime).toLocaleString() : "-"}</p></div>
                        <div><p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{t.samplingPoint || "Sampling Point"}</p><p className="font-semibold text-gray-800 dark:text-gray-200">{basic.sampling_point ? (Array.isArray(basic.sampling_point) ? basic.sampling_point.join(", ") : basic.sampling_point) : "-"}</p></div>
                    </div>

                    {/* Box 3: Composition */}
                    <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 shadow-sm transition-colors p-3 rounded-md">
                        <h3 className="font-bold text-base mb-2 dark:text-gray-100">{t.composition || "Composition"}</h3>
                        <table className="min-w-full text-xs">
                            <thead className="bg-[#f5f5f5] dark:bg-gray-800 transition-colors">
                                <tr>
                                    <th className="px-3 py-1.5 text-left font-bold text-gray-700 dark:text-gray-300">{t.name || "Name"}</th>
                                    <th className="px-3 py-1.5 text-right font-bold text-gray-700 dark:text-gray-300">{t.length || "Length"}</th>
                                    <th className="px-3 py-1.5 text-right font-bold text-gray-700 dark:text-gray-300">{t.actual || "Actual"}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-[#0a0f1c] transition-colors">
                                {result.composition.map((item: any, idx: number) => (
                                    <tr key={idx}>
                                        <td className="px-3 py-1.5 dark:text-gray-300 font-medium">{t[item.name] || item.name}</td>
                                        <td className="px-3 py-1.5 text-right text-gray-500 dark:text-gray-500">-</td>
                                        <td className="px-3 py-1.5 text-right text-[#1A8754] dark:text-cyan-400 font-bold">{item.actual.toFixed(2)} %</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Box 4: Defect Rice */}
                    <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 shadow-sm transition-colors p-3 rounded-md">
                        <h3 className="font-bold text-base mb-2 dark:text-gray-100">{t.defectRice || "Defect Rice"}</h3>
                        <table className="min-w-full text-xs">
                            <thead className="bg-[#f5f5f5] dark:bg-gray-800 transition-colors">
                                <tr>
                                    <th className="px-3 py-1.5 text-left font-bold text-gray-700 dark:text-gray-300">{t.name || "Name"}</th>
                                    <th className="px-3 py-1.5 text-right font-bold text-gray-700 dark:text-gray-300">{t.actual || "Actual"}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-[#0a0f1c] transition-colors">
                                {result.defect.map((item: any, idx: number) => (
                                    <tr key={idx}>
                                        <td className="px-3 py-1.5 dark:text-gray-300 font-medium">{t[item.name] || item.name}</td>
                                        <td className="px-3 py-1.5 text-right text-[#1A8754] dark:text-cyan-400 font-bold">{item.actual.toFixed(2)} %</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    );
}