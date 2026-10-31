import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    ArrowLeft, CheckCircle2, AlertCircle, MessageSquare, Clock,
    MapPin, User, Phone, FileText, Send, ShieldAlert, Image as ImageIcon
} from 'lucide-react';
import { cn, getStatusColor, getStatusLabel, formatDateTime } from '@/lib/utils';

interface Complaint {
    id: number;
    ticket_number: string;
    reporter_name: string | null;
    reporter_phone: string | null;
    category: string;
    subject: string;
    description: string;
    location: string | null;
    attachment: string | null;
    status: string;
    is_anonymous: boolean;
    admin_response: string | null;
    handled_by: number | null;
    resolved_at: string | null;
    created_at: string;
    handler?: {
        id: number;
        name: string;
    };
}

interface Props {
    complaint: Complaint;
}

export default function AdminComplaintsShow({ complaint }: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        admin_response: complaint.admin_response || '',
        status: complaint.status || 'in_progress',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/admin/pengaduan/${complaint.id}/respond`, {
            preserveScroll: true,
        });
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
        <AdminLayout title={`Detail Pengaduan #${complaint.ticket_number}`}>
            <Head title={`Pengaduan ${complaint.ticket_number} — Admin Desa Tlangoh`} />

            <div className="space-y-6 max-w-5xl">
                {/* Header Navigation */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/pengaduan"
                            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition shadow-xs"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2.5">
                                <h2 className="text-xl font-bold text-slate-900 font-serif">
                                    Pengaduan #{complaint.ticket_number}
                                </h2>
                                <span
                                    className={cn(
                                        'px-2.5 py-0.5 rounded-full text-xs font-medium border',
                                        getStatusColor(complaint.status)
                                    )}
                                >
                                    {getStatusLabel(complaint.status)}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Diterima pada {formatDateTime(complaint.created_at)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Details (2 cols) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Complaint Content Card */}
                        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
                            <div>
                                <span className="inline-block text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg uppercase tracking-wider mb-2">
                                    {categoryLabels[complaint.category] || complaint.category}
                                </span>
                                <h3 className="text-xl font-bold text-slate-900">
                                    {complaint.subject}
                                </h3>
                            </div>

                            <div className="border-t border-slate-100 pt-4">
                                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                    Deskripsi Laporan
                                </h4>
                                <div className="text-slate-700 leading-relaxed whitespace-pre-line text-sm bg-slate-50/60 p-4 rounded-xl border border-slate-100">
                                    {complaint.description}
                                </div>
                            </div>

                            {complaint.location && (
                                <div className="flex items-start gap-2.5 text-sm text-slate-600 bg-amber-50/50 border border-amber-100 p-3.5 rounded-xl">
                                    <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                    <div>
                                        <span className="font-semibold text-slate-700 text-xs uppercase tracking-wider block">
                                            Lokasi Kejadian:
                                        </span>
                                        <span className="text-slate-800">{complaint.location}</span>
                                    </div>
                                </div>
                            )}

                            {complaint.attachment && (
                                <div className="border-t border-slate-100 pt-4">
                                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                        Lampiran / Foto Bukti
                                    </h4>
                                    <a
                                        href={`/storage/${complaint.attachment}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition group"
                                    >
                                        <ImageIcon className="w-5 h-5 text-emerald-600 group-hover:scale-105 transition" />
                                        <span className="text-sm font-medium text-slate-700 underline underline-offset-2">
                                            Lihat Bukti Foto / Dokumen
                                        </span>
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Admin Response Form */}
                        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                            <div className="flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-emerald-600" />
                                <h3 className="font-bold text-slate-900 text-base">
                                    Tanggapan & Status Penanganan
                                </h3>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Perbarui Status Pengaduan
                                    </label>
                                    <select
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                    >
                                        <option value="reviewed">Ditinjau (Sedang diverifikasi tim desa)</option>
                                        <option value="in_progress">Sedang Ditangani (Sedang dalam proses tindak lanjut)</option>
                                        <option value="resolved">Selesai (Sudah dituntaskan oleh pihak terkait)</option>
                                        <option value="closed">Ditutup (Tidak memerlukan tindak lanjut lebih jauh)</option>
                                    </select>
                                    {errors.status && (
                                        <p className="text-xs text-red-500 mt-1">{errors.status}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Catatan / Tanggapan Resmi Pemerintah Desa
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={data.admin_response}
                                        onChange={(e) => setData('admin_response', e.target.value)}
                                        placeholder="Tuliskan tindak lanjut, keterangan perbaikan, atau klarifikasi untuk pelapor..."
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                                    />
                                    {errors.admin_response && (
                                        <p className="text-xs text-red-500 mt-1">{errors.admin_response}</p>
                                    )}
                                </div>

                                <div className="flex justify-end pt-2">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition shadow-xs disabled:opacity-50"
                                    >
                                        <Send className="w-4 h-4" />
                                        {processing ? 'Menyimpan...' : 'Simpan Tanggapan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Sidebar Information (1 col) */}
                    <div className="space-y-6">
                        {/* Reporter Card */}
                        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
                            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
                                <User className="w-4 h-4 text-emerald-600" />
                                Informasi Pelapor
                            </h3>

                            {complaint.is_anonymous ? (
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs text-slate-600 space-y-1">
                                    <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                                        <ShieldAlert className="w-4 h-4 text-amber-600" />
                                        Laporan Anonim
                                    </span>
                                    <p className="text-slate-500">
                                        Pelapor memilih untuk menyembunyikan identitas pribadinya demi privasi dan keamanan.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3 text-xs">
                                    <div>
                                        <span className="text-slate-400 block mb-0.5">Nama Lengkap</span>
                                        <span className="font-semibold text-slate-800 text-sm">
                                            {complaint.reporter_name || 'Tidak dicantumkan'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block mb-0.5">Nomor WhatsApp / HP</span>
                                        {complaint.reporter_phone ? (
                                            <a
                                                href={`https://wa.me/${complaint.reporter_phone.replace(/^0/, '62')}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-emerald-700 font-medium hover:underline inline-flex items-center gap-1"
                                            >
                                                <Phone className="w-3.5 h-3.5" />
                                                {complaint.reporter_phone}
                                            </a>
                                        ) : (
                                            <span className="text-slate-500">-</span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Handled By Info */}
                        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
                            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-emerald-600" />
                                Riwayat Penanganan
                            </h3>

                            <div className="space-y-2.5 text-xs text-slate-600">
                                <div className="flex justify-between py-1 border-b border-slate-50">
                                    <span className="text-slate-400">Petugas Penanggung Jawab</span>
                                    <span className="font-medium text-slate-800">
                                        {complaint.handler?.name || (complaint.handled_by ? 'Petugas Desa' : 'Belum Ditugaskan')}
                                    </span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-slate-50">
                                    <span className="text-slate-400">Waktu Masuk</span>
                                    <span className="font-medium text-slate-800">
                                        {formatDateTime(complaint.created_at)}
                                    </span>
                                </div>
                                {complaint.resolved_at && (
                                    <div className="flex justify-between py-1">
                                        <span className="text-slate-400">Waktu Selesai</span>
                                        <span className="font-medium text-emerald-700">
                                            {formatDateTime(complaint.resolved_at)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
