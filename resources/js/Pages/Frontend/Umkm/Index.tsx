import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import {
    Store, MapPin, Phone, MessageCircle, Tag,
    ChevronLeft, ChevronRight, Sparkles, ShoppingBag
} from 'lucide-react';
import { cn, formatRupiah } from '@/lib/utils';

interface UmkmItem {
    id: number;
    name: string;
    type: 'produk' | 'kuliner' | 'kerajinan' | 'wisata' | 'jasa';
    description: string;
    owner_name: string;
    phone: string;
    address: string;
    price_from: number | null;
    price_to: number | null;
    image: string | null;
    is_featured: boolean;
}

interface PaginatedUmkm {
    data: UmkmItem[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    items: PaginatedUmkm;
    types: string[];
    selectedType: string;
}

export default function UmkmIndex({ items, types, selectedType }: Props) {
    const handleTypeChange = (type: string) => {
        router.get('/potensi-umkm', { type });
    };

    const typeLabels: Record<string, string> = {
        all: 'Semua Potensi',
        produk: 'Produk Olahan',
        kuliner: 'Kuliner Khas',
        kerajinan: 'Kerajinan & Kesenian',
        wisata: 'Wisata Desa',
        jasa: 'Jasa & Layanan',
    };

    const typeBadges: Record<string, string> = {
        kuliner: 'bg-amber-50 text-amber-800 border-amber-200',
        kerajinan: 'bg-purple-50 text-purple-800 border-purple-200',
        wisata: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        produk: 'bg-blue-50 text-blue-800 border-blue-200',
        jasa: 'bg-slate-50 text-slate-800 border-slate-200',
    };

    return (
        <PublicLayout>
            <Head title="Potensi Desa & Produk UMKM — Desa Tlangoh" />

            {/* Header Hero */}
            <div className="bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center space-y-4">
                    <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Pemberdayaan Ekonomi Masyarakat
                    </span>
                    <h1 className="text-3xl sm:text-5xl font-extrabold font-serif tracking-tight">
                        Potensi Lokal & UMKM Desa Tlangoh
                    </h1>
                    <p className="text-emerald-100/80 text-sm sm:text-base max-w-2xl mx-auto">
                        Dukung produk usaha mikro, kuliner tradisional, kerajinan tangan, dan destinasi wisata unggulan karya warga desa kami.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Category Tabs */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
                    {types.map((type) => (
                        <button
                            key={type}
                            onClick={() => handleTypeChange(type)}
                            className={cn(
                                'px-4 py-2 rounded-xl text-xs font-semibold transition tracking-wide uppercase',
                                selectedType === type
                                    ? 'bg-emerald-700 text-white shadow-xs'
                                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                            )}
                        >
                            {typeLabels[type] || type}
                        </button>
                    ))}
                </div>

                {/* UMKM Cards Grid */}
                {items.data.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 max-w-lg mx-auto p-8 space-y-3">
                        <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
                        <h3 className="font-bold text-slate-800 text-lg">Belum Ada Usaha Terdaftar</h3>
                        <p className="text-xs text-slate-500">
                            Belum ada entitas UMKM atau wisata dalam kategori ini. Warga pelaku usaha dapat mendaftarkan produk melalui kantor desa.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {items.data.map((item) => {
                            const waNumber = item.phone.replace(/[^0-9]/g, '').replace(/^0/, '62');
                            return (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                                >
                                    <div>
                                        {/* Image Box */}
                                        <div className="aspect-[16/10] bg-slate-100 relative overflow-hidden">
                                            {item.image ? (
                                                <img
                                                    src={item.image.startsWith('http') ? item.image : `/storage/${item.image}`}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-emerald-800/80 via-teal-800 to-slate-900 flex items-center justify-center p-6 text-emerald-200/50">
                                                    <Store className="w-14 h-14" />
                                                </div>
                                            )}

                                            <span
                                                className={cn(
                                                    'absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider border shadow-xs backdrop-blur-xs',
                                                    typeBadges[item.type] || 'bg-white text-slate-700 border-slate-200'
                                                )}
                                            >
                                                {typeLabels[item.type] || item.type}
                                            </span>

                                            {item.is_featured && (
                                                <span className="absolute top-3 right-3 bg-amber-400 text-amber-950 font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                                                    <Sparkles className="w-3 h-3" />
                                                    Unggulan
                                                </span>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="p-6 space-y-3">
                                            <div>
                                                <h3 className="font-serif text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition">
                                                    {item.name}
                                                </h3>
                                                <div className="text-xs text-slate-500 font-medium mt-0.5">
                                                    Pemilik: <span className="text-slate-800">{item.owner_name}</span>
                                                </div>
                                            </div>

                                            <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                                                {item.description}
                                            </p>

                                            <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                                                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                                <span className="truncate">{item.address}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer Action & Price */}
                                    <div className="p-6 pt-0 border-t border-slate-100 mt-4 space-y-4">
                                        <div className="pt-4 flex items-center justify-between">
                                            <div>
                                                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                                                    Kisaran Harga
                                                </span>
                                                <span className="text-xs sm:text-sm font-bold text-emerald-700 font-mono">
                                                    {item.price_from ? formatRupiah(item.price_from) : 'Menyesuaikan'}
                                                    {item.price_to ? ` - ${formatRupiah(item.price_to)}` : ''}
                                                </span>
                                            </div>

                                            {item.phone && (
                                                <a
                                                    href={`https://wa.me/${waNumber}?text=Halo%20${encodeURIComponent(item.name)},%20saya%20mengetahui%20produk%20ini%20melalui%20Website%20Resmi%20Desa%20Tlangoh.`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                                                >
                                                    <MessageCircle className="w-3.5 h-3.5" />
                                                    Hubungi / WA
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {items.last_page > 1 && (
                    <div className="mt-12 flex items-center justify-center gap-2">
                        {items.links.map((link, idx) => {
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
