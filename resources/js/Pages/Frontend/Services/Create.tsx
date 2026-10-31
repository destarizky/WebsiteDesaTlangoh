import { Head, useForm } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { FileText, User, Hash, Phone, MapPin, ChevronDown, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
    letterTypes: Record<string, string>;
}

export default function ServiceCreate({ letterTypes }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        requester_name:    '',
        requester_nik:     '',
        requester_phone:   '',
        requester_address: '',
        letter_type:       '',
        purpose:           '',
        attachment:        null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/layanan-surat', {
            forceFormData: true,
        });
    };

    const inputClass = (field: string) =>
        cn(
            'w-full px-4 py-3 rounded-xl border bg-white text-stone-900 placeholder-stone-400 text-sm transition-all',
            'focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500',
            errors[field as keyof typeof errors]
                ? 'border-red-400 bg-red-50'
                : 'border-stone-200 hover:border-stone-300'
        );

    return (
        <PublicLayout>
            <Head title="Pengajuan Surat — Desa Tlangoh" />

            <div className="pt-24 pb-20 bg-stone-50 min-h-screen">
                <div className="max-w-2xl mx-auto px-4 sm:px-6">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg mb-4">
                            <FileText className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-stone-900">Pengajuan Surat</h1>
                        <p className="text-stone-500 mt-2">Isi formulir berikut untuk mengajukan surat keterangan secara online</p>
                    </div>

                    {/* Info Box */}
                    <div className="flex gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl mb-8">
                        <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-700">
                            <strong>Perhatian:</strong> Pastikan data yang Anda isi sesuai dengan KTP. Surat akan diproses dalam <strong>1-3 hari kerja</strong>. Anda akan mendapatkan nomor tiket untuk melacak status pengajuan.
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                        {/* Section: Data Pemohon */}
                        <div className="px-6 pt-6 pb-2 border-b border-stone-100">
                            <h2 className="text-base font-semibold text-stone-900 flex items-center gap-2">
                                <User className="w-4 h-4 text-emerald-600" />
                                Data Pemohon
                            </h2>
                        </div>
                        <div className="p-6 grid sm:grid-cols-2 gap-5">
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                                    Nama Lengkap <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Sesuai KTP"
                                    value={data.requester_name}
                                    onChange={(e) => setData('requester_name', e.target.value)}
                                    className={inputClass('requester_name')}
                                />
                                {errors.requester_name && (
                                    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                                        <AlertCircle className="w-3.5 h-3.5" /> {errors.requester_name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                                    NIK <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="16 digit NIK"
                                    maxLength={16}
                                    value={data.requester_nik}
                                    onChange={(e) => setData('requester_nik', e.target.value.replace(/\D/g, ''))}
                                    className={inputClass('requester_nik')}
                                />
                                {errors.requester_nik && (
                                    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                                        <AlertCircle className="w-3.5 h-3.5" /> {errors.requester_nik}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                                    Nomor HP/WA
                                </label>
                                <input
                                    type="tel"
                                    placeholder="Aktif di WhatsApp"
                                    value={data.requester_phone}
                                    onChange={(e) => setData('requester_phone', e.target.value)}
                                    className={inputClass('requester_phone')}
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                                    Alamat Lengkap <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    placeholder="RT/RW, Dusun, Desa Tlangoh"
                                    rows={2}
                                    value={data.requester_address}
                                    onChange={(e) => setData('requester_address', e.target.value)}
                                    className={cn(inputClass('requester_address'), 'resize-none')}
                                />
                                {errors.requester_address && (
                                    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                                        <AlertCircle className="w-3.5 h-3.5" /> {errors.requester_address}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Section: Jenis Surat */}
                        <div className="px-6 pt-4 pb-2 border-t border-stone-100">
                            <h2 className="text-base font-semibold text-stone-900 flex items-center gap-2">
                                <Hash className="w-4 h-4 text-emerald-600" />
                                Jenis & Keperluan Surat
                            </h2>
                        </div>
                        <div className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                                    Jenis Surat <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        value={data.letter_type}
                                        onChange={(e) => setData('letter_type', e.target.value)}
                                        className={cn(inputClass('letter_type'), 'appearance-none pr-10')}
                                    >
                                        <option value="">Pilih jenis surat...</option>
                                        {Object.entries(letterTypes).map(([value, label]) => (
                                            <option key={value} value={value}>{label}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                                </div>
                                {errors.letter_type && (
                                    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                                        <AlertCircle className="w-3.5 h-3.5" /> {errors.letter_type}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                                    Keperluan / Tujuan <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    placeholder="Jelaskan keperluan pengajuan surat ini"
                                    rows={3}
                                    value={data.purpose}
                                    onChange={(e) => setData('purpose', e.target.value)}
                                    className={cn(inputClass('purpose'), 'resize-none')}
                                />
                                {errors.purpose && (
                                    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                                        <AlertCircle className="w-3.5 h-3.5" /> {errors.purpose}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                                    Lampiran Dokumen <span className="text-stone-400">(opsional)</span>
                                </label>
                                <label className="flex items-center justify-center gap-3 w-full h-28 border-2 border-dashed border-stone-200 hover:border-emerald-400 rounded-xl cursor-pointer transition-colors group bg-stone-50 hover:bg-emerald-50/30">
                                    <input
                                        type="file"
                                        className="sr-only"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={(e) => setData('attachment', e.target.files?.[0] ?? null)}
                                    />
                                    <Upload className="w-5 h-5 text-stone-400 group-hover:text-emerald-500 transition-colors" />
                                    <div className="text-sm text-stone-500">
                                        {data.attachment
                                            ? <span className="text-emerald-600 font-medium">{data.attachment.name}</span>
                                            : <><span className="text-emerald-600 font-medium">Pilih file</span> atau seret ke sini</>
                                        }
                                        <div className="text-xs text-stone-400 mt-0.5">PDF, JPG, PNG — Maks. 2MB</div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="px-6 pb-6 border-t border-stone-100 pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors"
                            >
                                {processing ? (
                                    <>
                                        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Mengirim Pengajuan...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="w-5 h-5" />
                                        Kirim Pengajuan
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </PublicLayout>
    );
}
