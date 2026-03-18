// filename: frontend/src/pages/History.tsx
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LanguageContext } from "../App"; // ดึงระบบภาษามาใช้

const API_URL = "http://localhost:5000";

export default function History() {
    const navigate = useNavigate();
    const { t } = useContext(LanguageContext); // เรียกใช้พจนานุกรม

    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const [search, setSearch] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;

    const fetchHistory = (page = 1) => {
        setLoading(true);
        let url = `${API_URL}/history?page=${page}&limit=${limit}`;
        if (search) url += `&search=${search}`;
        if (startDate && endDate) url += `&startDate=${startDate}&endDate=${endDate}`;

        axios.get(url).then((res) => {
            setHistory(res.data.data);
            setTotalPages(res.data.pagination.total_pages);
            setCurrentPage(res.data.pagination.current_page);
        }).finally(() => setLoading(false));
    };

    useEffect(() => { fetchHistory(currentPage); }, [currentPage]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchHistory(1);
    };

    const handleClear = () => {
        setSearch(""); setStartDate(""); setEndDate(""); setCurrentPage(1);
        setTimeout(() => fetchHistory(1), 0);
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleDelete = async () => {
        if (selectedIds.length === 0) return;
        if (!confirm(`Confirm delete ${selectedIds.length} items?`)) return;
        try {
            await axios.delete(`${API_URL}/history`, { data: { ids: selectedIds } });
            setSelectedIds([]);
            fetchHistory(currentPage);
        } catch { alert("Delete failed"); }
    };

    return (
        <div className="p-8 space-y-6 max-w-7xl mx-auto transition-colors duration-300">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{t.historyTitle}</h1>
                {selectedIds.length > 0 && (
                    <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition">
                        {t.deleteSelected} ({selectedIds.length})
                    </button>
                )}
            </div>

            <form onSubmit={handleSearch} className="bg-white dark:bg-[#111827] dark:border dark:border-gray-800 p-4 border rounded-lg shadow-sm flex flex-wrap gap-4 items-end transition-colors duration-300">
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.searchId}</label>
                    <input type="text" placeholder={t.searchId} value={search} onChange={(e) => setSearch(e.target.value)}
                        className="w-full border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md p-2 focus:ring-green-500 focus:border-green-500 transition-colors" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.fromDate}</label>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                        className="border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md p-2 focus:ring-green-500 focus:border-green-500 transition-colors" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.toDate}</label>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                        className="border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md p-2 focus:ring-green-500 focus:border-green-500 transition-colors" />
                </div>
                <div className="flex gap-2">
                    <button type="submit" className="bg-green-700 dark:bg-cyan-500 text-white dark:text-black px-6 py-2 rounded font-medium hover:bg-green-800 dark:hover:bg-cyan-400 transition">{t.search}</button>
                    <button type="button" onClick={handleClear} className="bg-gray-200 dark:bg-gray-700 dark:text-gray-300 text-gray-700 px-4 py-2 rounded font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition">{t.clear}</button>
                </div>
            </form>

            <div className="overflow-hidden border dark:border-gray-800 rounded-lg shadow-sm bg-white dark:bg-[#111827] transition-colors duration-300">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                    <thead className="bg-green-700 dark:bg-cyan-600 transition-colors">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase">{t.select}</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase">{t.createDate}</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase">{t.id}</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase">{t.name}</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase">{t.standard}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                        {loading ? (
                            <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">{t.loading}</td></tr>
                        ) : history.length === 0 ? (
                            <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">{t.noData}</td></tr>
                        ) : (
                            history.map((item) => (
                                <tr key={item.id} className="hover:bg-green-50 dark:hover:bg-gray-800 cursor-pointer transition">
                                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                        <input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => toggleSelect(item.id)} className="rounded text-green-600 dark:bg-gray-700 dark:border-gray-600" />
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300" onClick={() => navigate(`/result/${item.id}`)}>
                                        {new Date(item.created_at).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-green-700 dark:text-cyan-400" onClick={() => navigate(`/result/${item.id}`)}>
                                        {item.id}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300" onClick={() => navigate(`/result/${item.id}`)}>
                                        {item.name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300" onClick={() => navigate(`/result/${item.id}`)}>
                                        {t[item.standard_name] || item.standard_name}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {!loading && totalPages > 0 && (
                <div className="flex justify-between items-center bg-white dark:bg-[#111827] dark:border dark:border-gray-800 p-4 border rounded-lg shadow-sm transition-colors duration-300">
                    <span className="text-sm text-gray-700 dark:text-gray-400">
                        {t.page} <span className="font-bold dark:text-gray-200">{currentPage}</span> {t.of} <span className="font-bold dark:text-gray-200">{totalPages}</span>
                    </span>
                    <div className="flex gap-2">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                            className="px-4 py-2 border dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-300 disabled:opacity-50 transition">
                            {t.prev}
                        </button>
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                            className="px-4 py-2 border dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-300 disabled:opacity-50 transition">
                            {t.next}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}