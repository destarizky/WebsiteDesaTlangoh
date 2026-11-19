import { Head, Link, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import {
    Newspaper, Calendar, Eye, User, ArrowRight, ChevronLeft,
    ChevronRight, Tag, Search, Sparkles, Plus, Settings,
    Megaphone, CalendarDays, Share2, ArrowUpRight, Flame
} from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { useState, useMemo } from 'react';

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
    const { auth } = usePage<{ auth: { user?: { name: string; email: string } } }>().props;
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');

    const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
        berita: Newspaper,
        pengumuman: Megaphone,
        agenda: CalendarDays,
    };

    const categoryBadgeStyle: Record<string, { bg: string; text: string; border: string }> = {
        berita: { bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', text: 'Berita Desa', border: 'border-emerald-200' },
        pengumuman: { bg: 'bg-amber-50 text-amber-800 border-amber-200', text: 'Pengumuman Resmi', border: 'border-amber-200' },
        agenda: { bg: 'bg-sky-50 text-sky-800 border-sky-200', text: 'Agenda Kegiatan', border: 'border-sky-200' },
    };

    // Filter by Category and Search Query
    const filteredData = useMemo(() => {
        return news.data.filter((item) => {
            const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
            const matchesSearch = searchQuery.trim() === '' ||
                item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.excerpt && item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesCat && matchesSearch;
        });
    }, [news.data, selectedCategory, searchQuery]);

    const featuredArticle = selectedCategory === 'all' && searchQuery.trim() === '' ? filteredData[0] : null;
    const remainingArticles = featuredArticle ? filteredData.slice(1) : filteredData;

    return (
        <PublicLayout>
            <Head title="Warta & Informasi Desa — Desa Tlangoh" />

            {/* ─── 2. HERO HEADER SECTION ─── */}
            <div className="relative bg-gradient-to-b from-stone-950 via-emerald-950 to-stone-900 text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

                <div className="relative max-w-4xl mx-auto text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-sm">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Kanal Informasi Resmi Warga</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                        Warta & Pengumuman Desa Tlangoh
                    </h1>

                    <p className="text-stone-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                        Transparansi pembangunan, siaran pers kepala desa, agenda kegiatan masyarakat, serta pengumuman penting bagi seluruh warga Desa Tlangoh.
                    </p>

                    {/* Search Bar */}
                    <div className="pt-4 max-w-xl mx-auto">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                            <input
                                type="text"
                                placeholder="Cari berita, agenda, atau surat pengumuman..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 text-sm bg-white/10 border border-white/20 rounded-2xl text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white/15 backdrop-blur-md transition-all shadow-lg"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-white bg-white/10 px-2 py-0.5 rounded-md"
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
                {/* ─── 3. CATEGORY FILTER TABS ─── */}
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={cn(
                            'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs',
                            selectedCategory === 'all'
                                ? 'bg-emerald-700 text-white shadow-md shadow-emerald-900/20'
                                : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                        )}
                    >
                        <Newspaper className="w-4 h-4" />
                        <span>Semua Warta</span>
                    </button>

                    {categories.map((cat) => {
                        const Icon = categoryIcons[cat] || Tag;
                        const isSelected = selectedCategory === cat;
                        const label = cat === 'berita' ? 'Berita Desa' :
                                      cat === 'pengumuman' ? 'Pengumuman' :
                                      cat === 'agenda' ? 'Agenda Acara' : cat;

                        return (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={cn(
                                    'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all capitalize shadow-xs',
                                    isSelected
                                        ? 'bg-emerald-700 text-white shadow-md shadow-emerald-900/20'
                                        : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* ─── 4. FEATURED ARTICLE SPOTLIGHT (JIKA ADA & PILIH SEMUA) ─── */}
                {featuredArticle && (
                    <div className="mb-12">
                        <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-emerald-800">
                            <Flame className="w-4 h-4 text-amber-500" />
                            <span>Sorotan Berita Terkini</span>
                        </div>

                        <article className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 grid lg:grid-cols-12 gap-0">
                            <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto overflow-hidden bg-slate-100 min-h-[280px]">
                                {featuredArticle.cover_image ? (
                                    <img
                                        src={featuredArticle.cover_image.startsWith('http') ? featuredArticle.cover_image : `/storage/${featuredArticle.cover_image}`}
                                        alt={featuredArticle.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-emerald-800 to-slate-900 flex items-center justify-center text-white/40">
                                        <Newspaper className="w-16 h-16" />
                                    </div>
                                )}
                                <div className="absolute top-4 left-4">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-white/95 backdrop-blur-md shadow-sm border border-slate-200 text-slate-900">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                        {featuredArticle.category}
                                    </span>
                                </div>
                            </div>

                            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                                        <span className="flex items-center gap-1.5 text-slate-500">
                                            <Calendar className="w-4 h-4 text-emerald-600" />
                                            {formatDate(featuredArticle.published_at)}
                                        </span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1.5">
                                            <Eye className="w-4 h-4 text-slate-400" />
                                            {featuredArticle.views} Kali Dibaca
                                        </span>
                                    </div>

                                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 leading-tight group-hover:text-emerald-700 transition-colors">
                                        <Link href={`/berita/${featuredArticle.slug}`}>
                                            {featuredArticle.title}
                                        </Link>
                                    </h2>

                                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                                        {featuredArticle.excerpt}
                                    </p>
                                </div>

                                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                                            {featuredArticle.author?.name ? featuredArticle.author.name.charAt(0) : 'A'}
                                        </div>
                                        <span className="text-xs font-semibold text-slate-700">
                                            {featuredArticle.author?.name || 'Admin Desa Tlangoh'}
                                        </span>
                                    </div>

                                    <Link
                                        href={`/berita/${featuredArticle.slug}`}
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all hover:gap-2.5"
                                    >
                                        <span>Baca Artikel</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </div>
                        </article>
                    </div>
                )}

                {/* ─── 5. ARTICLES GRID (3 KOLOM) ─── */}
                {remainingArticles.length === 0 && !featuredArticle ? (
                    <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 max-w-lg mx-auto p-8 space-y-4 shadow-xs">
                        <Newspaper className="w-12 h-12 text-slate-300 mx-auto" />
                        <h3 className="font-bold text-slate-800 text-lg">Tidak Ada Warta yang Ditemukan</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            {searchQuery
                                ? `Tidak ditemukan warta dengan kata kunci "${searchQuery}". Coba kata kunci lainnya.`
                                : 'Belum ada warta untuk kategori ini. Warta baru akan segera dipublikasikan.'}
                        </p>
                        {auth?.user && (
                            <Link
                                href="/admin/berita/create"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold shadow-xs"
                            >
                                <Plus className="w-4 h-4" />
                                Tulis Berita Pertama
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {remainingArticles.map((item) => {
                            const badgeConfig = categoryBadgeStyle[item.category] || {
                                bg: 'bg-slate-100 text-slate-800',
                                text: item.category,
                                border: 'border-slate-200'
                            };

                            return (
                                <article
                                    key={item.id}
                                    className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-200 transition-all duration-300 flex flex-col justify-between group"
                                >
                                    <div>
                                        {/* Thumbnail Box */}
                                        <div className="aspect-[16/10] bg-slate-100 overflow-hidden relative">
                                            {item.cover_image ? (
                                                <img
                                                    src={item.cover_image.startsWith('http') ? item.cover_image : `/storage/${item.cover_image}`}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-emerald-900/90 via-emerald-800 to-slate-900 flex items-center justify-center p-6 text-emerald-100/40">
                                                    <Newspaper className="w-12 h-12" />
                                                </div>
                                            )}

                                            <div className="absolute top-3 left-3">
                                                <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold uppercase tracking-wider backdrop-blur-md shadow-xs border', badgeConfig.bg, badgeConfig.border)}>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                                    {item.category}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Card Content */}
                                        <div className="p-6">
                                            <div className="flex items-center gap-3 text-xs text-slate-400 font-medium mb-3">
                                                <span className="flex items-center gap-1 text-slate-500">
                                                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                                                    {formatDate(item.published_at)}
                                                </span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                                                    <Eye className="w-3.5 h-3.5" />
                                                    {item.views}
                                                </span>
                                            </div>

                                            <h2 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2 mb-2">
                                                <Link href={`/berita/${item.slug}`}>
                                                    {item.title}
                                                </Link>
                                            </h2>

                                            <p className="text-slate-600 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                                                {item.excerpt}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Card Footer */}
                                    <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                        <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium truncate max-w-[150px]">
                                            <User className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                            <span className="truncate">{item.author?.name || 'Admin'}</span>
                                        </span>

                                        <Link
                                            href={`/berita/${item.slug}`}
                                            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                                        >
                                            <span>Detail Warta</span>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}

                {/* ─── 6. PAGINATION ─── */}
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
                                            ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
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
