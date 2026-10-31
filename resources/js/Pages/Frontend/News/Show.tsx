import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Calendar, Eye, User, ArrowLeft, ArrowRight, Share2, Tag, Check, Copy } from 'lucide-react';
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

export default function NewsShow({ article, related }: Props) {
    const [copied, setCopied] = useState(false);

    const handleCopyLink = () => {
        if (typeof window !== 'undefined') {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const categoryBadgeStyle: Record<string, string> = {
        berita: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        pengumuman: 'bg-amber-50 text-amber-800 border-amber-200',
        agenda: 'bg-blue-50 text-blue-800 border-blue-200',
    };

    return (
        <PublicLayout>
            <Head>
                <title>{`${article.title} — Desa Tlangoh`}</title>
                <meta name="description" content={article.excerpt} />
            </Head>

            {/* Breadcrumb / Back button */}
            <div className="bg-slate-50 border-b border-slate-200/80">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Link
                        href="/berita"
                        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-emerald-700 transition"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Kembali ke Kabar Desa
                    </Link>
                </div>
            </div>

            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
                {/* Meta & Title */}
                <div className="space-y-4 mb-8">
                    <div className="flex flex-wrap items-center gap-3">
                        <span
                            className={cn(
                                'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border',
                                categoryBadgeStyle[article.category] || 'bg-slate-100 text-slate-800 border-slate-200'
                            )}
                        >
                            {article.category}
                        </span>

                        <div className="flex items-center gap-3 text-xs text-slate-500">
                            <span className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                                {formatDate(article.published_at)}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1.5">
                                <Eye className="w-3.5 h-3.5 text-slate-400" />
                                {article.views} Kali Dibaca
                            </span>
                        </div>
                    </div>

                    <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 font-serif leading-tight">
                        {article.title}
                    </h1>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                                {article.author?.name ? article.author.name.charAt(0) : 'A'}
                            </div>
                            <div>
                                <span className="text-xs text-slate-400 block">Diterbitkan oleh</span>
                                <span className="font-semibold text-slate-800 text-sm">
                                    {article.author?.name || 'Pemerintah Desa Tlangoh'}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={handleCopyLink}
                            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition shadow-2xs"
                        >
                            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            {copied ? 'Tautan Disalin!' : 'Bagikan'}
                        </button>
                    </div>
                </div>

                {/* Cover Image */}
                {article.cover_image && (
                    <div className="mb-10 rounded-3xl overflow-hidden border border-slate-200/80 shadow-md">
                        <img
                            src={article.cover_image.startsWith('http') ? article.cover_image : `/storage/${article.cover_image}`}
                            alt={article.title}
                            className="w-full max-h-[480px] object-cover"
                        />
                    </div>
                )}

                {/* Excerpt Lead */}
                <div className="text-lg text-slate-700 font-medium leading-relaxed border-l-4 border-emerald-600 pl-4 py-1 mb-8 italic bg-emerald-50/30 rounded-r-xl">
                    {article.excerpt}
                </div>

                {/* Body Content */}
                <div
                    className="prose prose-slate max-w-none prose-emerald prose-p:leading-relaxed prose-headings:font-serif prose-headings:text-slate-900 prose-img:rounded-2xl"
                    dangerouslySetInnerHTML={{ __html: article.body }}
                />

                {/* Footer of Article */}
                <div className="mt-14 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-slate-500">
                        Bagikan informasi ini kepada keluarga dan warga Desa Tlangoh lainnya.
                    </p>
                    <button
                        onClick={handleCopyLink}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition"
                    >
                        <Share2 className="w-3.5 h-3.5" />
                        Salin Tautan Berita
                    </button>
                </div>
            </article>

            {/* Related Articles */}
            {related.length > 0 && (
                <div className="bg-slate-50 border-t border-slate-200/80 py-14">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                        <div>
                            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                                Kabar Lainnya
                            </span>
                            <h3 className="text-2xl font-bold font-serif text-slate-900 mt-1">
                                Informasi Terkait
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {related.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/berita/${item.slug}`}
                                    className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition group flex flex-col justify-between"
                                >
                                    <div className="space-y-2.5">
                                        <div className="text-xs text-slate-400">
                                            {formatDate(item.published_at)}
                                        </div>
                                        <h4 className="font-bold text-slate-900 group-hover:text-emerald-700 transition leading-snug font-serif">
                                            {item.title}
                                        </h4>
                                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                            {item.excerpt}
                                        </p>
                                    </div>

                                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
                                        <span>Baca Artikel</span>
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}
