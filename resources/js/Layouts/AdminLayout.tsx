import { Link, usePage } from '@inertiajs/react';
import { ReactNode, useState, useEffect } from 'react';
import {
    LayoutDashboard, FileText, MessageSquareWarning, Newspaper,
    Store, PiggyBank, Users, ChevronDown, LogOut, Bell,
    Menu, X, ShieldCheck, ChevronRight, CheckCircle2, AlertCircle, Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
    children: ReactNode;
    title?: string;
}

const sidebarItems = [
    {
        label: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard,
    },
    {
        label: 'Persuratan',
        href: '/admin/surat',
        icon: FileText,
        badge: 'pending',
    },
    {
        label: 'Pengaduan',
        href: '/admin/pengaduan',
        icon: MessageSquareWarning,
    },
    {
        label: 'Berita & Pengumuman',
        href: '/admin/berita',
        icon: Newspaper,
    },
    {
        label: 'UMKM & Wisata',
        href: '/admin/umkm',
        icon: Store,
    },
    {
        label: 'Transparansi APBDes',
        href: '/admin/apbdes',
        icon: PiggyBank,
    },
    {
        label: 'Pengguna & Akses',
        href: '/admin/pengguna',
        icon: Users,
    },
];

export default function AdminLayout({ children, title }: AdminLayoutProps) {
    const { auth, flash } = usePage<{
        auth: { user: { name: string; email: string } };
        flash?: { success?: string; error?: string; message?: string };
    }>().props;

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    useEffect(() => {
        if (flash?.success) {
            setToast({ type: 'success', message: flash.success });
            const timer = setTimeout(() => setToast(null), 5000);
            return () => clearTimeout(timer);
        } else if (flash?.error) {
            setToast({ type: 'error', message: flash.error });
            const timer = setTimeout(() => setToast(null), 6000);
            return () => clearTimeout(timer);
        } else if (flash?.message) {
            setToast({ type: 'info', message: flash.message });
            const timer = setTimeout(() => setToast(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar Overlay (mobile) */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed inset-y-0 left-0 h-screen w-64 bg-slate-900 flex flex-col z-50 transition-transform duration-300 border-r border-slate-800',
                    'lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:shrink-0',
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between px-5 py-5 border-b border-slate-800 shrink-0">
                    <Link href="/admin" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 p-1.5 flex items-center justify-center shrink-0 shadow-sm border border-white/15">
                            <img
                                src="/images/logodesatlangoh.png"
                                alt="Logo Desa Tlangoh"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div>
                            <div className="text-white font-bold text-sm tracking-tight leading-tight">Admin Panel</div>
                            <div className="text-xs font-medium text-emerald-400">Desa Tlangoh</div>
                        </div>
                    </Link>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-4 overflow-y-auto px-3 space-y-1">
                    {sidebarItems.map((item) => {
                        const isActive = currentPath === item.href || currentPath.startsWith(item.href + '/');
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsSidebarOpen(false)}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
                                    isActive
                                        ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-950/30'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                                )}
                            >
                                <item.icon className="w-5 h-5 shrink-0" />
                                <span className="flex-1">{item.label}</span>
                                {isActive && <ChevronRight className="w-4 h-4 opacity-80" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar Footer - User Info & Actions (Pinned at bottom) */}
                <div className="p-4 border-t border-slate-800 bg-slate-900/95 shrink-0 mt-auto">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm">
                            {auth?.user?.name?.charAt(0) ?? 'A'}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="text-sm font-semibold text-white truncate">{auth?.user?.name ?? 'Admin'}</div>
                            <div className="text-xs text-slate-400 truncate">{auth?.user?.email ?? ''}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href="/"
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700/80"
                        >
                            Lihat Website
                        </Link>
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="flex items-center justify-center p-2 rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors border border-slate-700/80 shrink-0"
                            title="Keluar"
                        >
                            <LogOut className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Header */}
                <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 flex items-center gap-4 sticky top-0 z-30">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                        aria-label="Open sidebar"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="flex-1 min-w-0">
                        {title && (
                            <h1 className="text-lg font-semibold text-slate-900 truncate">{title}</h1>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
                            <Bell className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 sm:p-6 overflow-auto relative">
                    {/* Floating Toast Notification */}
                    {toast && (
                        <div className="fixed top-5 right-5 z-50 max-w-md animate-in fade-in slide-in-from-top-4 duration-300">
                            <div
                                className={cn(
                                    'flex items-center gap-3.5 px-5 py-4 rounded-2xl shadow-xl border backdrop-blur-md',
                                    toast.type === 'success' && 'bg-emerald-900/95 text-white border-emerald-500/50 shadow-emerald-950/40',
                                    toast.type === 'error' && 'bg-rose-900/95 text-white border-rose-500/50 shadow-rose-950/40',
                                    toast.type === 'info' && 'bg-slate-900/95 text-white border-slate-700 shadow-slate-950/40'
                                )}
                            >
                                <div className="p-1.5 rounded-xl bg-white/10 shrink-0">
                                    {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                                    {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400" />}
                                    {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400" />}
                                </div>
                                <div className="flex-1 text-sm font-medium pr-2">
                                    <div className="font-bold text-xs uppercase tracking-wider opacity-75 mb-0.5">
                                        {toast.type === 'success' ? 'Berhasil' : toast.type === 'error' ? 'Peringatan' : 'Pemberitahuan'}
                                    </div>
                                    <div>{toast.message}</div>
                                </div>
                                <button
                                    onClick={() => setToast(null)}
                                    className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors shrink-0"
                                    aria-label="Tutup notifikasi"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {children}
                </main>
            </div>
        </div>
    );
}
