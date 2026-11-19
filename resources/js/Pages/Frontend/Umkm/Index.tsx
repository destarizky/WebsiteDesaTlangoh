import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import {
    Store, MapPin, MessageCircle, ShoppingBag,
    UtensilsCrossed, Palette, Waves, Wrench, ChevronLeft, ChevronRight, Sparkles
} from 'lucide-react';
import { cn, formatRupiah } from '@/lib/utils';

interface UmkmItem {
    id: number;
    name: string;
    type: 'produk' | 'kuliner' | 'kerajinan' | 'wisata' | 'jasa';
    description: string;
    owner_name: string;
    phone: string | null;
    address: string | null;
    price_from: number | string | null;
    price_to: number | string | null;
    cover_image?: string | null;
    image?: string | null;
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

const typeConfig: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; badge: string; iconColor: string }> = {
    all: { label: 'Semua Potensi', icon: Store, badge: 'bg-slate-100 text-slate-800 border-slate-200', iconColor: 'text-slate-600' },
    produk: { label: 'Produk Olahan', icon: ShoppingBag, badge: 'bg-amber-50 text-amber-900 border-amber-200', iconColor: 'text-amber-600' },
    kuliner: { label: 'Kuliner Khas', icon: UtensilsCrossed, badge: 'bg-orange-50 text-orange-900 border-orange-200', iconColor: 'text-orange-600' },
    kerajinan: { label: 'Batik & Kerajinan', icon: Palette, badge: 'bg-purple-50 text-purple-900 border-purple-200', iconColor: 'text-purple-600' },
    wisata: { label: 'Wisata Desa', icon: Waves, badge: 'bg-teal-50 text-teal-900 border-teal-200', iconColor: 'text-teal-600' },
    jasa: { label: 'Jasa & Layanan', icon: Wrench, badge: 'bg-blue-50 text-blue-900 border-blue-200', iconColor: 'text-blue-600' },
};

export default function UmkmIndex({ items, types, selectedType }: Props) {
    const handleTypeChange = (type: string) => {
        router.get('/potensi-umkm', { type });
    };

    return (
        <PublicLayout>
            <Head title="Potensi Desa & Produk UMKM — Desa Tlangoh" />

            {/* Header Hero */}
            <div className="relative bg-gradient-to-b from-stone-950 via-emerald-950 to-stone-900 text-white py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-sm">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Pemberdayaan Ekonomi Masyarakat</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
                        Potensi Lokal & UMKM Desa Tlangoh
                    </h1>
                    <p className="text-stone-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                        Dukung produk usaha mikro, kuliner tradisional, kerajinan tangan batik tulis, dan destinasi wisata unggulan karya warga desa kami.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Type Filters */}
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mb-10">
                    {types.map((type) => {
                        const conf = typeConfig[type] || { label: type, icon: Store };
                        const Icon = conf.icon;
                        const isSelected = selectedType === type;

                        return (
                            <button
                                key={type}
                                onClick={() => handleTypeChange(type)}
                                className={cn(
                                    'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs',
                                    isSelected
                                        ? 'bg-emerald-700 text-white shadow-md shadow-emerald-950/20'
                                        : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{conf.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* UMKM Cards Grid */}
                {items.data.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 max-w-lg mx-auto p-8 space-y-3 shadow-xs">
                        <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
                        <h3 className="font-bold text-slate-800 text-lg">Belum Ada Usaha Terdaftar</h3>
                        <p className="text-xs text-slate-500">
                            Belum ada entitas UMKM atau wisata dalam kategori ini. Warga pelaku usaha dapat mendaftarkan produk melalui kantor desa.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {items.data.map((item) => {
                            const waNumber = item.phone ? item.phone.replace(/[^0-9]/g, '').replace(/^0/, '62') : '';
                            const imgSrc = item.cover_image || item.image;
                            const conf = typeConfig[item.type] || {
                                label: item.type,
                                icon: Store,
                                badge: 'bg-slate-50 text-slate-800 border-slate-200',
                                iconColor: 'text-slate-600'
                            };
                            const Icon = conf.icon;

                            return (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-200 transition-all duration-300 flex flex-col justify-between group"
                                >
                                    <div>
                                        {/* Image Box */}
                                        <div className="aspect-[16/10] bg-slate-100 relative overflow-hidden">
                                            {imgSrc ? (
                                                <img
                                                    src={imgSrc.startsWith('http') || imgSrc.startsWith('/') ? imgSrc : `/storage/${imgSrc}`}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-stone-100 to-emerald-50 flex items-center justify-center p-6 text-emerald-600/40">
                                                    <Icon className="w-14 h-14 stroke-[1.5]" />
                                                </div>
                                            )}

                                            {/* Category Tag with Tailwind Lucide Icon */}
                                            <div className="absolute top-3 left-3">
                                                <span
                                                    className={cn(
                                                        'inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold backdrop-blur-md bg-white/95 border shadow-xs',
                                                        conf.badge
                                                    )}
                                                >
                                                    <Icon className={cn('w-3.5 h-3.5', conf.iconColor)} />
                                                    <span>{conf.label}</span>
                                                </span>
                                            </div>

                                            {item.is_featured && (
                                                <span className="absolute top-3 right-3 bg-amber-400 text-amber-950 font-bold text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
                                                    <Sparkles className="w-3 h-3" />
                                                    Unggulan
                                                </span>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="p-6 space-y-3">
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition">
                                                    {item.name}
                                                </h3>
                                                <div className="text-xs text-slate-500 font-medium mt-0.5">
                                                    Pemilik: <span className="text-slate-800 font-semibold">{item.owner_name}</span>
                                                </div>
                                            </div>

                                            <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                                                {item.description}
                                            </p>

                                            <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-2 border-t border-slate-100">
                                                <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                                                <span className="truncate">{item.address || 'Desa Tlangoh, Bangkalan'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Footer */}
                                    <div className="p-6 pt-0 space-y-3">
                                        <div className="bg-slate-50 p-3 rounded-2xl flex items-center justify-between">
                                            <span className="text-xs text-slate-500">Kisaran Harga</span>
                                            <span className="font-bold text-sm text-emerald-800">
                                                {item.price_from ? (
                                                    item.price_to && Number(item.price_to) > Number(item.price_from) ? (
                                                        `${formatRupiah(Number(item.price_from))} - ${formatRupiah(Number(item.price_to))}`
                                                    ) : (
                                                        `Mulai ${formatRupiah(Number(item.price_from))}`
                                                    )
                                                ) : (
                                                    'Hubungi Penjual'
                                                )}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {waNumber ? (
                                                <a
                                                    href={`https://wa.me/${waNumber}?text=Halo%20${encodeURIComponent(item.name)},%20saya%20tertarik%20dengan%20produk%20Anda%20di%20Website%20Desa%20Tlangoh`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition shadow-xs"
                                                >
                                                    <MessageCircle className="w-4 h-4" />
                                                    <span>Hubungi Penjual (WA)</span>
                                                </a>
                                            ) : (
                                                <div className="w-full text-center py-2 text-xs text-slate-400">
                                                    Kontak belum tersedia
                                                </div>
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
