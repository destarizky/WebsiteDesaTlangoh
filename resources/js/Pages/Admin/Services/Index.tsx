import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Search, Eye, CheckCircle2, XCircle, Loader2, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn, getStatusColor, getStatusLabel, formatDateTime } from '@/lib/utils';
import { useState } from 'react';

interface ServiceRequest {
    id: number;
    ticket_number: string;
    requester_name: string;
    requester_nik: string;
    letter_type: string;
    status: string;
    created_at: string;
}

interface Paginated<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    requests: Paginated<ServiceRequest>;
    filters: { status?: string; search?: string };
}

const letterTypeLabels: Record<string, string> = {
    surat_keterangan_domisili:    'Sk. Domisili',
    surat_keterangan_tidak_mampu: 'Sk. Tidak Mampu',
    surat_keterangan_usaha:       'Sk. Usaha',
    surat_pengantar_nikah:        'Sk. Nikah',
    surat_keterangan_kelahiran:   'Sk. Kelahiran',
    surat_keterangan_kematian:    'Sk. Kematian',
    surat_keterangan_lainnya:     'Sk. Lainnya',
};

export default function AdminServicesIndex({ requests, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus]   = useState(filters.status ?? '');

    const applyFilters = () => {
        router.get('/admin/surat', { search, status }, { preserveState: true });
    };

    return (
        <AdminLayout title="Manajemen Persuratan">
            <Head title="Manajemen Surat — Admin Desa Tlangoh" />

            <div className="space-y-5">
                {/* Filters */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari nama, NIK, atau tiket..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                        />
                    </div>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 bg-white"
                    >
                        <option value="">Semua Status</option>
                        <option value="pending">Menunggu</option>
                        <option value="processing">Diproses</option>
                        <option value="approved">Disetujui</option>
                        <option value="rejected">Ditolak</option>
                    </select>
                    <button
                        onClick={applyFilters}
                        className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                </div>

                {/* Stats bar */}
                <div className="text-sm text-slate-500">
                    Menampilkan <strong>{requests.data.length}</strong> dari <strong>{requests.total}</strong> pengajuan
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Tiket</th>
                                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Pemohon</th>
                                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Jenis Surat</th>
                                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Waktu</th>
                                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {requests.data.length > 0 ? requests.data.map((req) => (
                                    <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-5 py-4">
                                            <span className="font-mono text-xs font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded">
                                                {req.ticket_number}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="font-medium text-sm text-slate-900">{req.requester_name}</div>
                                            <div className="text-xs text-slate-400 font-mono">{req.requester_nik}</div>
                                        </td>
                                        <td className="px-5 py-4 text-sm text-slate-600">
                                            {letterTypeLabels[req.letter_type] ?? req.letter_type}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={cn('px-2.5 py-1 text-xs font-medium rounded-full border', getStatusColor(req.status))}>
                                                {getStatusLabel(req.status)}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-xs text-slate-400">{formatDateTime(req.created_at)}</td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/admin/surat/${req.id}`}
                                                    className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                                    title="Lihat detail"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                {req.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => router.patch(`/admin/surat/${req.id}/process`)}
                                                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                                            title="Proses"
                                                        >
                                                            <Loader2 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => router.patch(`/admin/surat/${req.id}/approve`)}
                                                            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                                                            title="Setujui"
                                                        >
                                                            <CheckCircle2 className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-12 text-center text-slate-400 text-sm">
                                            Tidak ada pengajuan surat ditemukan
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {requests.last_page > 1 && (
                        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100">
                            <div className="text-sm text-slate-500">
                                Halaman {requests.current_page} dari {requests.last_page}
                            </div>
                            <div className="flex gap-1">
                                {requests.links.map((link, i) => (
                                    link.url ? (
                                        <Link
                                            key={i}
                                            href={link.url}
                                            className={cn(
                                                'px-3 py-1.5 text-sm rounded-lg transition-colors',
                                                link.active
                                                    ? 'bg-emerald-600 text-white font-medium'
                                                    : 'text-slate-600 hover:bg-slate-100'
                                            )}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span key={i} className="px-3 py-1.5 text-sm text-slate-300" dangerouslySetInnerHTML={{ __html: link.label }} />
                                    )
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
