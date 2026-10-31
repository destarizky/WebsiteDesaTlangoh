import { Head, useForm, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { cn, formatRupiah } from '@/lib/utils';
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ApbdesItem {
    id: number;
    category: string;
    type: string;
    description: string;
    budgeted_amount: number;
    realized_amount: number;
    notes: string | null;
}

interface Summary {
    pendapatan: { budgeted: number; realized: number };
    belanja: { budgeted: number; realized: number };
    pembiayaan: { budgeted: number; realized: number };
}

interface Props {
    data: ApbdesItem[];
    years: number[];
    selectedYear: number;
    summary: Summary;
}

export default function AdminApbdesIndex({ data, years, selectedYear, summary }: Props) {
    const [showForm, setShowForm] = useState(false);
    const [editItem, setEditItem] = useState<ApbdesItem | null>(null);

    const { data: form, setData, post, put, reset, processing, errors } = useForm({
        year:             selectedYear,
        month:            '',
        category:         '',
        type:             'pendapatan' as 'pendapatan' | 'belanja' | 'pembiayaan',
        description:      '',
        budgeted_amount:  '',
        realized_amount:  '',
        notes:            '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editItem) {
            put(`/admin/apbdes/${editItem.id}`, {
                onSuccess: () => { setShowForm(false); setEditItem(null); reset(); },
            });
        } else {
            post('/admin/apbdes', {
                onSuccess: () => { setShowForm(false); reset(); },
            });
        }
    };

    const handleEdit = (item: ApbdesItem) => {
        setEditItem(item);
        setData({
            year:            selectedYear,
            month:           '',
            category:        item.category,
            type:            item.type as 'pendapatan' | 'belanja' | 'pembiayaan',
            description:     item.description,
            budgeted_amount: String(item.budgeted_amount),
            realized_amount: String(item.realized_amount),
            notes:           item.notes ?? '',
        });
        setShowForm(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Hapus data ini?')) router.delete(`/admin/apbdes/${id}`);
    };

    const typeColors: Record<string, string> = {
        pendapatan:  'text-emerald-700 bg-emerald-50 border-emerald-100',
        belanja:     'text-rose-700 bg-rose-50 border-rose-100',
        pembiayaan:  'text-blue-700 bg-blue-50 border-blue-100',
    };

    const chartData = [
        { name: 'Pendapatan', Anggaran: summary.pendapatan.budgeted / 1e6, Realisasi: summary.pendapatan.realized / 1e6 },
        { name: 'Belanja',    Anggaran: summary.belanja.budgeted / 1e6,    Realisasi: summary.belanja.realized / 1e6 },
        { name: 'Pembiayaan', Anggaran: summary.pembiayaan.budgeted / 1e6, Realisasi: summary.pembiayaan.realized / 1e6 },
    ];

    const inputClass = 'w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 bg-white';

    return (
        <AdminLayout title={`Transparansi APBDes ${selectedYear}`}>
            <Head title="APBDes — Admin" />

            <div className="space-y-6">
                {/* Year Selector + Add button */}
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-slate-700">Tahun:</label>
                        <select
                            value={selectedYear}
                            onChange={(e) => router.get('/admin/apbdes', { year: e.target.value })}
                            className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none"
                        >
                            {years.map((y) => <option key={y} value={y}>{y}</option>)}
                            <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
                        </select>
                    </div>
                    <button
                        onClick={() => { setShowForm(!showForm); setEditItem(null); reset(); }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg"
                    >
                        <Plus className="w-4 h-4" /> Tambah Data APBDes
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="grid sm:grid-cols-3 gap-4">
                    {[
                        { label: 'Total Pendapatan', sum: summary.pendapatan, color: 'emerald' },
                        { label: 'Total Belanja',    sum: summary.belanja,    color: 'rose' },
                        { label: 'Pembiayaan',       sum: summary.pembiayaan, color: 'blue' },
                    ].map(({ label, sum, color }) => (
                        <div key={label} className="bg-white rounded-xl border border-slate-200 p-5">
                            <div className="text-sm text-slate-500 mb-1">{label}</div>
                            <div className="text-xl font-bold text-slate-900">{formatRupiah(sum.budgeted)}</div>
                            <div className="text-xs text-slate-400 mt-1">Realisasi: {formatRupiah(sum.realized)}</div>
                            <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className={cn('h-full rounded-full', color === 'emerald' ? 'bg-emerald-500' : color === 'rose' ? 'bg-rose-500' : 'bg-blue-500')}
                                    style={{ width: `${sum.budgeted > 0 ? Math.min((sum.realized / sum.budgeted) * 100, 100) : 0}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Chart */}
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <h3 className="font-semibold text-slate-900 mb-4">Grafik Anggaran vs Realisasi (Juta Rp)</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={chartData} barGap={8}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                            <Tooltip formatter={(v: number) => [`Rp ${v.toFixed(1)} Juta`, '']} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                            <Legend wrapperStyle={{ fontSize: 12 }} />
                            <Bar dataKey="Anggaran" fill="#10b981" radius={[4,4,0,0]} opacity={0.5} />
                            <Bar dataKey="Realisasi" fill="#10b981" radius={[4,4,0,0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Form */}
                {showForm && (
                    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-emerald-200 p-6 space-y-4">
                        <h3 className="font-semibold text-slate-900">{editItem ? 'Edit Data APBDes' : 'Tambah Data APBDes'}</h3>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Tipe</label>
                                <select value={form.type} onChange={(e) => setData('type', e.target.value as any)} className={inputClass}>
                                    <option value="pendapatan">Pendapatan</option>
                                    <option value="belanja">Belanja</option>
                                    <option value="pembiayaan">Pembiayaan</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Kategori</label>
                                <input type="text" value={form.category} onChange={(e) => setData('category', e.target.value)} placeholder="cth: Dana Desa" className={inputClass} required />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Keterangan</label>
                                <input type="text" value={form.description} onChange={(e) => setData('description', e.target.value)} className={inputClass} required />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Anggaran (Rp)</label>
                                <input type="number" value={form.budgeted_amount} onChange={(e) => setData('budgeted_amount', e.target.value)} className={inputClass} min={0} required />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Realisasi (Rp)</label>
                                <input type="number" value={form.realized_amount} onChange={(e) => setData('realized_amount', e.target.value)} className={inputClass} min={0} required />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Catatan</label>
                                <input type="text" value={form.notes} onChange={(e) => setData('notes', e.target.value)} className={inputClass} />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button type="submit" disabled={processing} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg">
                                {processing ? 'Menyimpan...' : editItem ? 'Simpan Perubahan' : 'Tambahkan'}
                            </button>
                            <button type="button" onClick={() => { setShowForm(false); setEditItem(null); reset(); }} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm rounded-lg">
                                Batal
                            </button>
                        </div>
                    </form>
                )}

                {/* Data Table */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                {['Tipe', 'Kategori', 'Keterangan', 'Anggaran', 'Realisasi', '%', 'Aksi'].map((h) => (
                                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {data.map((item) => {
                                const pct = item.budgeted_amount > 0 ? ((item.realized_amount / item.budgeted_amount) * 100).toFixed(1) : '0';
                                return (
                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <span className={cn('px-2 py-0.5 text-xs font-medium rounded-full border capitalize', typeColors[item.type])}>
                                                {item.type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-700">{item.category}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600">{item.description}</td>
                                        <td className="px-4 py-3 text-sm font-medium text-slate-900">{formatRupiah(item.budgeted_amount)}</td>
                                        <td className="px-4 py-3 text-sm font-medium text-slate-900">{formatRupiah(item.realized_amount)}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(Number(pct), 100)}%` }} />
                                                </div>
                                                <span className="text-xs text-slate-500">{pct}%</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-1">
                                                <button onClick={() => handleEdit(item)} className="p-1.5 rounded text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors">
                                                    <Pencil className="w-3.5 h-3.5" />
                                                </button>
                                                <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {data.length === 0 && (
                                <tr><td colSpan={7} className="px-4 py-10 text-center text-slate-400 text-sm">Belum ada data APBDes untuk tahun {selectedYear}.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
