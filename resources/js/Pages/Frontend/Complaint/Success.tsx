import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { CheckCircle2, Copy, ArrowRight, ShieldCheck, Check, Clock } from 'lucide-react';
import { useState } from 'react';
import { formatDateTime } from '@/lib/utils';

interface Complaint {
    id: number;
    ticket_number: string;
    subject: string;
    category: string;
    is_anonymous: boolean;
    created_at: string;
}

interface Props {
    complaint: Complaint;
}

export default function ComplaintSuccess({ complaint }: Props) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(complaint.ticket_number);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <PublicLayout>
            <Head title="Pengaduan Berhasil Dikirim — Desa Tlangoh" />

            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
                <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-sm text-center space-y-6">
                    {/* Success Icon */}
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                        <CheckCircle2 className="w-9 h-9" />
                    </div>

                    <div className="space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                            Pengaduan Telah Tercatat
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900">
                            Terima Kasih atas Partisipasi Anda
                        </h1>
                        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                            Laporan aspirasi atau keluhan Anda telah berhasil dikirim ke sistem administrasi Pemerintah Desa Tlangoh.
                        </p>
                    </div>

                    {/* Ticket Box */}
                    <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl max-w-md mx-auto space-y-3">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                            Nomor Tiket Pengaduan Anda
                        </span>
                        <div className="font-mono text-2xl font-black text-slate-800 tracking-wider">
                            {complaint.ticket_number}
                        </div>
                        <button
                            type="button"
                            onClick={handleCopy}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 transition shadow-2xs"
                        >
                            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            {copied ? 'Nomor Tiket Disalin!' : 'Salin Nomor Tiket'}
                        </button>
                    </div>

                    {/* Next Steps Note */}
                    <div className="text-left text-xs text-slate-500 bg-emerald-50/40 p-4 rounded-xl border border-emerald-100 space-y-1.5">
                        <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-emerald-600" />
                            Tahap Selanjutnya:
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-slate-600">
                            <li>Laporan Anda akan ditinjau oleh operator / perangkat desa dalam 1x24 jam kerja.</li>
                            <li>Tindak lanjut dan hasil evaluasi akan diperbarui secara berkala oleh staf kami.</li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link
                            href="/"
                            className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-xs text-center"
                        >
                            Kembali ke Beranda
                        </Link>
                        <Link
                            href="/pengaduan"
                            className="w-full sm:w-auto px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider transition text-center"
                        >
                            Buat Laporan Lain
                        </Link>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
