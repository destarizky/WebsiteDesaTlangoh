import { Head, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import {
    TrendingUp, PiggyBank, ArrowDownRight, ArrowUpRight,
    BarChart3, CheckCircle2, Calendar, FileSpreadsheet, Percent
} from 'lucide-react';
import { formatRupiah, cn } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ApbdesItem {
    id: number;
    year: number;
    type: 'pendapatan' | 'belanja' | 'pembiayaan';
    category: string;
    description: string;
    budgeted_amount: number;
    realized_amount: number;
}

interface Props {
    apbdes: Record<string, ApbdesItem[]>;
    selectedYear: number | string;
    years: number[];
}

export default function ApbdesIndex({ apbdes, selectedYear, years }: Props) {
    const pendapatanItems = apbdes['pendapatan'] || [];
    const belanjaItems    = apbdes['belanja'] || [];
    const pembiayaanItems = apbdes['pembiayaan'] || [];

    const totalPendapatanBudget = pendapatanItems.reduce((acc, i) => acc + Number(i.budgeted_amount), 0);
    const totalPendapatanReal   = pendapatanItems.reduce((acc, i) => acc + Number(i.realized_amount), 0);

    const totalBelanjaBudget    = belanjaItems.reduce((acc, i) => acc + Number(i.budgeted_amount), 0);
    const totalBelanjaReal      = belanjaItems.reduce((acc, i) => acc + Number(i.realized_amount), 0);

    const totalPembiayaanBudget = pembiayaanItems.reduce((acc, i) => acc + Number(i.budgeted_amount), 0);
    const totalPembiayaanReal   = pembiayaanItems.reduce((acc, i) => acc + Number(i.realized_amount), 0);

    const pendapatanPercent = totalPendapatanBudget > 0
        ? Math.round((totalPendapatanReal / totalPendapatanBudget) * 100)
        : 0;

    const belanjaPercent = totalBelanjaBudget > 0
        ? Math.round((totalBelanjaReal / totalBelanjaBudget) * 100)
        : 0;

    const chartData = [
        {
            name: 'Pendapatan',
            Anggaran: Math.round(totalPendapatanBudget / 1e6),
            Realisasi: Math.round(totalPendapatanReal / 1e6),
        },
        {
            name: 'Belanja',
            Anggaran: Math.round(totalBelanjaBudget / 1e6),
            Realisasi: Math.round(totalBelanjaReal / 1e6),
        },
        {
            name: 'Pembiayaan',
            Anggaran: Math.round(totalPembiayaanBudget / 1e6),
            Realisasi: Math.round(totalPembiayaanReal / 1e6),
        },
    ];

    const handleYearChange = (year: number | string) => {
        router.get('/apbdes', { year });
    };

    return (
        <PublicLayout>
            <Head title={`Transparansi APBDes ${selectedYear} — Desa Tlangoh`} />

            {/* Header Hero */}
            <div className="bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center space-y-4">
                    <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Akuntabilitas & Keterbukaan Informasi Publik
                    </span>
                    <h1 className="text-3xl sm:text-5xl font-extrabold font-serif tracking-tight">
                        Transparansi APBDes {selectedYear}
                    </h1>
                    <p className="text-emerald-100/80 text-sm sm:text-base max-w-2xl mx-auto">
                        Laporan Anggaran Pendapatan dan Belanja Desa (APBDes) Pemerintah Desa Tlangoh sebagai wujud tata kelola pemerintahan yang bersih dan akuntabel.
                    </p>

                    {/* Year Selector */}
                    {years.length > 0 && (
                        <div className="pt-4 flex items-center justify-center gap-2">
                            <span className="text-xs text-emerald-200">Pilih Tahun Anggaran:</span>
                            <div className="flex gap-1.5 bg-emerald-900/60 p-1 rounded-xl border border-emerald-700/50 backdrop-blur-xs">
                                {years.map((y) => (
                                    <button
                                        key={y}
                                        onClick={() => handleYearChange(y)}
                                        className={cn(
                                            'px-3 py-1 rounded-lg text-xs font-bold transition',
                                            Number(selectedYear) === y
                                                ? 'bg-emerald-500 text-white shadow-xs'
                                                : 'text-emerald-200 hover:text-white'
                                        )}
                                    >
                                        {y}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
                {/* Highlight Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Pendapatan Card */}
                    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs relative overflow-hidden space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-lg">
                                Pendapatan Desa
                            </span>
                            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <ArrowUpRight className="w-5 h-5" />
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-slate-400">Total Anggaran</div>
                            <div className="text-2xl font-black text-slate-900 font-serif">
                                {formatRupiah(totalPendapatanBudget)}
                            </div>
                        </div>
                        <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
                            <span className="text-slate-500">
                                Realisasi: <strong className="text-slate-800">{formatRupiah(totalPendapatanReal)}</strong>
                            </span>
                            <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                {pendapatanPercent}%
                            </span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div
                                className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(pendapatanPercent, 100)}%` }}
                            />
                        </div>
                    </div>

                    {/* Belanja Card */}
                    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs relative overflow-hidden space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider bg-amber-50 px-2.5 py-1 rounded-lg">
                                Belanja Desa
                            </span>
                            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                                <ArrowDownRight className="w-5 h-5" />
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-slate-400">Total Anggaran</div>
                            <div className="text-2xl font-black text-slate-900 font-serif">
                                {formatRupiah(totalBelanjaBudget)}
                            </div>
                        </div>
                        <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
                            <span className="text-slate-500">
                                Realisasi: <strong className="text-slate-800">{formatRupiah(totalBelanjaReal)}</strong>
                            </span>
                            <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                                {belanjaPercent}%
                            </span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div
                                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(belanjaPercent, 100)}%` }}
                            />
                        </div>
                    </div>

                    {/* Pembiayaan Card */}
                    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs relative overflow-hidden space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-lg">
                                Pembiayaan Netto
                            </span>
                            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <PiggyBank className="w-5 h-5" />
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-slate-400">Total Anggaran</div>
                            <div className="text-2xl font-black text-slate-900 font-serif">
                                {formatRupiah(totalPembiayaanBudget)}
                            </div>
                        </div>
                        <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
                            <span className="text-slate-500">
                                Realisasi: <strong className="text-slate-800">{formatRupiah(totalPembiayaanReal)}</strong>
                            </span>
                            <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                                {totalPembiayaanBudget > 0 ? Math.round((totalPembiayaanReal / totalPembiayaanBudget) * 100) : 0}%
                            </span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div
                                className="bg-blue-500 h-full rounded-full transition-all duration-500"
                                style={{
                                    width: `${Math.min(totalPembiayaanBudget > 0 ? Math.round((totalPembiayaanReal / totalPembiayaanBudget) * 100) : 0, 100)}%`
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Graphic Visualizer */}
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 font-serif">
                                Perbandingan Anggaran vs Realisasi (Juta Rupiah)
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Visualisasi pencapaian realisasi program kerja APBDes Tahun Anggaran {selectedYear}.
                            </p>
                        </div>
                    </div>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                                <YAxis stroke="#64748b" fontSize={12} unit=" Jt" />
                                <Tooltip
                                    formatter={(value: any) => [`Rp ${value} Juta`, '']}
                                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend />
                                <Bar dataKey="Anggaran" fill="#0f766e" radius={[6, 6, 0, 0]} />
                                <Bar dataKey="Realisasi" fill="#10b981" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Breakdown Tables */}
                <div className="space-y-8">
                    {/* Pendapatan Table */}
                    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                                Rincian Pendapatan Desa
                            </h3>
                            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                                {pendapatanItems.length} Pos Anggaran
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/75 text-xs font-semibold text-slate-600">
                                        <th className="py-3.5 px-6">Kategori / Pos</th>
                                        <th className="py-3.5 px-6">Uraian Keterangan</th>
                                        <th className="py-3.5 px-6 text-right">Anggaran</th>
                                        <th className="py-3.5 px-6 text-right">Realisasi</th>
                                        <th className="py-3.5 px-6 text-right">%</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {pendapatanItems.map((item) => {
                                        const pct = Number(item.budgeted_amount) > 0
                                            ? Math.round((Number(item.realized_amount) / Number(item.budgeted_amount)) * 100)
                                            : 0;
                                        return (
                                            <tr key={item.id} className="hover:bg-slate-50/50">
                                                <td className="py-3.5 px-6 font-semibold text-slate-800 text-xs">
                                                    {item.category}
                                                </td>
                                                <td className="py-3.5 px-6 text-slate-600 text-xs">
                                                    {item.description}
                                                </td>
                                                <td className="py-3.5 px-6 text-right font-medium text-slate-800 text-xs">
                                                    {formatRupiah(item.budgeted_amount)}
                                                </td>
                                                <td className="py-3.5 px-6 text-right font-medium text-emerald-700 text-xs">
                                                    {formatRupiah(item.realized_amount)}
                                                </td>
                                                <td className="py-3.5 px-6 text-right text-xs font-bold text-slate-700">
                                                    {pct}%
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Belanja Table */}
                    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                                Rincian Belanja Desa
                            </h3>
                            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg">
                                {belanjaItems.length} Pos Anggaran
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/75 text-xs font-semibold text-slate-600">
                                        <th className="py-3.5 px-6">Bidang Belanja</th>
                                        <th className="py-3.5 px-6">Uraian Kegiatan</th>
                                        <th className="py-3.5 px-6 text-right">Anggaran</th>
                                        <th className="py-3.5 px-6 text-right">Realisasi</th>
                                        <th className="py-3.5 px-6 text-right">%</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {belanjaItems.map((item) => {
                                        const pct = Number(item.budgeted_amount) > 0
                                            ? Math.round((Number(item.realized_amount) / Number(item.budgeted_amount)) * 100)
                                            : 0;
                                        return (
                                            <tr key={item.id} className="hover:bg-slate-50/50">
                                                <td className="py-3.5 px-6 font-semibold text-slate-800 text-xs">
                                                    {item.category}
                                                </td>
                                                <td className="py-3.5 px-6 text-slate-600 text-xs">
                                                    {item.description}
                                                </td>
                                                <td className="py-3.5 px-6 text-right font-medium text-slate-800 text-xs">
                                                    {formatRupiah(item.budgeted_amount)}
                                                </td>
                                                <td className="py-3.5 px-6 text-right font-medium text-amber-700 text-xs">
                                                    {formatRupiah(item.realized_amount)}
                                                </td>
                                                <td className="py-3.5 px-6 text-right text-xs font-bold text-slate-700">
                                                    {pct}%
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
