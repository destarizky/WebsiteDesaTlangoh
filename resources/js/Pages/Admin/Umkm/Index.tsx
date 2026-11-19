import { Head, useForm, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, Trash2, Pencil, Search, Filter, ExternalLink, Eye } from 'lucide-react';
import { cn, formatRupiah } from '@/lib/utils';
import { useState } from 'react';
import ConfirmModal from '@/Components/ConfirmModal';

interface UmkmItem {
    id: number;
    name: string;
    type: string;
    owner_name: string;
    is_active: boolean;
    is_featured: boolean;
    price_from: number | null;
}

interface Paginated<T> {
    data: T[];
    total: number;
    current_page: number;
    last_page: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    items: Paginated<UmkmItem>;
    filters: { type?: string; search?: string };
}

const typeLabels: Record<string, string> = {
    produk: 'Produk', kuliner: 'Kuliner', kerajinan: 'Kerajinan', wisata: 'Wisata', jasa: 'Jasa',
};

export default function AdminUmkmIndex({ items, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [type, setType] = useState(filters.type ?? '');

    const applyFilters = () => {
        router.get('/admin/umkm', { search, type }, { preserveState: true });
    };

    const [deleteModal, setDeleteModal] = useState<{ show: boolean; id?: number; name?: string }>({
        show: false,
    });

    const openDeleteModal = (id: number, name: string) => {
        setDeleteModal({ show: true, id, name });
    };

    const confirmDelete = () => {
        if (deleteModal.id) {
            router.delete(`/admin/umkm/${deleteModal.id}`);
        }
    };

    return (
        <AdminLayout title="UMKM & Wisata">
            <Head title="Manajemen UMKM — Admin" />

            <div className="space-y-5">
                <div className="flex flex-wrap gap-3 items-center justify-between">
                    <div className="flex flex-wrap gap-3 flex-1">
                        <div className="relative flex-1 min-w-[200px] max-w-xs">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari UMKM..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                            />
                        </div>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none"
                        >
                            <option value="">Semua Tipe</option>
                            {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                        </select>
                        <button onClick={applyFilters} className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm rounded-lg">
                            <Filter className="w-4 h-4" /> Filter
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <a
                            href="/potensi-umkm"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-xl transition-colors border border-slate-200 shadow-2xs"
                            title="Buka halaman potensi UMKM di website publik"
                        >
                            <ExternalLink className="w-4 h-4 text-emerald-600" />
                            <span className="hidden sm:inline">Halaman Publik (/potensi-umkm)</span>
                        </a>
                        <Link
                            href="/admin/umkm/create"
                            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-xs"
                        >
                            <Plus className="w-4 h-4" /> Tambah UMKM
                        </Link>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.data.map((item) => (
                        <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-all">
                            <div className="flex items-start justify-between gap-3 mb-3">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-slate-900 truncate">{item.name}</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">{item.owner_name}</p>
                                </div>
                                <div className="flex gap-1.5 shrink-0">
                                    <a
                                        href="/potensi-umkm"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                        title="Lihat di website publik"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </a>
                                    <Link
                                        href={`/admin/umkm/${item.id}/edit`}
                                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                                        title="Edit data UMKM"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </Link>
                                    <button
                                        onClick={() => openDeleteModal(item.id, item.name)}
                                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                        title="Hapus"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="px-2 py-0.5 text-xs bg-emerald-50 text-emerald-700 rounded-full capitalize">{typeLabels[item.type]}</span>
                                {item.is_featured && <span className="px-2 py-0.5 text-xs bg-amber-50 text-amber-700 rounded-full">⭐ Unggulan</span>}
                                <span className={cn('px-2 py-0.5 text-xs rounded-full', item.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500')}>
                                    {item.is_active ? 'Aktif' : 'Nonaktif'}
                                </span>
                            </div>
                            {item.price_from && (
                                <p className="text-xs text-slate-500 mt-2">Mulai {formatRupiah(item.price_from)}</p>
                            )}
                        </div>
                    ))}
                    {items.data.length === 0 && (
                        <div className="sm:col-span-2 lg:col-span-3 text-center py-12 text-slate-400 text-sm">
                            Belum ada data UMKM.
                        </div>
                    )}
                </div>

                {items.last_page > 1 && (
                    <div className="flex gap-1 justify-center">
                        {items.links.map((link, i) => (
                            link.url ? (
                                <Link key={i} href={link.url} className={cn('px-3 py-1.5 text-sm rounded-lg', link.active ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100')} dangerouslySetInnerHTML={{ __html: link.label }} />
                            ) : (
                                <span key={i} className="px-3 py-1.5 text-sm text-slate-300" dangerouslySetInnerHTML={{ __html: link.label }} />
                            )
                        ))}
                    </div>
                )}

                {/* Custom Confirmation Modal */}
                <ConfirmModal
                    show={deleteModal.show}
                    title="Hapus UMKM Ini?"
                    message={`Apakah Anda yakin ingin menghapus UMKM "${deleteModal.name}"? Data yang sudah dihapus tidak dapat dipulihkan kembali.`}
                    confirmText="Ya, Hapus UMKM"
                    cancelText="Batal"
                    onConfirm={confirmDelete}
                    onClose={() => setDeleteModal({ show: false })}
                />
            </div>
        </AdminLayout>
    );
}
