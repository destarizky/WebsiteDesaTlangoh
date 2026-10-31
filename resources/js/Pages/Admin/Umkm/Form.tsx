import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UmkmItem {
    id: number;
    name: string;
    type: string;
    description: string;
    owner_name: string;
    phone: string | null;
    address: string | null;
    cover_image: string | null;
    price_from: number | null;
    price_to: number | null;
    is_active: boolean;
    is_featured: boolean;
}

interface Props {
    item: UmkmItem | null;
}

export default function AdminUmkmForm({ item }: Props) {
    const isEdit = !!item;

    const { data, setData, post, put, processing, errors } = useForm({
        name:         item?.name         ?? '',
        type:         item?.type         ?? 'produk',
        description:  item?.description  ?? '',
        owner_name:   item?.owner_name   ?? '',
        phone:        item?.phone        ?? '',
        address:      item?.address      ?? '',
        price_from:   item?.price_from   ?? '',
        price_to:     item?.price_to     ?? '',
        is_active:    item?.is_active    ?? true,
        is_featured:  item?.is_featured  ?? false,
        cover_image:  null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(`/admin/umkm/${item.id}`, { forceFormData: true } as any);
        } else {
            post('/admin/umkm', { forceFormData: true } as any);
        }
    };

    const inputClass = (field: string) => cn(
        'w-full px-4 py-3 text-sm rounded-xl border bg-white transition-all',
        'focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500',
        errors[field as keyof typeof errors] ? 'border-red-400 bg-red-50' : 'border-slate-200 hover:border-slate-300'
    );

    return (
        <AdminLayout title={isEdit ? 'Edit UMKM' : 'Tambah UMKM'}>
            <Head title={`${isEdit ? 'Edit' : 'Tambah'} UMKM — Admin`} />

            <div className="max-w-2xl">
                <Link href="/admin/umkm" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-5">
                    <ArrowLeft className="w-4 h-4" /> Kembali
                </Link>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
                        <h2 className="font-semibold text-slate-900">Informasi UMKM</h2>

                        <div className="grid sm:grid-cols-2 gap-5">
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama UMKM / Wisata <span className="text-red-500">*</span></label>
                                <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className={inputClass('name')} placeholder="Nama produk atau tempat wisata" />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Tipe <span className="text-red-500">*</span></label>
                                <select value={data.type} onChange={(e) => setData('type', e.target.value)} className={inputClass('type')}>
                                    <option value="produk">Produk</option>
                                    <option value="kuliner">Kuliner</option>
                                    <option value="kerajinan">Kerajinan</option>
                                    <option value="wisata">Wisata</option>
                                    <option value="jasa">Jasa</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Pemilik <span className="text-red-500">*</span></label>
                                <input type="text" value={data.owner_name} onChange={(e) => setData('owner_name', e.target.value)} className={inputClass('owner_name')} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">No. HP</label>
                                <input type="tel" value={data.phone} onChange={(e) => setData('phone', e.target.value)} className={inputClass('phone')} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Alamat</label>
                                <input type="text" value={data.address} onChange={(e) => setData('address', e.target.value)} className={inputClass('address')} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Harga Mulai (Rp)</label>
                                <input type="number" value={data.price_from} onChange={(e) => setData('price_from', e.target.value)} className={inputClass('price_from')} min={0} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Harga Sampai (Rp)</label>
                                <input type="number" value={data.price_to} onChange={(e) => setData('price_to', e.target.value)} className={inputClass('price_to')} min={0} />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Deskripsi <span className="text-red-500">*</span></label>
                                <textarea rows={4} value={data.description} onChange={(e) => setData('description', e.target.value)} className={cn(inputClass('description'), 'resize-none')} />
                            </div>
                        </div>

                        {/* Cover Image */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Foto Cover</label>
                            {item?.cover_image && (
                                <img src={`/storage/${item.cover_image}`} alt="Cover" className="w-full h-40 object-cover rounded-xl mb-3 border border-slate-200" />
                            )}
                            <label className="flex items-center justify-center gap-2 w-full h-24 border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-xl cursor-pointer transition-colors bg-slate-50 hover:bg-emerald-50/30">
                                <input type="file" className="sr-only" accept="image/*" onChange={(e) => setData('cover_image', e.target.files?.[0] ?? null)} />
                                <div className="text-sm text-slate-500 text-center">
                                    {data.cover_image ? <span className="text-emerald-600 font-medium">{data.cover_image.name}</span> : <><span className="text-emerald-600 font-medium">Pilih gambar</span> atau seret ke sini</>}
                                </div>
                            </label>
                        </div>

                        {/* Toggles */}
                        <div className="flex gap-6">
                            <label className="flex items-center gap-2.5 cursor-pointer">
                                <input type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} className="w-4 h-4 rounded accent-emerald-600" />
                                <span className="text-sm font-medium text-slate-700">Aktif (tampil di website)</span>
                            </label>
                            <label className="flex items-center gap-2.5 cursor-pointer">
                                <input type="checkbox" checked={data.is_featured} onChange={(e) => setData('is_featured', e.target.checked)} className="w-4 h-4 rounded accent-amber-500" />
                                <span className="text-sm font-medium text-slate-700">⭐ Tampilkan sebagai unggulan</span>
                            </label>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button type="submit" disabled={processing} className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors">
                                <Save className="w-4 h-4" /> {processing ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambahkan UMKM'}
                            </button>
                            <Link href="/admin/umkm" className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors">Batal</Link>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
