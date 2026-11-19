import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import {
    Calendar, Eye, ArrowLeft, Share2,
    Check, Copy, Clock, Building2
} from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { useState } from 'react';

interface NewsItem {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    body: string;
    cover_image: string | null;
    category: 'berita' | 'pengumuman' | 'agenda';
    views: number;
    published_at: string;
    author?: {
        name: string;
    };
}

interface Props {
    article: NewsItem;
    related: NewsItem[];
}

export default function NewsShow({ article, related = [] }: Props) {
    const [copied, setCopied] = useState(false);

    const handleCopyLink = () => {
        if (typeof window !== 'undefined') {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleShareWhatsapp = () => {
        if (typeof window !== 'undefined') {
            const url = encodeURIComponent(window.location.href);
            const text = encodeURIComponent(`*${article.title}*\n\nBaca warta selengkapnya dari Desa Tlangoh:\n${window.location.href}`);
            window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
        }
    };

    const categoryBadgeStyle: Record<string, string> = {
        berita: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        pengumuman: 'bg-amber-50 text-amber-800 border-amber-200',
        agenda: 'bg-blue-50 text-blue-800 border-blue-200',
    };

    const readTimeMinutes = Math.max(1, Math.ceil((article.body?.replace(/<[^>]+>/g, '').length || 100) / 450));

    return (
        <PublicLayout>
            <Head>
                <title>{`${article.title} — Desa Tlangoh`}</title>
                <meta name="description" content={article.excerpt || article.title} />
            </Head>

            {/* Breadcrumb Navigation */}
            <div className="bg-slate-50 border-b border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs">
                    <Link
                        href="/berita"
                        className="inline-flex items-center gap-2 font-semibold text-slate-600 hover:text-emerald-700 transition"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Kembali ke Kabar Desa</span>
                    </Link>

                    <div className="hidden sm:flex items-center gap-2 text-slate-400">
                        <span>Beranda</span>
                        <span>/</span>
                        <Link href="/berita" className="hover:text-emerald-700">Warta</Link>
                        <span>/</span>
                        <span className="text-slate-600 font-medium capitalize">{article.category}</span>
                    </div>
                </div>
            </div>

            {/* Main Article Layout */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Left Column: Article Body (8 Cols) */}
                    <article className="lg:col-span-8">
                        {/* Meta Tags & Category */}
                        <div className="space-y-4 mb-6">
                            <div className="flex flex-wrap items-center gap-2.5">
                                <span
                                    className={cn(
                                        'px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider border shadow-2xs',
                                        categoryBadgeStyle[article.category] || 'bg-slate-100 text-slate-800 border-slate-200'
                                    )}
                                >
                                    {article.category}
                                </span>

                                <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                                    <span className="flex items-center gap-1.5 text-slate-600">
                                        <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                                        {formatDate(article.published_at)}
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                                        {readTimeMinutes} Menit Baca
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1.5">
                                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                                        {article.views} Kali Dibaca
                                    </span>
                                </div>
                            </div>

                            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-[1.2] tracking-tight">
                                {article.title}
                            </h1>

                            {/* Author Card & Social Share */}
                            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 pb-4 border-y border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm shadow-xs border border-emerald-200/60">
                                        {article.author?.name ? article.author.name.charAt(0) : 'A'}
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-900">{article.author?.name || 'Admin Desa Tlangoh'}</div>
                                        <div className="text-xs text-slate-400">Pemerintah Desa Tlangoh, Bangkalan</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleShareWhatsapp}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold transition-colors"
                                        title="Bagikan ke WhatsApp"
                                    >
                                        <Share2 className="w-3.5 h-3.5" />
                                        <span>WhatsApp</span>
                                    </button>
                                    <button
                                        onClick={handleCopyLink}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                                        title="Salin Tautan"
                                    >
                                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                        <span>{copied ? 'Tersalin!' : 'Salin'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Featured Image */}
                        {article.cover_image && (
                            <div className="mb-8 rounded-3xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
                                <img
                                    src={article.cover_image.startsWith('http') ? article.cover_image : `/storage/${article.cover_image}`}
                                    alt={article.title}
                                    className="w-full h-auto max-h-[500px] object-cover"
                                />
                            </div>
                        )}

                        {/* Excerpt Lead */}
                        {article.excerpt && (
                            <div className="p-5 rounded-2xl bg-emerald-50/70 border-l-4 border-emerald-600 text-emerald-950 font-medium text-base sm:text-lg leading-relaxed mb-8">
                                {article.excerpt}
                            </div>
                        )}

                        {/* Article HTML Content */}
                        <div
                            className="prose prose-slate lg:prose-lg max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:leading-relaxed prose-a:text-emerald-600 hover:prose-a:text-emerald-700 prose-img:rounded-2xl prose-img:shadow-md"
                            dangerouslySetInnerHTML={{ __html: article.body }}
                        />

                        {/* Bottom Share & Feedback Bar */}
                        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                            <div className="text-xs text-slate-500">
                                Diterbitkan secara resmi oleh <strong>Pemerintah Desa Tlangoh</strong>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleShareWhatsapp}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
                                >
                                    <Share2 className="w-3.5 h-3.5" />
                                    <span>Bagikan Warta Ini</span>
                                </button>
                            </div>
                        </div>
                    </article>

                    {/* Right Column: Sidebar (4 Cols) */}
                    <aside className="lg:col-span-4 space-y-6">
                        {/* Box 1: Layanan Warga Cepat */}
                        <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white p-6 rounded-3xl shadow-md border border-emerald-900/40">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 mb-4">
                                <Building2 className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-lg text-white mb-1.5">Layanan Mandiri Warga</h3>
                            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed mb-5">
                                Butuh surat pengantar resmi kelurahan atau ingin melacak tiket permohonan Anda?
                            </p>
                            <div className="space-y-2.5">
                                <Link
                                    href="/layanan-surat"
                                    className="block w-full text-center py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm"
                                >
                                    Ajukan Surat Online
                                </Link>
                                <Link
                                    href="/layanan-surat/lacak"
                                    className="block w-full text-center py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/20 transition"
                                >
                                    Lacak Permohonan
                                </Link>
                            </div>
                        </div>

                        {/* Box 2: Berita & Pengumuman Lainnya */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
                            <h3 className="font-bold text-slate-900 text-base mb-4 flex items-center justify-between">
                                <span>Warta Terkait Lainnya</span>
                                <Link href="/berita" className="text-xs text-emerald-700 hover:underline">
                                    Semua
                                </Link>
                            </h3>

                            <div className="space-y-4">
                                {related.length > 0 ? (
                                    related.map((item) => (
                                        <Link
                                            key={item.id}
                                            href={`/berita/${item.slug}`}
                                            className="group block space-y-1.5 pb-4 border-b border-slate-100 last:border-0 last:pb-0"
                                        >
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                                                {item.category}
                                            </span>
                                            <h4 className="text-sm font-semibold text-slate-800 group-hover:text-emerald-700 transition line-clamp-2 leading-snug">
                                                {item.title}
                                            </h4>
                                            <span className="text-xs text-slate-400 block">
                                                {formatDate(item.published_at)}
                                            </span>
                                        </Link>
                                    ))
                                ) : (
                                    <p className="text-xs text-slate-400 py-2">Belum ada warta terkait lainnya.</p>
                                )}
                            </div>
                        </div>

                        {/* Box 3: Kontak Resmi Kantor Desa */}
                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 text-xs text-slate-600 space-y-3">
                            <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-emerald-600" />
                                <span>Kantor Desa Tlangoh</span>
                            </div>
                            <p className="leading-relaxed">
                                Jl. Raya Pantai Tlangoh, Kec. Tanjungbumi, Kab. Bangkalan, Jawa Timur.
                            </p>
                            <div className="pt-2 border-t border-slate-200/70 space-y-1.5 text-slate-500">
                                <div><strong>Pelayanan:</strong> Senin – Jumat, 08.00 – 15.00 WIB</div>
                                <div><strong>Call Center:</strong> (031) 8899-7700</div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </PublicLayout>
    );
}
