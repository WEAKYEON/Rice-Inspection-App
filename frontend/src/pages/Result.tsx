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

    // เรียกใช้คำแปลภาษา
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
        <div className="p-8 max-w-6xl mx-auto transition-colors duration-300">
            <h1 className="text-3xl font-bold text-center mb-8 text-black dark:text-white transition-colors">{t.inspection}</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* ฝั่งซ้าย: รูปภาพ และ ปุ่ม */}
                <div className="col-span-1 flex flex-col">
                    <div className="bg-black w-full aspect-[3/4] rounded-md overflow-hidden flex items-center justify-center border dark:border-gray-800 transition-colors">
                        <img src="/rice.jpg" alt="Rice Sample" className="object-cover w-full h-full opacity-80" />
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <button onClick={() => navigate("/")}
                            className="px-6 py-1.5 border border-green-700 text-green-700 dark:border-gray-600 dark:text-gray-300 rounded text-sm font-medium hover:bg-green-50 dark:hover:bg-gray-800 transition">
                            {t.back}
                        </button>
                        <button onClick={() => navigate(`/edit/${id}`)}
                            className="px-6 py-1.5 bg-green-700 text-white dark:bg-cyan-500 dark:text-black rounded text-sm font-medium hover:bg-green-800 dark:hover:bg-cyan-400 dark:shadow-[0_0_10px_rgba(6,182,212,0.5)] transition">
                            {t.edit}
                        </button>
                    </div>
                </div>

                {/* ฝั่งขวา: ข้อมูลเรียงเป็นกล่องๆ */}
                <div className="col-span-2 flex flex-col gap-4">

                    {/* Box 1: Basic Info */}
                    <div className="bg-gray-50 dark:bg-[#111827] dark:border dark:border-gray-800 transition-colors p-4 rounded-md text-sm grid grid-cols-2 gap-y-4">
                        <div><p className="text-gray-500 dark:text-gray-400 mb-1">{t.createDate}</p><p className="font-medium dark:text-gray-200">{new Date(basic.created_at).toLocaleString()}</p></div>
                        <div><p className="text-gray-500 dark:text-gray-400 mb-1">{t.id}:</p><p className="font-medium dark:text-cyan-400">{basic.inspection_id}</p></div>
                        <div><p className="text-gray-500 dark:text-gray-400 mb-1">{t.standard}:</p><p className="font-medium dark:text-gray-200">{t[basic.standard] || basic.standard}</p></div>
                        <div><p className="text-gray-500 dark:text-gray-400 mb-1">{t.totalSample}:</p><p className="font-medium dark:text-gray-200">{basic.total_sample} kernal</p></div>
                        <div><p className="text-gray-500 dark:text-gray-400 mb-1">{t.updateDate}:</p><p className="font-medium dark:text-gray-200">{new Date(basic.updated_at).toLocaleString()}</p></div>
                    </div>

                    {/* Box 2: Optional Info */}
                    <div className="bg-gray-50 dark:bg-[#111827] dark:border dark:border-gray-800 transition-colors p-4 rounded-md text-sm grid grid-cols-2 gap-y-4">
                        <div><p className="text-gray-500 dark:text-gray-400 mb-1">{t.note}</p><p className="font-medium dark:text-gray-200">{basic.note || "-"}</p></div>
                        <div><p className="text-gray-500 dark:text-gray-400 mb-1">{t.price}</p><p className="font-medium dark:text-gray-200">{basic.price || "-"}</p></div>
                        <div><p className="text-gray-500 dark:text-gray-400 mb-1">{t.samplingDate}</p><p className="font-medium dark:text-gray-200">{basic.sampling_datetime ? new Date(basic.sampling_datetime).toLocaleString() : "-"}</p></div>
                        <div><p className="text-gray-500 dark:text-gray-400 mb-1">{t.samplingPoint}</p><p className="font-medium dark:text-gray-200">{basic.sampling_point ? (Array.isArray(basic.sampling_point) ? basic.sampling_point.join(", ") : basic.sampling_point) : "-"}</p></div>
                    </div>

                    {/* Box 3: Composition */}
                    <div className="bg-gray-50 dark:bg-[#111827] dark:border dark:border-gray-800 transition-colors p-4 rounded-md">
                        <h3 className="font-bold text-lg mb-3 dark:text-gray-100">{t.composition}</h3>
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-200 dark:bg-gray-800 transition-colors">
                                <tr>
                                    <th className="px-3 py-2 text-left font-semibold dark:text-gray-300">{t.name}</th>
                                    <th className="px-3 py-2 text-right font-semibold dark:text-gray-300">{t.length}</th>
                                    <th className="px-3 py-2 text-right font-semibold dark:text-gray-300">{t.actual}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-[#0a0f1c] transition-colors">
                                {result.composition.map((item: any, idx: number) => (
                                    <tr key={idx}>
                                        <td className="px-3 py-2 dark:text-gray-300">{t[item.name] || item.name}</td>
                                        <td className="px-3 py-2 text-right text-gray-500 dark:text-gray-500">-</td>
                                        <td className="px-3 py-2 text-right text-green-600 dark:text-cyan-400 font-medium">{item.actual.toFixed(2)} %</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Box 4: Defect Rice */}
                    <div className="bg-gray-50 dark:bg-[#111827] dark:border dark:border-gray-800 transition-colors p-4 rounded-md">
                        <h3 className="font-bold text-lg mb-3 dark:text-gray-100">{t.defectRice}</h3>
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-200 dark:bg-gray-800 transition-colors">
                                <tr>
                                    <th className="px-3 py-2 text-left font-semibold dark:text-gray-300">{t.name}</th>
                                    <th className="px-3 py-2 text-right font-semibold dark:text-gray-300">{t.actual}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-[#0a0f1c] transition-colors">
                                {result.defect.map((item: any, idx: number) => (
                                    <tr key={idx}>
                                        <td className="px-3 py-2 dark:text-gray-300">{t[item.name] || item.name}</td>
                                        <td className="px-3 py-2 text-right text-green-600 dark:text-cyan-400 font-medium">{item.actual.toFixed(2)} %</td>
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