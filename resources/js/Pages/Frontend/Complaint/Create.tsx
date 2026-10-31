import { Head, useForm } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import {
    MessageSquareWarning, ShieldCheck, Upload, AlertCircle,
    User, Phone, MapPin, Send, HelpCircle, CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface Props {
    categories: Record<string, string>;
}

export default function ComplaintCreate({ categories }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        reporter_name: '',
        reporter_phone: '',
        category: 'infrastruktur',
        subject: '',
        description: '',
        location: '',
        attachment: null as File | null,
        is_anonymous: false,
    });

    const [fileName, setFileName] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/pengaduan', {
            forceFormData: true,
        });
    };

    return (
        <PublicLayout>
            <Head title="Pengaduan & Aspirasi Warga — Desa Tlangoh" />

            {/* Header Hero */}
            <div className="bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center space-y-4">
                    <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Kanal Pengaduan Resmi Desa
                    </span>
                    <h1 className="text-3xl sm:text-5xl font-extrabold font-serif tracking-tight">
                        Layanan Pengaduan & Aspirasi Warga
                    </h1>
                    <p className="text-emerald-100/80 text-sm sm:text-base max-w-xl mx-auto">
                        Sampaikan keluhan, masukan, maupun laporan Anda secara aman dan transparan untuk pembangunan Desa Tlangoh yang lebih baik.
                    </p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm space-y-8"
                >
                    {/* Privacy notice banner */}
                    <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-start gap-3">
                        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                        <div className="text-xs text-emerald-900 space-y-1">
                            <span className="font-bold">Privasi Terjamin & Ditindaklanjuti Langsung</span>
                            <p className="text-emerald-800/90 leading-relaxed">
                                Anda dapat memilih opsi laporan <strong>Anonim</strong> jika ingin merahasiakan identitas diri. Setiap laporan masuk akan langsung diteruskan ke perangkat desa terkait.
                            </p>
                        </div>
                    </div>

                    {/* Anonymous toggle */}
                    <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 flex items-center justify-between">
                        <div>
                            <span className="text-sm font-bold text-slate-800 block">Kirim Sebagai Anonim</span>
                            <span className="text-xs text-slate-500">Nama Anda tidak akan ditampilkan kepada publik maupun petugas.</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.is_anonymous}
                                onChange={(e) => setData('is_anonymous', e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                    </div>

                    {/* Reporter Info (shown only if not anonymous) */}
                    {!data.is_anonymous && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in fade-in duration-200">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                                    Nama Lengkap Pelapor <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        required={!data.is_anonymous}
                                        value={data.reporter_name}
                                        onChange={(e) => setData('reporter_name', e.target.value)}
                                        placeholder="Nama sesuai KTP"
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                    />
                                </div>
                                {errors.reporter_name && (
                                    <p className="text-xs text-red-500 mt-1">{errors.reporter_name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                                    Nomor WhatsApp / HP
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="tel"
                                        value={data.reporter_phone}
                                        onChange={(e) => setData('reporter_phone', e.target.value)}
                                        placeholder="Contoh: 08123456789"
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                    />
                                </div>
                                {errors.reporter_phone && (
                                    <p className="text-xs text-red-500 mt-1">{errors.reporter_phone}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Complaint Form Fields */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                                Kategori Masalah <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={data.category}
                                onChange={(e) => setData('category', e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                            >
                                {Object.entries(categories).map(([val, label]) => (
                                    <option key={val} value={val}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                            {errors.category && (
                                <p className="text-xs text-red-500 mt-1">{errors.category}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                                Judul / Perihal Pengaduan <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={data.subject}
                                onChange={(e) => setData('subject', e.target.value)}
                                placeholder="Contoh: Lampu Penerangan Jalan Rusak di Dusun Krajan"
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                            />
                            {errors.subject && (
                                <p className="text-xs text-red-500 mt-1">{errors.subject}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                                Lokasi Kejadian (Opsional)
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={data.location}
                                    onChange={(e) => setData('location', e.target.value)}
                                    placeholder="Contoh: Depan Masjid Al-Ikhlas, Dusun Lor RT 02"
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                />
                            </div>
                            {errors.location && (
                                <p className="text-xs text-red-500 mt-1">{errors.location}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                                Isi Pengaduan / Keluhan Detail <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                rows={5}
                                required
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Jelaskan secara rinci kronologi masalah, kondisi lapangan, atau solusi yang Anda harapkan..."
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                            />
                            {errors.description && (
                                <p className="text-xs text-red-500 mt-1">{errors.description}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                                Foto Bukti atau Dokumen Pendukung (Opsional)
                            </label>
                            <div className="border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-2xl p-6 text-center bg-slate-50/50 hover:bg-emerald-50/20 transition cursor-pointer relative">
                                <input
                                    type="file"
                                    accept="image/*,.pdf"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0] || null;
                                        setData('attachment', file);
                                        setFileName(file ? file.name : null);
                                    }}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                {fileName ? (
                                    <div className="text-sm font-semibold text-emerald-800">
                                        File terpilih: {fileName}
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold text-slate-700">
                                            Klik untuk mengunggah file foto atau dokumen
                                        </p>
                                        <p className="text-[11px] text-slate-400">
                                            Format: JPG, PNG, atau PDF (Maksimal 2 MB)
                                        </p>
                                    </div>
                                )}
                            </div>
                            {errors.attachment && (
                                <p className="text-xs text-red-500 mt-1">{errors.attachment}</p>
                            )}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm transition shadow-md hover:shadow-lg disabled:opacity-50"
                        >
                            <Send className="w-4 h-4" />
                            {processing ? 'Mengirim Laporan...' : 'Kirim Pengaduan Sekarang'}
                        </button>
                    </div>
                </form>
            </div>
        </PublicLayout>
    );
}
