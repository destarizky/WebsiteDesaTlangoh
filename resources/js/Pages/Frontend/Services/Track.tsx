import { Head, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Search, FileText, CheckCircle2, Clock, AlertCircle, XCircle, ArrowRight, User, Calendar, MapPin } from 'lucide-react';
import { cn, formatDateTime, getStatusColor, getStatusLabel } from '@/lib/utils';
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
    status: 'pending' | 'processing' | 'approved' | 'rejected';
    rejection_reason: string | null;
    created_at: string;
    updated_at: string;
}

interface Props {
    serviceRequest: ServiceRequest | null;
    ticket: string | null;
}

export default function TrackServices({ serviceRequest, ticket }: Props) {
    const [searchTicket, setSearchTicket] = useState(ticket || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTicket.trim()) {
            router.get('/layanan-surat/lacak', { ticket: searchTicket.trim() });
        }
    };

    const letterTypeNames: Record<string, string> = {
        surat_keterangan_domisili: 'Surat Keterangan Domisili',
        surat_keterangan_tidak_mampu: 'Surat Keterangan Tidak Mampu (SKTM)',
        surat_keterangan_usaha: 'Surat Keterangan Usaha (SKU)',
        surat_pengantar_nikah: 'Surat Pengantar Nikah (N1-N4)',
        surat_keterangan_kelahiran: 'Surat Keterangan Kelahiran',
        surat_keterangan_kematian: 'Surat Keterangan Kematian',
        surat_keterangan_lainnya: 'Surat Keterangan Lainnya',
    };

    const steps = [
        { key: 'pending', label: 'Pengajuan Diterima', desc: 'Permohonan berhasil dicatat ke sistem' },
        { key: 'processing', label: 'Verifikasi & Diproses', desc: 'Petugas desa memeriksa kelengkapan berkas' },
        { key: 'approved', label: 'Selesai & Siap Diambil', desc: 'Surat telah ditandatangani dan siap diambil' },
    ];

    const getStepStatus = (stepKey: string, currentStatus: string) => {
        if (currentStatus === 'rejected') return 'rejected';
        if (currentStatus === 'approved') return 'completed';
        if (currentStatus === 'processing') {
            if (stepKey === 'pending') return 'completed';
            if (stepKey === 'processing') return 'active';
            return 'upcoming';
        }
        if (currentStatus === 'pending') {
            if (stepKey === 'pending') return 'active';
            return 'upcoming';
        }
        return 'upcoming';
    };

    return (
        <PublicLayout>
            <Head title="Lacak Status Surat — Desa Tlangoh" />

            <div className="bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center space-y-4">
                    <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Transparansi Layanan Publik
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold font-serif tracking-tight">
                        Lacak Status Pengajuan Surat
                    </h1>
                    <p className="text-emerald-100/80 text-sm sm:text-base max-w-xl mx-auto">
                        Masukkan Nomor Tiket yang Anda peroleh saat mengajukan surat untuk melihat progres pengerjaan secara real-time.
                    </p>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="pt-6 max-w-xl mx-auto">
                        <div className="relative flex items-center">
                            <Search className="absolute left-4 h-5 w-5 text-slate-400" />
                            <input
                                type="text"
                                value={searchTicket}
                                onChange={(e) => setSearchTicket(e.target.value)}
                                placeholder="Contoh: SRT-20241003-XXXX"
                                className="w-full pl-12 pr-32 py-3.5 bg-white text-slate-900 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/30 shadow-xl"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition uppercase tracking-wider"
                            >
                                Cari
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {ticket && !serviceRequest ? (
                    <div className="bg-white rounded-3xl border border-slate-200/80 p-10 text-center max-w-xl mx-auto shadow-xs space-y-4">
                        <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
                            <AlertCircle className="w-7 h-7" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Tiket Tidak Ditemukan</h3>
                        <p className="text-sm text-slate-500">
                            Nomor tiket <span className="font-mono font-semibold text-slate-800">{ticket}</span> tidak terdaftar di sistem kami. Mohon pastikan kode tiket yang Anda masukkan sudah benar.
                        </p>
                    </div>
                ) : serviceRequest ? (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        {/* Result Header Card */}
                        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                                <div>
                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        Nomor Tiket Permohonan
                                    </span>
                                    <div className="text-2xl font-bold font-mono text-emerald-800 mt-0.5">
                                        {serviceRequest.ticket_number}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span
                                        className={cn(
                                            'px-3.5 py-1.5 rounded-full text-xs font-bold border tracking-wide uppercase',
                                            getStatusColor(serviceRequest.status)
                                        )}
                                    >
                                        {getStatusLabel(serviceRequest.status)}
                                    </span>
                                </div>
                            </div>

                            {/* Timeline Stepper */}
                            <div className="py-8">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">
                                    Alur Progres Surat
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative">
                                    {steps.map((step, idx) => {
                                        const stepStatus = getStepStatus(step.key, serviceRequest.status);
                                        return (
                                            <div
                                                key={step.key}
                                                className={cn(
                                                    'p-5 rounded-2xl border transition relative',
                                                    stepStatus === 'completed'
                                                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                                                        : stepStatus === 'active'
                                                        ? 'bg-blue-50/70 border-blue-300 text-blue-900 ring-2 ring-blue-500/20'
                                                        : 'bg-slate-50 border-slate-200 text-slate-400'
                                                )}
                                            >
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div
                                                        className={cn(
                                                            'w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs',
                                                            stepStatus === 'completed'
                                                                ? 'bg-emerald-600 text-white'
                                                                : stepStatus === 'active'
                                                                ? 'bg-blue-600 text-white'
                                                                : 'bg-slate-200 text-slate-600'
                                                        )}
                                                    >
                                                        {stepStatus === 'completed' ? (
                                                            <CheckCircle2 className="w-4 h-4" />
                                                        ) : (
                                                            idx + 1
                                                        )}
                                                    </div>
                                                    <div className="font-bold text-sm text-slate-800">
                                                        {step.label}
                                                    </div>
                                                </div>
                                                <p className="text-xs text-slate-500 leading-relaxed">
                                                    {step.desc}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Rejection Alert if rejected */}
                            {serviceRequest.status === 'rejected' && (
                                <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3">
                                    <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                    <div>
                                        <h5 className="font-bold text-red-800 text-sm">Permohonan Ditolak / Dibatalkan</h5>
                                        <p className="text-xs text-red-700 mt-1">
                                            Alasan: {serviceRequest.rejection_reason || 'Berkas tidak lengkap atau tidak memenuhi syarat.'}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Information Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-sm">
                                <div>
                                    <span className="text-xs text-slate-400 block mb-0.5">Jenis Surat</span>
                                    <span className="font-semibold text-slate-800">
                                        {letterTypeNames[serviceRequest.letter_type] || serviceRequest.letter_type}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-xs text-slate-400 block mb-0.5">Nama Pemohon</span>
                                    <span className="font-semibold text-slate-800">
                                        {serviceRequest.requester_name}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-xs text-slate-400 block mb-0.5">Waktu Pengajuan</span>
                                    <span className="font-semibold text-slate-800">
                                        {formatDateTime(serviceRequest.created_at)}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-xs text-slate-400 block mb-0.5">Keperluan</span>
                                    <span className="font-semibold text-slate-800">
                                        {serviceRequest.purpose}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-slate-50 border border-dashed border-slate-300 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-3">
                        <FileText className="w-10 h-10 text-slate-400 mx-auto" />
                        <h4 className="font-bold text-slate-700 text-base">Cek Status Pengajuan Anda</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Ketikkan nomor tiket yang Anda dapatkan saat mengajukan surat pada kolom pencarian di atas untuk melihat detail dan tahap pemrosesan surat.
                        </p>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
