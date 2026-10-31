import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface News {
    id: number;
    title: string;
    excerpt: string | null;
    body: string;
    category: string;
    status: string;
    cover_image: string | null;
}

interface Props {
    news: News | null;
}

export default function AdminNewsForm({ news }: Props) {
    const isEdit = !!news;

    const { data, setData, post, put, processing, errors } = useForm({
        title:       news?.title       ?? '',
        excerpt:     news?.excerpt     ?? '',
        body:        news?.body        ?? '',
        category:    news?.category    ?? 'berita',
        status:      news?.status      ?? 'draft',
        cover_image: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(`/admin/berita/${news.id}`, { forceFormData: true } as any);
        } else {
            post('/admin/berita', { forceFormData: true } as any);
        }
    };

    const inputClass = (field: string) => cn(
        'w-full px-4 py-3 text-sm rounded-xl border bg-white transition-all',
        'focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500',
        errors[field as keyof typeof errors]
            ? 'border-red-400 bg-red-50'
            : 'border-slate-200 hover:border-slate-300'
    );

    return (
        <AdminLayout title={isEdit ? 'Edit Berita' : 'Tulis Berita Baru'}>
            <Head title={`${isEdit ? 'Edit' : 'Tulis'} Berita — Admin`} />

            <div className="max-w-3xl">
                <Link href="/admin/berita" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-5">
                    <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Berita
                </Link>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
                        <h2 className="font-semibold text-slate-900">Konten Berita</h2>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Judul <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="Tulis judul berita yang menarik..."
                                className={inputClass('title')}
                            />
                            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Ringkasan / Excerpt
                            </label>
                            <textarea
                                value={data.excerpt}
                                onChange={(e) => setData('excerpt', e.target.value)}
                                placeholder="Tuliskan ringkasan singkat yang akan tampil di daftar berita..."
                                rows={2}
                                className={cn(inputClass('excerpt'), 'resize-none')}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Konten Berita <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={data.body}
                                onChange={(e) => setData('body', e.target.value)}
                                placeholder="Tulis konten lengkap berita di sini... (mendukung HTML)"
                                rows={12}
                                className={cn(inputClass('body'), 'resize-y font-mono text-xs leading-relaxed')}
                            />
                            {errors.body && <p className="text-red-500 text-xs mt-1">{errors.body}</p>}
                        </div>
                    </div>

                    {/* Sidebar-style Settings */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
                        <h2 className="font-semibold text-slate-900">Pengaturan Publikasi</h2>

                        <div className="grid sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Kategori</label>
                                <select
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                    className={inputClass('category')}
                                >
                                    <option value="berita">Berita</option>
                                    <option value="pengumuman">Pengumuman</option>
                                    <option value="agenda">Agenda</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className={inputClass('status')}
                                >
                                    <option value="draft">Simpan sebagai Draft</option>
                                    <option value="published">Publikasikan Sekarang</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Foto Cover
                            </label>
                            {news?.cover_image && (
                                <div className="mb-3">
                                    <img
                                        src={`/storage/${news.cover_image}`}
                                        alt="Cover saat ini"
                                        className="w-full h-40 object-cover rounded-xl border border-slate-200"
                                    />
                                    <p className="text-xs text-slate-400 mt-1">Cover saat ini. Upload baru untuk mengganti.</p>
                                </div>
                            )}
                            <label className="flex items-center justify-center gap-2 w-full h-24 border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-xl cursor-pointer transition-colors bg-slate-50 hover:bg-emerald-50/30">
                                <input
                                    type="file"
                                    className="sr-only"
                                    accept="image/*"
                                    onChange={(e) => setData('cover_image', e.target.files?.[0] ?? null)}
                                />
                                <div className="text-sm text-slate-500 text-center">
                                    {data.cover_image
                                        ? <span className="text-emerald-600 font-medium">{data.cover_image.name}</span>
                                        : <><span className="text-emerald-600 font-medium">Pilih gambar</span> atau seret ke sini</>
                                    }
                                    <div className="text-xs text-slate-400 mt-0.5">JPG, PNG — Maks. 2MB</div>
                                </div>
                            </label>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors"
                            >
                                <Save className="w-4 h-4" />
                                {processing ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Publikasikan'}
                            </button>
                            <Link
                                href="/admin/berita"
                                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors"
                            >
                                Batal
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
