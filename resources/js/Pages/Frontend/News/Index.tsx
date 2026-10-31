import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Newspaper, Calendar, Eye, User, ArrowRight, ChevronLeft, ChevronRight, Tag } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { useState } from 'react';

interface NewsItem {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    cover_image: string | null;
    category: 'berita' | 'pengumuman' | 'agenda';
    views: number;
    published_at: string;
    author?: {
        name: string;
    };
}

interface PaginatedNews {
    data: NewsItem[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    news: PaginatedNews;
    categories: string[];
}

export default function NewsIndex({ news, categories }: Props) {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const filteredData = selectedCategory === 'all'
        ? news.data
        : news.data.filter((item) => item.category === selectedCategory);

    const categoryBadgeStyle: Record<string, string> = {
        berita: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        pengumuman: 'bg-amber-50 text-amber-800 border-amber-200',
        agenda: 'bg-blue-50 text-blue-800 border-blue-200',
    };

    return (
        <PublicLayout>
            <Head title="Kabar & Informasi Desa — Desa Tlangoh" />

            {/* Header Hero */}
            <div className="bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center space-y-4">
                    <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Warta & Pengumuman Resmi
                    </span>
                    <h1 className="text-3xl sm:text-5xl font-extrabold font-serif tracking-tight">
                        Kabar Desa Tlangoh
                    </h1>
                    <p className="text-emerald-100/80 text-sm sm:text-base max-w-2xl mx-auto">
                        Dapatkan informasi terkini seputar pembangunan desa, pengumuman penting, agenda warga, dan kegiatan kemasyarakatan.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Category Filters */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={cn(
                            'px-4 py-2 rounded-xl text-xs font-semibold transition tracking-wide uppercase',
                            selectedCategory === 'all'
                                ? 'bg-emerald-700 text-white shadow-sm'
                                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                        )}
                    >
                        Semua Kategori
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={cn(
                                'px-4 py-2 rounded-xl text-xs font-semibold transition tracking-wide uppercase',
                                selectedCategory === cat
                                ? 'bg-emerald-700 text-white shadow-sm'
                                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* News Grid */}
                {filteredData.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 max-w-lg mx-auto p-8 space-y-3">
                        <Newspaper className="w-10 h-10 text-slate-300 mx-auto" />
                        <h3 className="font-bold text-slate-800 text-lg">Belum Ada Kabar untuk Kategori Ini</h3>
                        <p className="text-xs text-slate-500">
                            Pemerintah desa akan segera memperbarui informasi terkini. Silakan periksa kembali nanti.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredData.map((item) => (
                            <article
                                key={item.id}
                                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col group"
                            >
                                {/* Thumbnail */}
                                <div className="aspect-[16/10] bg-slate-100 overflow-hidden relative">
                                    {item.cover_image ? (
                                        <img
                                            src={item.cover_image.startsWith('http') ? item.cover_image : `/storage/${item.cover_image}`}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-900 flex items-center justify-center p-6 text-emerald-100/60">
                                            <Newspaper className="w-12 h-12 opacity-30" />
                                        </div>
                                    )}
                                    <span
                                        className={cn(
                                            'absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider border shadow-xs backdrop-blur-xs',
                                            categoryBadgeStyle[item.category] || 'bg-white text-slate-700 border-slate-200'
                                        )}
                                    >
                                        {item.category}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex-1 flex flex-col justify-between">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-xs text-slate-400">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {formatDate(item.published_at)}
                                            </span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <Eye className="w-3.5 h-3.5" />
                                                {item.views} views
                                            </span>
                                        </div>

                                        <h2 className="font-serif text-lg font-bold text-slate-900 leading-snug group-hover:text-emerald-700 transition line-clamp-2">
                                            <Link href={`/berita/${item.slug}`}>
                                                {item.title}
                                            </Link>
                                        </h2>

                                        <p className="text-slate-600 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                                            {item.excerpt}
                                        </p>
                                    </div>

                                    <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                                        <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                                            <User className="w-3.5 h-3.5 text-emerald-600" />
                                            {item.author?.name || 'Admin Desa'}
                                        </span>

                                        <Link
                                            href={`/berita/${item.slug}`}
                                            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                                        >
                                            Baca Selengkapnya
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {news.last_page > 1 && (
                    <div className="mt-12 flex items-center justify-center gap-2">
                        {news.links.map((link, idx) => {
                            if (link.label.includes('&laquo;') || link.label.includes('Previous')) {
                                return (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        className={cn(
                                            'p-2.5 rounded-xl border border-slate-200 text-slate-600 transition',
                                            !link.url && 'pointer-events-none opacity-40'
                                        )}
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </Link>
                                );
                            }
                            if (link.label.includes('&raquo;') || link.label.includes('Next')) {
                                return (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        className={cn(
                                            'p-2.5 rounded-xl border border-slate-200 text-slate-600 transition',
                                            !link.url && 'pointer-events-none opacity-40'
                                        )}
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                );
                            }
                            return (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    className={cn(
                                        'px-4 py-2 rounded-xl text-xs font-bold border transition',
                                        link.active
                                            ? 'bg-emerald-700 text-white border-emerald-700'
                                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                    )}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
