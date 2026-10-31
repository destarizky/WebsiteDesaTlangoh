import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { useState } from 'react';
import {
    ArrowRight, Users, MapPin, Home as HomeIcon, FileText, MessageSquare,
    BarChart3, TrendingUp, Landmark, ChevronRight, Clock,
    Leaf, TreePine, Waves, ShieldCheck, CheckCircle2, Building2,
    Sparkles, PhoneCall, Compass, Search, ExternalLink,
    FileCheck2, BadgeCheck, CalendarDays, ArrowUpRight
} from 'lucide-react';
import { formatDate, formatRupiah } from '@/lib/utils';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer
} from 'recharts';

interface NewsItem {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    cover_image: string | null;
    category: string;
    published_at: string;
    author?: { name: string };
}

interface ApbdesItem {
    id: number;
    category: string;
    description: string;
    budgeted_amount: number;
    realized_amount: number;
    type: string;
}

interface UmkmItem {
    id: number;
    name: string;
    slug: string;
    type: string;
    description: string;
    cover_image: string | null;
    owner_name: string;
    phone?: string | null;
    price_from: number | null;
    price_to?: number | null;
}

interface Props {
    featuredNews: NewsItem | null;
    latestNews: NewsItem[];
    announcements: NewsItem[];
    apbdesSummary: Record<string, ApbdesItem[]>;
    umkmFeatured: UmkmItem[];
    stats: {
        penduduk: number;
        kk: number;
        luas_wilayah: string;
        dusun: number;
        rt: number;
        rw: number;
    };
}

const categoryBadgeColors: Record<string, string> = {
    berita: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    pengumuman: 'bg-amber-50 text-amber-700 border border-amber-200/60',
    agenda: 'bg-sky-50 text-sky-700 border border-sky-200/60',
};

const typeLabels: Record<string, { label: string; icon: string; bg: string }> = {
    produk: { label: 'Produk Lokal', icon: '🛍️', bg: 'bg-amber-50 text-amber-800' },
    kuliner: { label: 'Kuliner & Olahan', icon: '🍲', bg: 'bg-orange-50 text-orange-800' },
    kerajinan: { label: 'Batik & Kerajinan', icon: '🎨', bg: 'bg-purple-50 text-purple-800' },
    wisata: { label: 'Wisata Bahari', icon: '🏖️', bg: 'bg-teal-50 text-teal-800' },
    jasa: { label: 'Jasa & Servis', icon: '🔧', bg: 'bg-blue-50 text-blue-800' },
};

const quickServices = [
    {
        title: 'Buat Surat Online',
        desc: 'Permohonan surat keterangan, domisili, SKU, dan SKTM langsung dari rumah.',
        href: '/layanan-surat',
        badge: 'Cepat & Mandiri',
        icon: FileText,
        accent: 'text-emerald-700 bg-emerald-100/80 group-hover:bg-emerald-700 group-hover:text-white',
    },
    {
        title: 'Lacak Status Surat',
        desc: 'Pantau progres verifikasi dokumen secara transparan menggunakan nomor tiket resi.',
        href: '/layanan-surat/lacak',
        badge: 'Cek Realtime',
        icon: Clock,
        accent: 'text-teal-700 bg-teal-100/80 group-hover:bg-teal-700 group-hover:text-white',
    },
    {
        title: 'Lapor & Pengaduan',
        desc: 'Sampaikan aspirasi, keluhan fasilitas umum, atau masukan membangun untuk aparatur desa.',
        href: '/pengaduan',
        badge: 'Respon Cepat',
        icon: MessageSquare,
        accent: 'text-amber-700 bg-amber-100/80 group-hover:bg-amber-700 group-hover:text-white',
    },
    {
        title: 'Transparansi APBDes',
        desc: 'Laporan terbuka alokasi pendapatan, belanja, serta pembangunan desa tahun anggaran berjalan.',
        href: '/apbdes',
        badge: 'Akuntabel & Terbuka',
        icon: BarChart3,
        accent: 'text-blue-700 bg-blue-100/80 group-hover:bg-blue-700 group-hover:text-white',
    },
];

const popularLetters = [
    {
        name: 'Surat Keterangan Usaha (SKU)',
        desc: 'Keperluan perizinan, kredit perbankan, dan bantuan UMKM',
        time: '1 Hari Kerja',
        type: 'usaha',
    },
    {
        name: 'Surat Keterangan Domisili (SKD)',
        desc: 'Bukti domisili resmi kependudukan perorangan maupun lembaga',
        time: '1 Hari Kerja',
        type: 'domisili',
    },
    {
        name: 'Surat Keterangan Tidak Mampu (SKTM)',
        desc: 'Persyaratan beasiswa, KIS, dan keringanan biaya pengobatan',
        time: '1 Hari Kerja',
        type: 'sktm',
    },
    {
        name: 'Surat Pengantar SKCK / Kependudukan',
        desc: 'Pengantar permohonan SKCK kepolisian atau administrasi Dispenduk',
        time: '1 Hari Kerja',
        type: 'pengantar',
    },
];

export default function Home({
    featuredNews,
    latestNews,
    announcements,
    apbdesSummary,
    umkmFeatured,
    stats
}: Props) {
    const [selectedCategory, setSelectedCategory] = useState<'all' | 'berita' | 'pengumuman' | 'agenda'>('all');
    const [searchTicket, setSearchTicket] = useState('');

    const currentYear = new Date().getFullYear();

    // Kalkulasi ringkasan APBDes
    const pendapatanTotal = apbdesSummary['pendapatan']?.reduce((acc, item) => acc + Number(item.budgeted_amount), 0) ?? 0;
    const belanjaTotal = apbdesSummary['belanja']?.reduce((acc, item) => acc + Number(item.budgeted_amount), 0) ?? 0;
    const pendapatanReal = apbdesSummary['pendapatan']?.reduce((acc, item) => acc + Number(item.realized_amount), 0) ?? 0;
    const belanjaReal = apbdesSummary['belanja']?.reduce((acc, item) => acc + Number(item.realized_amount), 0) ?? 0;

    const persenPendapatan = pendapatanTotal > 0 ? Math.min((pendapatanReal / pendapatanTotal) * 100, 100) : 0;
    const persenBelanja = belanjaTotal > 0 ? Math.min((belanjaReal / belanjaTotal) * 100, 100) : 0;

    const apbdesChartData = [
        { name: 'Pendapatan', anggaran: +(pendapatanTotal / 1e6).toFixed(1), realisasi: +(pendapatanReal / 1e6).toFixed(1) },
        { name: 'Belanja', anggaran: +(belanjaTotal / 1e6).toFixed(1), realisasi: +(belanjaReal / 1e6).toFixed(1) },
    ];

    // Gabungkan berita & filter
    const allArticles = [
        ...(featuredNews ? [featuredNews] : []),
        ...latestNews,
        ...announcements,
    ].filter((item, index, self) => index === self.findIndex((t) => t.id === item.id));

    const filteredArticles = selectedCategory === 'all'
        ? allArticles
        : allArticles.filter((item) => item.category === selectedCategory);

    const mainArticle = filteredArticles[0] || featuredNews;
    const secondaryArticles = filteredArticles.slice(1, 4);

    return (
        <PublicLayout>
            <Head title="Website Resmi Desa Tlangoh — Mandiri, Maju & Transparan" />

            {/* ─── 1. HERO SECTION (ALAM & IDENTITAS RESMI DESA) ─── */}
            <section className="relative min-h-[640px] lg:min-h-[720px] flex items-center justify-center overflow-hidden bg-emerald-950 text-white">
                {/* Background Image: Lanskap Pesisir & Alam Tropis Desa */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transform motion-safe:animate-fade-in"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=2000&q=80')`,
                    }}
                />

                {/* Multi-layered Realistic Gradient (Deep Forest + Warm Sunset Edge) */}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/85 to-emerald-950/70" />
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-950/75 to-transparent" />

                {/* Subtle Traditional Batik / Geometric Texture */}
                <div
                    className="absolute inset-0 opacity-[0.035] pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                        backgroundSize: '32px 32px',
                    }}
                />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-28 lg:pt-36 lg:pb-32 w-full">
                    <div className="max-w-3xl">
                        {/* Official Badge */}
                        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-medium text-emerald-200 mb-6 shadow-sm">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span>🇮🇩 Pemerintah Kabupaten Bangkalan • Kecamatan Tanjungbumi</span>
                        </div>

                        {/* Main Headline */}
                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15] mb-6">
                            Portal Resmi & <br className="hidden sm:inline" />
                            Pelayanan Warga <br />
                            <span className="text-emerald-300 underline decoration-emerald-400/50 decoration-wavy decoration-2">
                                Desa Tlangoh
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-base sm:text-lg text-emerald-50/90 leading-relaxed font-normal mb-8 max-w-2xl">
                            Selamat datang di pusat layanan digital Desa Tlangoh. Mengurus surat pengantar mandiri, memantau transparansi anggaran pembangunan, serta menjelajahi keindahan wisata bahari dan ragam produk UMKM unggulan warga.
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-3.5 mb-10">
                            <Link
                                href="/layanan-surat"
                                className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm sm:text-base rounded-xl transition-all shadow-lg shadow-emerald-950/40 hover:-translate-y-0.5 active:translate-y-0"
                            >
                                <FileText className="w-5 h-5 text-emerald-100" />
                                <span>Ajukan Surat Online</span>
                                <ArrowRight className="w-4 h-4 ml-0.5" />
                            </Link>

                            <Link
                                href="/layanan-surat/lacak"
                                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-medium text-sm sm:text-base rounded-xl border border-white/25 backdrop-blur-md transition-all hover:-translate-y-0.5 active:translate-y-0"
                            >
                                <Clock className="w-4 h-4 text-emerald-300" />
                                <span>Lacak Permohonan</span>
                            </Link>
                        </div>

                        {/* Status Pelayanan Desa Info */}
                        <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-emerald-100/80 pt-4 border-t border-white/10">
                            <div className="flex items-center gap-2">
                                <BadgeCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>Layanan Mandiri Warga 24 Jam</span>
                            </div>
                            <span className="hidden sm:inline text-white/30">•</span>
                            <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>Kantor Desa: Senin – Kamis 08.00–15.00 WIB | Jumat 08.00–11.30 WIB</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Curve Divider into content */}
                <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-stone-100 to-transparent pointer-events-none" />
            </section>

            {/* ─── 2. FLOATING QUICK-ACCESS DOCK (LAYANAN MANDIRI WARGA) ─── */}
            <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-14 sm:-mt-16">
                <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl shadow-stone-900/10 border border-stone-200/80 p-4 sm:p-6 lg:p-7">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-5 border-b border-stone-100">
                        <div>
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-md mb-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-emerald-700" /> Layanan Cepat Desa
                            </span>
                            <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
                                Akses Layanan Terpadu Warga
                            </h2>
                        </div>

                        {/* Input Cepat Lacak Surat */}
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (searchTicket.trim()) {
                                    window.location.href = `/layanan-surat/lacak?ticket=${encodeURIComponent(searchTicket.trim())}`;
                                }
                            }}
                            className="flex items-center gap-2 max-w-md w-full md:w-auto"
                        >
                            <div className="relative flex-1">
                                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={searchTicket}
                                    onChange={(e) => setSearchTicket(e.target.value)}
                                    placeholder="Masukkan No. Tiket Surat..."
                                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-stone-50/60"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors shrink-0"
                            >
                                Cari Tiket
                            </button>
                        </form>
                    </div>

                    {/* Grid 4 Layanan */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                        {quickServices.map((service) => (
                            <Link
                                key={service.href}
                                href={service.href}
                                className="group flex flex-col justify-between p-5 rounded-2xl border border-stone-100 bg-stone-50/40 hover:bg-white hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-950/5 transition-all duration-300 hover:-translate-y-1"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${service.accent}`}>
                                            <service.icon className="w-5 h-5" />
                                        </div>
                                        <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                                            {service.badge}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-stone-900 group-hover:text-emerald-800 transition-colors text-base mb-1.5">
                                        {service.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                                        {service.desc}
                                    </p>
                                </div>

                                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-1 text-xs font-semibold text-emerald-800 group-hover:text-emerald-900">
                                    <span>Buka Layanan</span>
                                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── 3. SAMBUTAN KEPALA DESA & PROFIL SINGKAT ─── */}
            <section className="py-20 lg:py-24 bg-stone-100/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                        {/* Kolom Kiri: Profil & Sambutan Kepala Desa */}
                        <div className="lg:col-span-5">
                            <div className="relative">
                                {/* Decorative backdrop element */}
                                <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-600/15 to-teal-500/15 rounded-3xl transform -rotate-1 pointer-events-none" />

                                <div className="relative bg-white rounded-2xl sm:rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-sm">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-stone-100 border-2 border-emerald-600/30 shrink-0 shadow-inner">
                                            <img
                                                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
                                                alt="Kepala Desa Tlangoh"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <div className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded mb-1">
                                                <BadgeCheck className="w-3 h-3 text-emerald-700" /> Sambutan Resmi
                                            </div>
                                            <h3 className="text-lg sm:text-xl font-bold text-stone-900 leading-snug">
                                                H. Moh. Hasan, S.Pd
                                            </h3>
                                            <p className="text-xs sm:text-sm text-stone-600 font-medium">
                                                Kepala Desa Tlangoh (2020 – 2026)
                                            </p>
                                        </div>
                                    </div>

                                    <blockquote className="text-sm sm:text-base text-stone-700 italic leading-relaxed border-l-2 border-emerald-600 pl-4 mb-6">
                                        “Pemanfaatan website desa ini kami hadirkan sebagai wujud komitmen keterbukaan informasi publik dan peningkatan mutu pelayanan. Warga Desa Tlangoh kini dapat mengurus administrasi secara cepat, transparan, dan bermartabat tanpa membedakan status sosial.”
                                    </blockquote>

                                    <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                                        <div className="text-xs text-stone-500">
                                            Pemerintah Desa Tlangoh, Tanjungbumi
                                        </div>
                                        <a
                                            href="https://wa.me/6281234567890"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-900"
                                        >
                                            <PhoneCall className="w-3.5 h-3.5 text-emerald-700" /> Kontak Langsung
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Kolom Kanan: Profil Desa & 3 Pilar Unggulan */}
                        <div className="lg:col-span-7">
                            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-md">
                                Tentang Desa Tlangoh
                            </span>
                            <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 mt-3 mb-5 leading-tight">
                                Desa Maritim yang Ramah, Mandiri, dan Berbudaya Luhur
                            </h2>
                            <p className="text-stone-700 text-sm sm:text-base leading-relaxed mb-8">
                                Desa Tlangoh terletak di pesisir utara Kabupaten Bangkalan, Madura. Dengan potensi alam pantai yang memesona, sentra pengrajin batik tulis khas Madura, serta perkebunan rakyat yang subur, kami terus berikhtiar memajukan kesejahteraan seluruh warga desa melalui sinergi aparatur, tokoh masyarakat, dan generasi muda.
                            </p>

                            {/* 3 Pilar */}
                            <div className="space-y-4 mb-8">
                                {[
                                    {
                                        title: 'Pelayanan Cepat & Transparan',
                                        desc: 'Pengurusan surat menyurat dilakukan secara terstruktur, gratis, dan dapat dipantau langsung lewat portal digital.',
                                        icon: ShieldCheck,
                                    },
                                    {
                                        title: 'Kekayaan Wisata Pantai & Bahari',
                                        desc: 'Destinasi Pantai Tlangoh menjadi primadona wisata alam keluarga yang menggerakkan perputaran ekonomi warga pesisir.',
                                        icon: Waves,
                                    },
                                    {
                                        title: 'Sentra UMKM & Kerajinan Batik Madura',
                                        desc: 'Dukungan penuh untuk produk olahan kuliner, nelayan tangkap, dan karya batik tulis khas warisan leluhur desa.',
                                        icon: Leaf,
                                    },
                                ].map((pilar) => (
                                    <div key={pilar.title} className="flex items-start gap-4 p-4 rounded-xl bg-white border border-stone-200/60 shadow-sm">
                                        <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                                            <pilar.icon className="w-5 h-5 text-emerald-800" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-stone-900 text-sm sm:text-base">{pilar.title}</h4>
                                            <p className="text-xs sm:text-sm text-stone-600 mt-0.5 leading-relaxed">{pilar.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-wrap items-center gap-4">
                                <Link
                                    href="/potensi-umkm"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-sm font-semibold transition-colors"
                                >
                                    <Compass className="w-4 h-4 text-emerald-400" />
                                    <span>Jelajahi Potensi & Wisata Desa</span>
                                </Link>
                                <Link
                                    href="/berita"
                                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-800 hover:text-emerald-900 hover:underline"
                                >
                                    <span>Baca Sejarah & Informasi Desa</span>
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── 4. STATISTIK DEMOGRAFI & WILAYAH (HUMAN & CLEAN) ─── */}
            <section className="py-16 bg-emerald-950 text-white relative overflow-hidden">
                {/* Decorative subtle map texture */}
                <div
                    className="absolute inset-0 opacity-5 pointer-events-none"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">
                            Data Kependudukan
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
                            Kilas Data & Demografi Desa Tlangoh
                        </h2>
                        <p className="text-xs sm:text-sm text-emerald-200/80 mt-2">
                            Pembaruan data sensus kependudukan dan kewilayahan semester berjalan
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                        {[
                            {
                                label: 'Total Penduduk',
                                value: stats.penduduk.toLocaleString('id-ID'),
                                sub: 'Jiwa Terdaftar',
                                icon: Users,
                                color: 'text-emerald-300',
                            },
                            {
                                label: 'Kepala Keluarga',
                                value: stats.kk.toLocaleString('id-ID'),
                                sub: 'Kartu Keluarga Aktif',
                                icon: HomeIcon,
                                color: 'text-teal-300',
                            },
                            {
                                label: 'Luas Wilayah',
                                value: stats.luas_wilayah,
                                sub: 'Daratan & Pesisir',
                                icon: MapPin,
                                color: 'text-amber-300',
                            },
                            {
                                label: 'Wilayah Dusun',
                                value: `${stats.dusun} Dusun`,
                                sub: `${stats.rw} RW • ${stats.rt} RT`,
                                icon: TreePine,
                                color: 'text-sky-300',
                            },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-sm transition-all duration-300 text-center flex flex-col items-center justify-center group"
                            >
                                <div className={`w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${stat.color}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <div className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-1">
                                    {stat.value}
                                </div>
                                <div className="text-xs sm:text-sm font-semibold text-emerald-200">
                                    {stat.label}
                                </div>
                                <div className="text-[11px] text-emerald-300/70 mt-0.5">
                                    {stat.sub}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── 5. PILIHAN LAYANAN SURAT TERPOPULER ─── */}
            <section className="py-20 bg-stone-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
                        <div>
                            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-md">
                                Layanan Mandiri
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2">
                                Surat yang Paling Sering Diajukan Warga
                            </h2>
                            <p className="text-stone-600 text-xs sm:text-sm mt-1">
                                Pilih jenis surat di bawah ini untuk memulai pengisian data secara mandiri
                            </p>
                        </div>

                        <Link
                            href="/layanan-surat"
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-800 hover:text-emerald-900 hover:underline shrink-0"
                        >
                            <span>Lihat Semua Jenis Surat</span>
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {popularLetters.map((letter) => (
                            <div
                                key={letter.name}
                                className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between"
                            >
                                <div>
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                                        <FileCheck2 className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-bold text-stone-900 text-base mb-2 leading-snug">
                                        {letter.name}
                                    </h3>
                                    <p className="text-xs text-stone-600 leading-relaxed mb-4">
                                        {letter.desc}
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                                    <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                                        <Clock className="w-3 h-3 text-emerald-700" /> {letter.time}
                                    </div>

                                    <Link
                                        href={`/layanan-surat?type=${letter.type}`}
                                        className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 inline-flex items-center gap-1"
                                    >
                                        <span>Ajukan</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── 6. KABAR & AGENDA DESA TERKINI ─── */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                        <div>
                            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-md">
                                Warta & Informasi
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2">
                                Berita & Pengumuman Desa
                            </h2>
                            <p className="text-stone-600 text-xs sm:text-sm mt-1">
                                Informasi pembangunan, kegiatan aparatur, serta agenda penting kemasyarakatan
                            </p>
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl self-start sm:self-auto">
                            {(['all', 'berita', 'pengumuman', 'agenda'] as const).map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize ${selectedCategory === cat
                                            ? 'bg-white text-emerald-900 shadow-sm'
                                            : 'text-stone-700 hover:text-stone-900'
                                        }`}
                                >
                                    {cat === 'all' ? 'Semua' : cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {mainArticle ? (
                        <div className="grid lg:grid-cols-12 gap-8 items-start">
                            {/* Featured Article Card */}
                            <div className="lg:col-span-7">
                                <Link
                                    href={`/berita/${mainArticle.slug}`}
                                    className="group block bg-stone-50 rounded-2xl sm:rounded-3xl overflow-hidden border border-stone-200/80 hover:shadow-xl hover:border-emerald-300 transition-all duration-300"
                                >
                                    <div className="relative aspect-video sm:aspect-[16/10] bg-stone-200 overflow-hidden">
                                        {mainArticle.cover_image ? (
                                            <img
                                                src={`/storage/${mainArticle.cover_image}`}
                                                alt={mainArticle.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-emerald-800 to-teal-900 flex items-center justify-center text-white">
                                                <FileText className="w-16 h-16 opacity-40" />
                                            </div>
                                        )}

                                        <div className="absolute top-4 left-4">
                                            <span className={`px-3 py-1 text-xs font-bold rounded-full backdrop-blur-md uppercase tracking-wider ${categoryBadgeColors[mainArticle.category] ?? 'bg-white/90 text-stone-800'}`}>
                                                {mainArticle.category}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6 sm:p-8">
                                        <div className="flex items-center gap-3 text-xs text-stone-500 mb-3">
                                            <span className="flex items-center gap-1.5">
                                                <CalendarDays className="w-4 h-4 text-emerald-700" />
                                                {formatDate(mainArticle.published_at)}
                                            </span>
                                            <span>•</span>
                                            <span>Oleh: {mainArticle.author?.name || 'Pemerintah Desa'}</span>
                                        </div>

                                        <h3 className="text-xl sm:text-2xl font-bold text-stone-900 group-hover:text-emerald-800 transition-colors leading-snug mb-3">
                                            {mainArticle.title}
                                        </h3>

                                        {mainArticle.excerpt && (
                                            <p className="text-sm text-stone-600 line-clamp-3 leading-relaxed mb-6">
                                                {mainArticle.excerpt}
                                            </p>
                                        )}

                                        <div className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 group-hover:text-emerald-900">
                                            <span>Baca Selengkapnya</span>
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            </div>

                            {/* Secondary Articles List */}
                            <div className="lg:col-span-5 space-y-4">
                                <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
                                    Informasi Lainnya
                                </div>

                                {secondaryArticles.length > 0 ? (
                                    secondaryArticles.map((article) => (
                                        <Link
                                            key={article.id}
                                            href={`/berita/${article.slug}`}
                                            className="group flex gap-4 p-4 rounded-2xl border border-stone-200/70 hover:border-emerald-300 hover:bg-stone-50/70 transition-all"
                                        >
                                            <div className="w-24 h-24 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200/50">
                                                {article.cover_image ? (
                                                    <img
                                                        src={`/storage/${article.cover_image}`}
                                                        alt={article.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-emerald-50 flex items-center justify-center text-emerald-700">
                                                        <FileText className="w-8 h-8 opacity-60" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1.5">
                                                        <span className={`px-2 py-0.5 text-[11px] font-bold rounded capitalize ${categoryBadgeColors[article.category] ?? 'bg-stone-100 text-stone-700'}`}>
                                                            {article.category}
                                                        </span>
                                                        <span className="text-[11px] text-stone-500">
                                                            {formatDate(article.published_at)}
                                                        </span>
                                                    </div>

                                                    <h4 className="text-sm sm:text-base font-bold text-stone-900 group-hover:text-emerald-800 transition-colors line-clamp-2 leading-snug">
                                                        {article.title}
                                                    </h4>
                                                </div>

                                                <div className="flex items-center gap-1 text-xs font-medium text-emerald-800 mt-2">
                                                    <span>Lihat detail</span>
                                                    <ChevronRight className="w-3.5 h-3.5" />
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-stone-400 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                                        Tidak ada warta tambahan pada kategori ini.
                                    </div>
                                )}

                                <div className="pt-2">
                                    <Link
                                        href="/berita"
                                        className="flex items-center justify-center gap-2 w-full py-3 bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 text-stone-700 font-semibold rounded-xl text-xs sm:text-sm transition-colors"
                                    >
                                        <span>Buka Arsip Semua Berita & Pengumuman</span>
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-stone-50 rounded-2xl border border-stone-200">
                            <FileText className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                            <p className="text-stone-500 text-sm">Belum ada berita yang dipublikasikan saat ini.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* ─── 7. TRANSPARANSI ANGGARAN APBDES (RAMAH WARGA) ─── */}
            <section className="py-20 bg-stone-900 text-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
                        <div>
                            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/80 border border-emerald-500/30 px-3 py-1 rounded-md">
                                Akuntabilitas Publik
                            </span>
                            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-2">
                                Transparansi Dana Desa (APBDes {currentYear})
                            </h2>
                            <p className="text-stone-400 text-xs sm:text-sm mt-1">
                                Keterbukaan alokasi anggaran pendapatan, belanja infrastruktur, dan pemberdayaan masyarakat Desa Tlangoh
                            </p>
                        </div>

                        <Link
                            href="/apbdes"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-300 text-xs sm:text-sm font-semibold border border-white/15 transition-all self-start sm:self-auto"
                        >
                            <span>Rincian Lengkap APBDes</span>
                            <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-8 items-center">
                        {/* 2 Card Utama: Pendapatan & Belanja */}
                        <div className="lg:col-span-5 space-y-5">
                            {/* Card Pendapatan */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                                        <span className="text-sm font-bold text-emerald-400">Total Pendapatan Desa</span>
                                    </div>
                                    <span className="text-xs font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">
                                        {persenPendapatan.toFixed(1)}% Realisasi
                                    </span>
                                </div>
                                <div className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
                                    {formatRupiah(pendapatanTotal)}
                                </div>
                                <div className="text-xs text-stone-400">
                                    Terealisasi: <span className="text-emerald-300 font-semibold">{formatRupiah(pendapatanReal)}</span>
                                </div>

                                <div className="mt-4 h-2.5 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                                        style={{ width: `${persenPendapatan}%` }}
                                    />
                                </div>
                            </div>

                            {/* Card Belanja */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <BarChart3 className="w-5 h-5 text-rose-400" />
                                        <span className="text-sm font-bold text-rose-400">Total Belanja Pembangunan</span>
                                    </div>
                                    <span className="text-xs font-bold bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded">
                                        {persenBelanja.toFixed(1)}% Realisasi
                                    </span>
                                </div>
                                <div className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
                                    {formatRupiah(belanjaTotal)}
                                </div>
                                <div className="text-xs text-stone-400">
                                    Terealisasi: <span className="text-rose-300 font-semibold">{formatRupiah(belanjaReal)}</span>
                                </div>

                                <div className="mt-4 h-2.5 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-rose-500 rounded-full transition-all duration-1000"
                                        style={{ width: `${persenBelanja}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Chart Interaktif */}
                        <div className="lg:col-span-7 bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-7">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-sm sm:text-base font-bold text-stone-200">
                                    Grafik Anggaran vs Realisasi (Satuan Juta Rupiah)
                                </h3>
                                <div className="flex items-center gap-3 text-xs">
                                    <span className="flex items-center gap-1.5 text-emerald-400">
                                        <span className="w-3 h-3 rounded-sm bg-emerald-500" /> Anggaran
                                    </span>
                                    <span className="flex items-center gap-1.5 text-teal-300">
                                        <span className="w-3 h-3 rounded-sm bg-teal-400" /> Realisasi
                                    </span>
                                </div>
                            </div>

                            <div className="w-full h-56 sm:h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={apbdesChartData} barGap={12}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                                        <XAxis dataKey="name" tick={{ fill: '#cbd5e1', fontSize: 13 }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#0f172a',
                                                border: '1px solid rgba(255,255,255,0.15)',
                                                borderRadius: '12px',
                                                color: '#f8fafc',
                                                fontSize: '12px',
                                            }}
                                            formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')} Juta`, '']}
                                        />
                                        <Bar dataKey="anggaran" fill="#10b981" radius={[6, 6, 0, 0]} opacity={0.8} />
                                        <Bar dataKey="realisasi" fill="#2dd4bf" radius={[6, 6, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <p className="text-[11px] text-stone-400 mt-4 text-center">
                                Sumber data: Rekapitulasi Sistem Informasi Keuangan Desa (Siskeudes) Pemerintah Desa Tlangoh.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── 8. POTENSI & UMKM UNGGULAN DESA ─── */}
            <section className="py-20 bg-stone-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
                        <div>
                            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-md">
                                Ekonomi Warga
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2">
                                Potensi & Produk Unggulan Desa
                            </h2>
                            <p className="text-stone-600 text-xs sm:text-sm mt-1">
                                Ragam hasil kerajinan batik tulis Madura, olahan kuliner pesisir, dan destinasi wisata Desa Tlangoh
                            </p>
                        </div>

                        <Link
                            href="/potensi-umkm"
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-800 hover:text-emerald-900 hover:underline shrink-0"
                        >
                            <span>Lihat Semua Produk & Wisata</span>
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {umkmFeatured.length > 0 ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {umkmFeatured.map((item) => {
                                const badgeInfo = typeLabels[item.type] || { label: item.type, icon: '🏪', bg: 'bg-stone-100 text-stone-700' };

                                return (
                                    <div
                                        key={item.id}
                                        className="group bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between"
                                    >
                                        <div>
                                            <div className="relative aspect-[16/10] bg-stone-100 overflow-hidden">
                                                {item.cover_image ? (
                                                    <img
                                                        src={`/storage/${item.cover_image}`}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-teal-50 flex items-center justify-center text-4xl">
                                                        <span>{badgeInfo.icon}</span>
                                                    </div>
                                                )}

                                                <div className="absolute top-3 left-3">
                                                    <span className={`px-2.5 py-1 text-xs font-bold rounded-lg shadow-sm ${badgeInfo.bg}`}>
                                                        {badgeInfo.icon} {badgeInfo.label}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p-5">
                                                <h3 className="font-bold text-stone-900 text-lg mb-1 group-hover:text-emerald-800 transition-colors">
                                                    {item.name}
                                                </h3>
                                                <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed mb-4">
                                                    {item.description}
                                                </p>

                                                <div className="flex items-center justify-between text-xs text-stone-500 pt-3 border-t border-stone-100">
                                                    <span className="flex items-center gap-1 font-medium">
                                                        <Users className="w-3.5 h-3.5 text-stone-400" />
                                                        {item.owner_name}
                                                    </span>

                                                    {item.price_from ? (
                                                        <span className="font-bold text-emerald-800">
                                                            Mulai {formatRupiah(item.price_from)}
                                                        </span>
                                                    ) : (
                                                        <span className="text-stone-400">Harga Menyesuaikan</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-5 pt-0">
                                            {item.phone ? (
                                                <a
                                                    href={`https://wa.me/${String(item.phone).replace(/\D/g, '').replace(/^0/, '62')}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors border border-emerald-200/60"
                                                >
                                                    <PhoneCall className="w-3.5 h-3.5" />
                                                    <span>Hubungi Penjual (WhatsApp)</span>
                                                </a>
                                            ) : (
                                                <Link
                                                    href="/potensi-umkm"
                                                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs sm:text-sm font-semibold transition-colors"
                                                >
                                                    <span>Kunjungi Profil Usaha</span>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
                            <Leaf className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                            <p className="text-stone-500 text-sm">Data produk UMKM dan potensi desa sedang dalam tahap pembaruan.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* ─── 9. CALLOUT & CALL CENTER SIAGA DESA ─── */}
            <section className="py-16 bg-emerald-900 text-white relative overflow-hidden">
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-emerald-800/80 border border-emerald-700/60 rounded-3xl p-8 sm:p-12 shadow-2xl backdrop-blur-sm">
                        <div className="grid lg:grid-cols-12 gap-8 items-center">
                            <div className="lg:col-span-8">
                                <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
                                    Layanan Informasi & Bantuan
                                </span>
                                <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-3 mb-3 leading-tight">
                                    Butuh Bantuan Administrasi atau Ingin Menyampaikan Pengaduan?
                                </h2>
                                <p className="text-emerald-100 text-sm sm:text-base leading-relaxed max-w-2xl">
                                    Aparatur Pemerintah Desa Tlangoh siap membantu keperluan dokumen dan melayani aspirasi Anda. Gunakan kanal digital untuk kemudahan bersama atau hubungi layanan WhatsApp resmi kantor desa.
                                </p>
                            </div>

                            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3.5 justify-center">
                                <Link
                                    href="/layanan-surat"
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-emerald-50 text-emerald-950 font-bold rounded-xl text-sm transition-all shadow-lg text-center"
                                >
                                    <FileText className="w-4 h-4 text-emerald-700" />
                                    <span>Ajukan Surat Sekarang</span>
                                </Link>

                                <Link
                                    href="/pengaduan"
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-950/80 hover:bg-emerald-950 text-white font-semibold rounded-xl text-sm transition-colors border border-emerald-600/50 text-center"
                                >
                                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                                    <span>Kirim Pengaduan Warga</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
