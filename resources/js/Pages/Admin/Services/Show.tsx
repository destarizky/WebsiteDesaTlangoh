import { Head, useForm, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    ArrowLeft, CheckCircle2, XCircle, Loader2, FileText, User,
    Clock, ShieldAlert, Save, RefreshCw, AlertCircle
} from 'lucide-react';
import { cn, getStatusColor, getStatusLabel, formatDateTime } from '@/lib/utils';
import { useState } from 'react';

interface ServiceRequest {
    id: number;
    ticket_number: string;
    requester_name: string;
    requester_nik: string;
    requester_phone: string | null;
    requester_address: string;
    letter_type: string;
    purpose: string;
    attachment: string | null;
    status: 'pending' | 'processing' | 'approved' | 'rejected' | string;
    admin_notes: string | null;
    created_at: string;
    processed_at: string | null;
    processor?: { name: string };
}

interface Props {
    serviceRequest: ServiceRequest;
}

const letterTypeLabels: Record<string, string> = {
    surat_keterangan_domisili:    'Surat Keterangan Domisili',
    surat_keterangan_tidak_mampu: 'Surat Keterangan Tidak Mampu',
    surat_keterangan_usaha:       'Surat Keterangan Usaha',
    surat_pengantar_nikah:        'Surat Pengantar Nikah',
    surat_keterangan_kelahiran:   'Surat Keterangan Kelahiran',
    surat_keterangan_kematian:    'Surat Keterangan Kematian',
    surat_keterangan_lainnya:     'Surat Keterangan Lainnya',
};

const statusOptions = [
    {
        value: 'pending',
        label: 'Menunggu Review',
        description: 'Permohonan baru masuk, menunggu verifikasi berkas oleh petugas.',
        color: 'border-amber-200 bg-amber-50 text-amber-900',
        activeRing: 'ring-2 ring-amber-500 border-amber-500',
        badge: 'bg-amber-100 text-amber-800',
        icon: Clock,
    },
    {
        value: 'processing',
        label: 'Sedang Diproses',
        description: 'Berkas lengkap, surat sedang dibuat atau diajukan penandatanganan.',
        color: 'border-blue-200 bg-blue-50 text-blue-900',
        activeRing: 'ring-2 ring-blue-500 border-blue-500',
        badge: 'bg-blue-100 text-blue-800',
        icon: Loader2,
    },
    {
        value: 'approved',
        label: 'Disetujui / Selesai',
        description: 'Surat resmi telah diterbitkan dan siap diambil oleh warga.',
        color: 'border-emerald-200 bg-emerald-50 text-emerald-900',
        activeRing: 'ring-2 ring-emerald-500 border-emerald-500',
        badge: 'bg-emerald-100 text-emerald-800',
        icon: CheckCircle2,
    },
    {
        value: 'rejected',
        label: 'Ditolak',
        description: 'Permohonan belum memenuhi syarat atau dokumen tidak sesuai.',
        color: 'border-red-200 bg-red-50 text-red-900',
        activeRing: 'ring-2 ring-red-500 border-red-500',
        badge: 'bg-red-100 text-red-800',
        icon: XCircle,
    },
];

export default function AdminServicesShow({ serviceRequest }: Props) {
    const { data, setData, patch, processing } = useForm({
        status: serviceRequest.status || 'pending',
        admin_notes: serviceRequest.admin_notes || '',
    });

    const handleQuickStatus = (targetStatus: string) => {
        setData('status', targetStatus);
        router.patch(`/admin/surat/${serviceRequest.id}/status`, {
            status: targetStatus,
            admin_notes: data.admin_notes,
        }, {
            preserveScroll: true,
        });
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/admin/surat/${serviceRequest.id}/status`, {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout title="Detail Pengajuan Surat">
            <Head title={`Surat ${serviceRequest.ticket_number} — Admin Desa Tlangoh`} />

            <div className="max-w-4xl space-y-6">
                {/* Back button */}
                <div className="flex items-center justify-between">
                    <Link
                        href="/admin/surat"
                        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Surat
                    </Link>

                    <div className="text-xs text-slate-400">
                        ID Tiket: <span className="font-mono font-semibold text-slate-600">{serviceRequest.ticket_number}</span>
                    </div>
                </div>

                {/* Header Card */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <FileText className="w-5 h-5 text-emerald-600" />
                                <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
                                    {serviceRequest.ticket_number}
                                </span>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                                {letterTypeLabels[serviceRequest.letter_type] ?? serviceRequest.letter_type}
                            </h2>
                            <div className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                Diajukan pada {formatDateTime(serviceRequest.created_at)}
                            </div>
                        </div>

                        <div className="flex flex-col sm:items-end gap-1.5">
                            <span className="text-xs text-slate-400 font-medium">Status Saat Ini:</span>
                            <span className={cn('px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-xl border shadow-2xs', getStatusColor(serviceRequest.status))}>
                                {getStatusLabel(serviceRequest.status)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Status Management Box (Can be edited multiple times anytime) */}
                <div className="bg-white rounded-2xl border-2 border-emerald-500/20 shadow-sm p-6 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                        <div>
                            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                <RefreshCw className="w-4 h-4 text-emerald-600" />
                                Kelola & Perbarui Tahapan Status
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Status permohonan dapat diubah berkali-kali sesuai perkembangan proses verifikasi.
                            </p>
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200 shrink-0">
                            Bisa Diubah Kapan Saja
                        </span>
                    </div>

                    <form onSubmit={handleFormSubmit} className="space-y-6">
                        {/* Status Option Grid */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
                                Pilih Tahapan Status Permohonan:
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {statusOptions.map((opt) => {
                                    const Icon = opt.icon;
                                    const isSelected = data.status === opt.value;
                                    const isCurrent = serviceRequest.status === opt.value;

                                    return (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => setData('status', opt.value)}
                                            className={cn(
                                                'p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between group',
                                                isSelected
                                                    ? `${opt.activeRing} ${opt.color} shadow-2xs`
                                                    : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/80 text-slate-700'
                                            )}
                                        >
                                            <div className="flex items-center justify-between mb-1.5">
                                                <div className="flex items-center gap-2">
                                                    <Icon className={cn('w-4 h-4', isSelected ? 'text-current' : 'text-slate-500')} />
                                                    <span className="font-bold text-sm">{opt.label}</span>
                                                </div>
                                                {isCurrent && (
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-white">
                                                        Aktif
                                                    </span>
                                                )}
                                            </div>
                                            <p className={cn('text-xs leading-relaxed', isSelected ? 'text-current opacity-90' : 'text-slate-500')}>
                                                {opt.description}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Admin Notes Field */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                                Catatan Petugas / Keterangan untuk Pemohon:
                            </label>
                            <textarea
                                rows={3}
                                value={data.admin_notes}
                                onChange={(e) => setData('admin_notes', e.target.value)}
                                placeholder="Contoh: Berkas telah diverifikasi, silakan membawa KTP asli saat mengambil surat di Balai Desa pada jam kerja..."
                                className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white resize-none"
                            />
                            <p className="text-[11px] text-slate-400 mt-1.5">
                                Catatan ini akan terbaca oleh pemohon saat mengecek nomor tiket layanan.
                            </p>
                        </div>

                        {/* Submit Button */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                            <div className="text-xs text-slate-500">
                                {serviceRequest.processed_at && (
                                    <span>
                                        Terakhir diproses oleh <strong>{serviceRequest.processor?.name ?? 'Petugas'}</strong> ({formatDateTime(serviceRequest.processed_at)})
                                    </span>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-all disabled:opacity-60"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Menyimpan Perubahan...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        <span>Simpan Perubahan Status</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Requester Info Card */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4">
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2 text-base">
                        <User className="w-4 h-4 text-emerald-600" /> Data Pemohon & Berkas
                    </h3>

                    <div className="grid sm:grid-cols-2 gap-4 pt-2">
                        {[
                            { label: 'Nama Lengkap',  value: serviceRequest.requester_name },
                            { label: 'NIK Pemohon',    value: serviceRequest.requester_nik },
                            { label: 'Nomor WhatsApp', value: serviceRequest.requester_phone ?? '-' },
                            { label: 'Alamat Tinggal', value: serviceRequest.requester_address },
                        ].map(({ label, value }) => (
                            <div key={label} className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                    {label}
                                </div>
                                <div className="text-sm text-slate-900 font-medium">{value}</div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-2">
                        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                            Keperluan Surat
                        </div>
                        <p className="text-sm text-slate-800 bg-slate-50 p-3.5 rounded-xl border border-slate-100 leading-relaxed">
                            {serviceRequest.purpose}
                        </p>
                    </div>

                    {serviceRequest.attachment && (
                        <div className="pt-2">
                            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                                Berkas Lampiran Pendukung
                            </div>
                            <a
                                href={`/storage/${serviceRequest.attachment}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-xl border border-blue-200 transition-colors"
                            >
                                <FileText className="w-4 h-4" />
                                <span>Buka / Unduh Berkas Lampiran (KTP/KK)</span>
                            </a>
                        </div>
                    )}
                </div>

                {/* Display Current Admin Notes if exist */}
                {serviceRequest.admin_notes && (
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                        <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5 text-emerald-600" /> Catatan Petugas Saat Ini
                        </div>
                        <p className="text-sm text-slate-800 leading-relaxed">{serviceRequest.admin_notes}</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
