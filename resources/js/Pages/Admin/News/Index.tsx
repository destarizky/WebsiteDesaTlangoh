import { Head, useForm, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, Pencil, Trash2, Search, Filter, Eye } from 'lucide-react';
import { cn, getStatusColor, getStatusLabel, formatDate } from '@/lib/utils';
import { useState } from 'react';

interface News {
    id: number;
    title: string;
    slug: string;
    category: string;
    status: string;
    views: number;
    published_at: string | null;
    author?: { name: string };
}

interface Paginated<T> {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    news: Paginated<News>;
    filters: { status?: string; search?: string };
}

const categoryColors: Record<string, string> = {
    berita:      'bg-blue-50 text-blue-700',
    pengumuman:  'bg-amber-50 text-amber-700',
    agenda:      'bg-purple-50 text-purple-700',
};

export default function AdminNewsIndex({ news, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? '');

    const applyFilters = () => {
        router.get('/admin/berita', { search, status }, { preserveState: true });
    };

    const handleDelete = (id: number, title: string) => {
        if (confirm(`Hapus berita "${title}"?`)) {
            router.delete(`/admin/berita/${id}`);
        }
    };

    return (
        <AdminLayout title="CMS Berita & Pengumuman">
            <Head title="Manajemen Berita — Admin" />

            <div className="space-y-5">
                {/* Actions Bar */}
                <div className="flex flex-wrap gap-3 items-center justify-between">
                    <div className="flex flex-wrap gap-3 flex-1">
                        <div className="relative flex-1 min-w-[200px] max-w-xs">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari judul berita..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                            />
                        </div>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none bg-white"
                        >
                            <option value="">Semua Status</option>
                            <option value="published">Dipublikasikan</option>
                            <option value="draft">Draft</option>
                        </select>
                        <button
                            onClick={applyFilters}
                            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors"
                        >
                            <Filter className="w-4 h-4" /> Filter
                        </button>
                    </div>
                    <Link
                        href="/admin/berita/create"
                        className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Tulis Berita
                    </Link>
                </div>

                {/* Stats */}
                <p className="text-sm text-slate-500">
                    <strong>{news.total}</strong> berita total
                </p>

                {/* Table */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Judul</th>
                                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Kategori</th>
                                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Tayang</th>
                                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Views</th>
                                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {news.data.length > 0 ? news.data.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-5 py-4">
                                        <div className="font-medium text-sm text-slate-900 max-w-xs truncate">{item.title}</div>
                                        <div className="text-xs text-slate-400">oleh {item.author?.name ?? '-'}</div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={cn('px-2.5 py-1 text-xs font-medium rounded-full capitalize', categoryColors[item.category] ?? 'bg-slate-100 text-slate-600')}>
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={cn('px-2.5 py-1 text-xs font-medium rounded-full border', getStatusColor(item.status))}>
                                            {getStatusLabel(item.status)}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-xs text-slate-500">{formatDate(item.published_at)}</td>
                                    <td className="px-5 py-4 text-sm font-medium text-slate-700">{item.views.toLocaleString('id-ID')}</td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-1.5">
                                            <a
                                                href={`/berita/${item.slug}`}
                                                target="_blank"
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                                title="Lihat di website"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </a>
                                            <Link
                                                href={`/admin/berita/${item.id}/edit`}
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(item.id, item.title)}
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                title="Hapus"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="px-5 py-12 text-center text-slate-400 text-sm">
                                        Belum ada berita. <Link href="/admin/berita/create" className="text-emerald-600 underline">Tulis sekarang</Link>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {news.last_page > 1 && (
                        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100">
                            <div className="text-sm text-slate-500">Halaman {news.current_page} dari {news.last_page}</div>
                            <div className="flex gap-1">
                                {news.links.map((link, i) => (
                                    link.url ? (
                                        <Link
                                            key={i}
                                            href={link.url}
                                            className={cn('px-3 py-1.5 text-sm rounded-lg transition-colors', link.active ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100')}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span key={i} className="px-3 py-1.5 text-sm text-slate-300" dangerouslySetInnerHTML={{ __html: link.label }} />
                                    )
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
