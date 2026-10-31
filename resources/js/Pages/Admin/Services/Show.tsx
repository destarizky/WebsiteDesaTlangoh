import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft, CheckCircle2, XCircle, Loader2, FileText, User, Clock } from 'lucide-react';
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
    status: string;
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

export default function AdminServicesShow({ serviceRequest }: Props) {
    const [showRejectForm, setShowRejectForm] = useState(false);
    const { data, setData, patch, processing } = useForm({ admin_notes: '' });

    const handleApprove = () => {
        if (confirm('Setujui pengajuan ini?')) {
            patch(`/admin/surat/${serviceRequest.id}/approve`);
        }
    };

    const handleProcess = () => {
        patch(`/admin/surat/${serviceRequest.id}/process`);
    };

    const handleReject = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/admin/surat/${serviceRequest.id}/reject`);
    };

    return (
        <AdminLayout title="Detail Pengajuan Surat">
            <Head title={`Surat ${serviceRequest.ticket_number} — Admin`} />

            <div className="max-w-3xl space-y-5">
                {/* Back button */}
                <Link href="/admin/surat" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Surat
                </Link>

                {/* Header Card */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <FileText className="w-5 h-5 text-blue-500" />
                                <span className="font-mono text-sm font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded">
                                    {serviceRequest.ticket_number}
                                </span>
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">
                                {letterTypeLabels[serviceRequest.letter_type] ?? serviceRequest.letter_type}
                            </h2>
                            <div className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                Diajukan pada {formatDateTime(serviceRequest.created_at)}
                            </div>
                        </div>
                        <span className={cn('px-3 py-1.5 text-sm font-medium rounded-full border shrink-0', getStatusColor(serviceRequest.status))}>
                            {getStatusLabel(serviceRequest.status)}
                        </span>
                    </div>
                </div>

                {/* Requester Info */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                    <h3 className="font-semibold text-slate-900 mb-5 flex items-center gap-2">
                        <User className="w-4 h-4 text-emerald-500" /> Data Pemohon
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {[
                            { label: 'Nama Lengkap',   value: serviceRequest.requester_name },
                            { label: 'NIK',             value: serviceRequest.requester_nik },
                            { label: 'No. HP/WA',      value: serviceRequest.requester_phone ?? '-' },
                            { label: 'Alamat',          value: serviceRequest.requester_address },
                        ].map(({ label, value }) => (
                            <div key={label}>
                                <div className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">{label}</div>
                                <div className="text-sm text-slate-900 font-medium">{value}</div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-5">
                        <div className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Keperluan</div>
                        <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg">{serviceRequest.purpose}</p>
                    </div>
                    {serviceRequest.attachment && (
                        <div className="mt-4">
                            <div className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Lampiran</div>
                            <a
                                href={`/storage/${serviceRequest.attachment}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 underline"
                            >
                                Lihat Dokumen Lampiran
                            </a>
                        </div>
                    )}
                </div>

                {/* Admin Notes */}
                {serviceRequest.admin_notes && (
                    <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
                        <div className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-2">Catatan Penolakan</div>
                        <p className="text-sm text-red-800">{serviceRequest.admin_notes}</p>
                    </div>
                )}

                {/* Actions */}
                {serviceRequest.status === 'pending' && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6">
                        <h3 className="font-semibold text-slate-900 mb-4">Tindakan Admin</h3>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={handleProcess}
                                disabled={processing}
                                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium rounded-xl transition-colors"
                            >
                                <Loader2 className="w-4 h-4" /> Tandai Sedang Diproses
                            </button>
                            <button
                                onClick={handleApprove}
                                disabled={processing}
                                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-medium rounded-xl transition-colors"
                            >
                                <CheckCircle2 className="w-4 h-4" /> Setujui Pengajuan
                            </button>
                            <button
                                onClick={() => setShowRejectForm(!showRejectForm)}
                                className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl transition-colors"
                            >
                                <XCircle className="w-4 h-4" /> Tolak
                            </button>
                        </div>

                        {showRejectForm && (
                            <form onSubmit={handleReject} className="mt-4 p-4 bg-red-50 rounded-xl border border-red-100">
                                <label className="block text-sm font-medium text-red-800 mb-2">
                                    Alasan Penolakan <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    rows={3}
                                    value={data.admin_notes}
                                    onChange={(e) => setData('admin_notes', e.target.value)}
                                    placeholder="Jelaskan alasan penolakan..."
                                    className="w-full px-3 py-2.5 text-sm border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400/30 focus:border-red-400 bg-white resize-none"
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="mt-3 px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
                                >
                                    Konfirmasi Penolakan
                                </button>
                            </form>
                        )}
                    </div>
                )}

                {serviceRequest.processed_at && (
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 text-sm text-slate-500">
                        Diproses oleh <strong className="text-slate-700">{serviceRequest.processor?.name ?? 'Admin'}</strong>{' '}
                        pada {formatDateTime(serviceRequest.processed_at)}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
