import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Search, Eye, Filter, MessageSquareWarning, ChevronLeft, ChevronRight, CheckCircle2, Clock } from 'lucide-react';
import { cn, getStatusColor, getStatusLabel, formatDateTime } from '@/lib/utils';
import { useState } from 'react';

interface Complaint {
    id: number;
    ticket_number: string;
    reporter_name: string | null;
    reporter_phone: string | null;
    category: string;
    subject: string;
    description: string;
    location: string | null;
    status: string;
    is_anonymous: boolean;
    created_at: string;
}

interface PaginatedResponse {
    data: Complaint[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    complaints: PaginatedResponse;
    filters: {
        status?: string;
        category?: string;
        search?: string;
    };
}

export default function AdminComplaintsIndex({ complaints, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [category, setCategory] = useState(filters.category || '');

    const handleFilterChange = (newStatus: string, newCategory: string, newSearch: string) => {
        router.get(
            '/admin/pengaduan',
            {
                status: newStatus || undefined,
                category: newCategory || undefined,
                search: newSearch || undefined,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleFilterChange(status, category, search);
    };

    const categoryLabels: Record<string, string> = {
        infrastruktur: 'Infrastruktur & Jalan',
        pelayanan_publik: 'Pelayanan Publik',
        lingkungan: 'Lingkungan & Kebersihan',
        keamanan: 'Keamanan & Ketertiban',
        sosial: 'Masalah Sosial',
        lainnya: 'Lainnya',
    };

    return (
        <AdminLayout title="Kelola Pengaduan Warga">
            <Head title="Pengaduan Warga — Admin Desa Tlangoh" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 font-serif">
                            Pengaduan Warga
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Pantau, verifikasi, dan tindak lanjuti aspirasi atau keluhan dari warga Desa Tlangoh.
                        </p>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                    <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari No. Tiket, nama pelapor, atau perihal..."
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                            />
                        </div>

                        <div className="flex flex-wrap sm:flex-nowrap gap-3">
                            <select
                                value={category}
                                onChange={(e) => {
                                    setCategory(e.target.value);
                                    handleFilterChange(status, e.target.value, search);
                                }}
                                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                            >
                                <option value="">Semua Kategori</option>
                                <option value="infrastruktur">Infrastruktur & Jalan</option>
                                <option value="pelayanan_publik">Pelayanan Publik</option>
                                <option value="lingkungan">Lingkungan & Kebersihan</option>
                                <option value="keamanan">Keamanan & Ketertiban</option>
                                <option value="sosial">Masalah Sosial</option>
                                <option value="lainnya">Lainnya</option>
                            </select>

                            <select
                                value={status}
                                onChange={(e) => {
                                    setStatus(e.target.value);
                                    handleFilterChange(e.target.value, category, search);
                                }}
                                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                            >
                                <option value="">Semua Status</option>
                                <option value="pending">Menunggu</option>
                                <option value="reviewed">Ditinjau</option>
                                <option value="in_progress">Sedang Ditangani</option>
                                <option value="resolved">Selesai</option>
                                <option value="closed">Ditutup</option>
                            </select>

                            <button
                                type="submit"
                                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-sm font-medium transition"
                            >
                                Cari
                            </button>
                        </div>
                    </form>
                </div>

                {/* Table Data */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/75 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                    <th className="py-4 px-6">Tiket & Waktu</th>
                                    <th className="py-4 px-6">Pelapor</th>
                                    <th className="py-4 px-6">Kategori & Perihal</th>
                                    <th className="py-4 px-6">Lokasi</th>
                                    <th className="py-4 px-6">Status</th>
                                    <th className="py-4 px-6 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {complaints.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-slate-500">
                                            <MessageSquareWarning className="mx-auto h-10 w-10 text-slate-300 mb-3" />
                                            <p className="font-medium text-slate-700">Belum ada data pengaduan</p>
                                            <p className="text-xs text-slate-400 mt-1">
                                                Coba sesuaikan kata kunci pencarian atau filter status.
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    complaints.data.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/60 transition">
                                            <td className="py-4 px-6 whitespace-nowrap">
                                                <div className="font-mono font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-xs inline-block mb-1">
                                                    {item.ticket_number}
                                                </div>
                                                <div className="text-xs text-slate-400">
                                                    {formatDateTime(item.created_at)}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                {item.is_anonymous ? (
                                                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                                        Anonim (Rahasia)
                                                    </span>
                                                ) : (
                                                    <div>
                                                        <div className="font-medium text-slate-800">
                                                            {item.reporter_name || 'Warga'}
                                                        </div>
                                                        {item.reporter_phone && (
                                                            <div className="text-xs text-slate-400">
                                                                {item.reporter_phone}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-4 px-6 max-w-xs">
                                                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-0.5">
                                                    {categoryLabels[item.category] || item.category}
                                                </div>
                                                <div className="font-semibold text-slate-800 truncate" title={item.subject}>
                                                    {item.subject}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-slate-600 text-xs">
                                                {item.location || '-'}
                                            </td>
                                            <td className="py-4 px-6 whitespace-nowrap">
                                                <span
                                                    className={cn(
                                                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                                                        getStatusColor(item.status)
                                                    )}
                                                >
                                                    {getStatusLabel(item.status)}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-right whitespace-nowrap">
                                                <Link
                                                    href={`/admin/pengaduan/${item.id}`}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                    Detail
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {complaints.last_page > 1 && (
                        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-xs text-slate-500">
                                Menampilkan <span className="font-semibold text-slate-700">{complaints.from || 0}</span> sampai{' '}
                                <span className="font-semibold text-slate-700">{complaints.to || 0}</span> dari{' '}
                                <span className="font-semibold text-slate-700">{complaints.total}</span> data
                            </p>
                            <div className="flex items-center gap-1.5">
                                {complaints.links.map((link, idx) => {
                                    if (link.label.includes('&laquo;') || link.label.includes('Previous')) {
                                        return (
                                            <Link
                                                key={idx}
                                                href={link.url || '#'}
                                                className={cn(
                                                    'p-2 rounded-lg border text-xs font-medium flex items-center justify-center transition',
                                                    !link.url
                                                        ? 'border-slate-200 text-slate-300 pointer-events-none'
                                                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                                                )}
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                            </Link>
                                        );
                                    }
                                    if (link.label.includes('&raquo;') || link.label.includes('Next')) {
                                        return (
                                            <Link
                                                key={idx}
                                                href={link.url || '#'}
                                                className={cn(
                                                    'p-2 rounded-lg border text-xs font-medium flex items-center justify-center transition',
                                                    !link.url
                                                        ? 'border-slate-200 text-slate-300 pointer-events-none'
                                                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                                                )}
                                            >
                                                <ChevronRight className="w-4 h-4" />
                                            </Link>
                                        );
                                    }
                                    return (
                                        <Link
                                            key={idx}
                                            href={link.url || '#'}
                                            className={cn(
                                                'px-3 py-1.5 rounded-lg border text-xs font-medium transition',
                                                link.active
                                                    ? 'bg-emerald-600 border-emerald-600 text-white font-semibold'
                                                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                                            )}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
