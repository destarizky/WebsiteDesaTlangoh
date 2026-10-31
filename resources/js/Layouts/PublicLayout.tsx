import { Link } from '@inertiajs/react';
import { ReactNode, useEffect, useState } from 'react';
import { Menu, X, Search, FileText, ChevronDown, Phone, MapPin, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PublicLayoutProps {
    children: ReactNode;
}

const navLinks = [
    { label: 'Beranda', href: '/' },
    { label: 'Berita', href: '/berita' },
    {
        label: 'Layanan',
        children: [
            { label: 'Ajukan Surat', href: '/layanan-surat' },
            { label: 'Lacak Surat', href: '/layanan-surat/lacak' },
            { label: 'Pengaduan Warga', href: '/pengaduan' },
        ],
    },
    { label: 'APBDes', href: '/apbdes' },
    { label: 'Potensi & UMKM', href: '/potensi-umkm' },
];

export default function PublicLayout({ children }: PublicLayoutProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-stone-50 font-sans">
            {/* Navbar */}
            <header
                className={cn(
                    'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                    isScrolled
                        ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-stone-200/60'
                        : 'bg-transparent'
                )}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 lg:h-20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-xl bg-white shadow-md p-1 flex items-center justify-center shrink-0 group-hover:scale-105 transition-all">
                                <img
                                    src="/images/logodesatlangoh.png"
                                    alt="Logo Desa Tlangoh"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div>
                                <div className={cn('font-bold text-sm leading-tight transition-colors', isScrolled ? 'text-stone-900' : 'text-white')}>
                                    Desa Tlangoh
                                </div>
                                <div className={cn('text-xs font-medium transition-colors', isScrolled ? 'text-emerald-600' : 'text-emerald-300')}>
                                    Kec. Tanjungbumi, Bangkalan
                                </div>
                            </div>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {navLinks.map((link) =>
                                link.children ? (
                                    <div key={link.label} className="relative">
                                        <button
                                            onClick={() => setOpenDropdown(openDropdown === link.label ? null : link.label)}
                                            className={cn(
                                                'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all',
                                                isScrolled ? 'text-stone-700 hover:text-emerald-600 hover:bg-emerald-50' : 'text-stone-200 hover:text-white hover:bg-white/10'
                                            )}
                                        >
                                            {link.label}
                                            <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', openDropdown === link.label && 'rotate-180')} />
                                        </button>
                                        {openDropdown === link.label && (
                                            <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-stone-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                                                {link.children.map((child) => (
                                                    <Link
                                                        key={child.href}
                                                        href={child.href}
                                                        onClick={() => setOpenDropdown(null)}
                                                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-stone-700 hover:bg-emerald-50 hover:text-emerald-700 font-medium transition-colors"
                                                    >
                                                        {child.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Link
                                        key={link.href}
                                        href={link.href!}
                                        className={cn(
                                            'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                                            isScrolled ? 'text-stone-700 hover:text-emerald-600 hover:bg-emerald-50' : 'text-stone-200 hover:text-white hover:bg-white/10'
                                        )}
                                    >
                                        {link.label}
                                    </Link>
                                )
                            )}
                        </nav>

                        {/* CTA + Mobile Toggle */}
                        <div className="flex items-center gap-3">
                            <Link
                                href="/layanan-surat"
                                className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-emerald-900/20 hover:shadow-emerald-500/25 hover:scale-[1.02]"
                            >
                                <FileText className="w-4 h-4" />
                                Ajukan Surat
                            </Link>
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className={cn(
                                    'lg:hidden p-2 rounded-xl transition-colors',
                                    isScrolled ? 'text-stone-700 hover:bg-stone-100' : 'text-white hover:bg-white/10'
                                )}
                                aria-label="Toggle menu"
                            >
                                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden bg-white border-t border-stone-100 shadow-lg">
                        <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
                            {navLinks.map((link) =>
                                link.children ? (
                                    <div key={link.label}>
                                        <div className="px-3 py-2 text-xs font-semibold text-stone-400 uppercase tracking-wider">{link.label}</div>
                                        {link.children.map((child) => (
                                            <Link
                                                key={child.href}
                                                href={child.href}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="block px-6 py-2.5 text-sm text-stone-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors"
                                            >
                                                {child.label}
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <Link
                                        key={link.href}
                                        href={link.href!}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block px-3 py-2.5 text-sm font-medium text-stone-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                )
                            )}
                            <div className="pt-2 border-t border-stone-100">
                                <Link
                                    href="/layanan-surat"
                                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-emerald-600 text-white text-sm font-medium rounded-xl"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <FileText className="w-4 h-4" />
                                    Ajukan Surat Online
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main>{children}</main>

            {/* Footer */}
            <footer className="bg-stone-900 text-stone-300">
                {/* Top footer */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                        {/* Brand */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-white shadow-md p-1 flex items-center justify-center shrink-0">
                                    <img
                                        src="/images/logodesatlangoh.png"
                                        alt="Logo Desa Tlangoh"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <div>
                                    <div className="font-bold text-white text-lg">Desa Tlangoh</div>
                                    <div className="text-xs text-emerald-400">Kec. Tanjungbumi, Bangkalan, Jawa Timur</div>
                                </div>
                            </div>
                            <p className="text-sm text-stone-400 leading-relaxed max-w-sm">
                                Website resmi Pemerintah Desa Tlangoh. Melayani dengan ikhlas, membangun dengan amanah untuk kesejahteraan seluruh warga desa.
                            </p>
                            <div className="mt-6 space-y-2">
                                <div className="flex items-start gap-2.5 text-sm">
                                    <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                                    <span className="text-stone-400">Jl. Raya Tlangoh No. 01, Kec. Tanjungbumi, Bangkalan, Jawa Timur 69154</span>
                                </div>
                                <div className="flex items-center gap-2.5 text-sm">
                                    <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span className="text-stone-400">(031) 3xxxxxx</span>
                                </div>
                                <div className="flex items-center gap-2.5 text-sm">
                                    <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span className="text-stone-400">desa.tlangoh@gmail.com</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="text-white font-semibold mb-4">Tautan Cepat</h4>
                            <ul className="space-y-2">
                                {[
                                    { label: 'Beranda', href: '/' },
                                    { label: 'Berita & Pengumuman', href: '/berita' },
                                    { label: 'Ajukan Surat', href: '/layanan-surat' },
                                    { label: 'Laporan Pengaduan', href: '/pengaduan' },
                                    { label: 'Transparansi APBDes', href: '/apbdes' },
                                    { label: 'Potensi & UMKM', href: '/potensi-umkm' },
                                ].map((item) => (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className="text-sm text-stone-400 hover:text-emerald-400 transition-colors"
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Office Hours */}
                        <div>
                            <h4 className="text-white font-semibold mb-4">Jam Operasional</h4>
                            <div className="space-y-3">
                                <div>
                                    <div className="text-sm font-medium text-stone-300">Senin – Kamis</div>
                                    <div className="text-sm text-stone-400">08.00 – 15.00 WIB</div>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-stone-300">Jumat</div>
                                    <div className="text-sm text-stone-400">08.00 – 11.30 WIB</div>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-stone-300">Sabtu – Minggu</div>
                                    <div className="text-sm text-stone-400 line-through">Tutup</div>
                                </div>
                            </div>
                            <div className="mt-5 p-3 bg-red-900/30 border border-red-800/40 rounded-lg">
                                <div className="text-xs font-semibold text-red-400 mb-1">🚨 Kontak Darurat</div>
                                <div className="text-sm text-stone-300">Kepala Desa: 0812-3456-7890</div>
                                <div className="text-sm text-stone-300">Sekdes: 0898-7654-3210</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom footer */}
                <div className="border-t border-stone-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                        <p className="text-xs text-stone-500">
                            © {new Date().getFullYear()} Pemerintah Desa Tlangoh. Seluruh hak cipta dilindungi.
                        </p>
                        <Link href="/admin" className="text-xs text-stone-600 hover:text-emerald-400 transition-colors">
                            Portal Admin
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
