import { Link, usePage } from '@inertiajs/react';
import { ReactNode, useState } from 'react';
import {
    LayoutDashboard, FileText, MessageSquareWarning, Newspaper,
    Store, PiggyBank, Users, ChevronDown, LogOut, Bell,
    Menu, X, ShieldCheck, ChevronRight,
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
    const { auth } = usePage<{ auth: { user: { name: string; email: string } } }>().props;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

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
                    'fixed top-0 left-0 h-full w-64 bg-slate-900 flex flex-col z-50 transition-transform duration-300',
                    'lg:translate-x-0 lg:static lg:z-auto',
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between px-5 py-5 border-b border-slate-800">
                    <Link href="/admin" className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-white p-1 flex items-center justify-center shrink-0 shadow-sm">
                            <img
                                src="/images/logodesatlangoh.png"
                                alt="Logo Desa Tlangoh"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div>
                            <div className="text-white font-bold text-sm leading-tight">Admin Panel</div>
                            <div className="text-xs text-emerald-400">Desa Tlangoh</div>
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
                <nav className="flex-1 py-4 overflow-y-auto">
                    <div className="px-3 space-y-0.5">
                        {sidebarItems.map((item) => {
                            const isActive = currentPath === item.href || currentPath.startsWith(item.href + '/');
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={cn(
                                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group',
                                        isActive
                                            ? 'bg-emerald-600 text-white shadow-sm'
                                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                    )}
                                >
                                    <item.icon className="w-4.5 h-4.5 shrink-0" />
                                    <span className="flex-1">{item.label}</span>
                                    {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-70" />}
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                {/* Sidebar Footer - User Info */}
                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {auth?.user?.name?.charAt(0) ?? 'A'}
                        </div>
                        <div className="min-w-0">
                            <div className="text-sm font-medium text-white truncate">{auth?.user?.name ?? 'Admin'}</div>
                            <div className="text-xs text-slate-400 truncate">{auth?.user?.email ?? ''}</div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            href="/"
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700"
                        >
                            Lihat Website
                        </Link>
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs text-red-400 hover:text-red-300 hover:bg-red-900/30 transition-colors border border-slate-700"
                        >
                            <LogOut className="w-3.5 h-3.5" />
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
                <main className="flex-1 p-4 sm:p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
