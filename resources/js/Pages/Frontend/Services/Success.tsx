import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { CheckCircle2, Copy, ArrowRight, Clock } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { formatDateTime } from '@/lib/utils';
import { useState } from 'react';

interface ServiceRequest {
    ticket_number: string;
    requester_name: string;
    letter_type: string;
    status: string;
    created_at: string;
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

export default function ServiceSuccess({ serviceRequest }: Props) {
    const [copied, setCopied] = useState(false);

    const copyTicket = () => {
        navigator.clipboard.writeText(serviceRequest.ticket_number);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <PublicLayout>
            <Head title="Pengajuan Berhasil — Desa Tlangoh" />

            <div className="pt-24 pb-20 bg-stone-50 min-h-screen flex items-center">
                <div className="max-w-lg mx-auto px-4 sm:px-6 w-full">
                    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden text-center">
                        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 px-6 py-10">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4">
                                <CheckCircle2 className="w-10 h-10 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-white">Pengajuan Berhasil!</h1>
                            <p className="text-emerald-100 mt-2 text-sm">
                                Pengajuan surat Anda telah diterima dan akan segera diproses oleh petugas desa.
                            </p>
                        </div>

                        <div className="p-8">
                            <div className="mb-6">
                                <p className="text-sm text-stone-500 mb-2">Nomor Tiket Pengajuan</p>
                                <div className="flex items-center justify-center gap-3">
                                    <span className="text-2xl font-bold font-mono text-stone-900 tracking-wider">
                                        {serviceRequest.ticket_number}
                                    </span>
                                    <button
                                        onClick={copyTicket}
                                        className="p-2 rounded-lg hover:bg-stone-100 transition-colors text-stone-500"
                                        title="Salin nomor tiket"
                                    >
                                        {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                                <p className="text-xs text-stone-400 mt-2">Simpan nomor tiket ini untuk melacak status pengajuan Anda</p>
                            </div>

                            <div className="bg-stone-50 rounded-xl p-4 text-left space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-stone-500">Pemohon</span>
                                    <span className="font-medium text-stone-900">{serviceRequest.requester_name}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-stone-500">Jenis Surat</span>
                                    <span className="font-medium text-stone-900">{letterTypeLabels[serviceRequest.letter_type] ?? serviceRequest.letter_type}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-stone-500">Waktu Pengajuan</span>
                                    <span className="font-medium text-stone-900">{formatDateTime(serviceRequest.created_at)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-stone-500">Status</span>
                                    <span className="font-medium text-amber-600 flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5" /> Menunggu Proses
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <Link
                                    href={`/layanan-surat/lacak?ticket=${serviceRequest.ticket_number}`}
                                    className="flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors"
                                >
                                    Lacak Status Pengajuan <ArrowRight className="w-4 h-4" />
                                </Link>
                                <Link
                                    href="/"
                                    className="flex items-center justify-center gap-2 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium rounded-xl transition-colors"
                                >
                                    Kembali ke Beranda
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
