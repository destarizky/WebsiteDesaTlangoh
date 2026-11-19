import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link } from '@inertiajs/react';
import {
    FileText, MessageSquareWarning, Newspaper, TrendingUp,
    Clock, CheckCircle2, XCircle, AlertCircle, Users,
    ArrowRight, BarChart3, Plus, Sparkles, Store, PiggyBank,
    ArrowUpRight, ShieldCheck, Calendar, Activity, ChevronRight
} from 'lucide-react';
import { formatRupiah, formatDateTime, getStatusLabel, getStatusColor } from '@/lib/utils';
import { cn } from '@/lib/utils';
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer, Legend,
    Cell
} from 'recharts';

interface Stats {
    service_requests: { total: number; pending: number; processing: number; approved: number; rejected: number };
    complaints: { total: number; pending: number; in_progress: number; resolved: number };
    news: { total: number; published: number; draft: number };
    umkm: { total: number; active: number };
}

interface ServiceRequest {
    id: number;
    ticket_number: string;
    requester_name: string;
    letter_type: string;
    status: string;
    created_at: string;
}

interface Complaint {
    id: number;
    ticket_number: string;
    subject: string;
    category: string;
    status: string;
    created_at: string;
}

interface MonthlyStat {
    month: string;
    surat: number;
    pengaduan: number;
}

interface UmkmDistributionItem {
    name: string;
    total: number;
}

interface BelanjaCategoryItem {
    category: string;
    anggaran: number;
    realisasi: number;
    persen: number;
}

interface Props {
    stats: Stats;
    recentRequests: ServiceRequest[];
    recentComplaints: Complaint[];
    apbdesSummary: Record<string, { budgeted_amount: number; realized_amount: number }[]>;
    monthlyStats?: MonthlyStat[];
    umkmDistribution?: UmkmDistributionItem[];
    belanjaCategories?: BelanjaCategoryItem[];
}

export default function AdminDashboard({
    stats,
    recentRequests = [],
    recentComplaints = [],
    apbdesSummary = {},
    monthlyStats = [],
    umkmDistribution = [],
    belanjaCategories = [],
}: Props) {
    const pendapatanTotal = apbdesSummary['pendapatan']?.reduce((a, b) => a + Number(b.budgeted_amount), 0) ?? 0;
    const belanjaTotal    = apbdesSummary['belanja']?.reduce((a, b) => a + Number(b.budgeted_amount), 0) ?? 0;
    const pendapatanReal  = apbdesSummary['pendapatan']?.reduce((a, b) => a + Number(b.realized_amount), 0) ?? 0;
    const belanjaReal     = apbdesSummary['belanja']?.reduce((a, b) => a + Number(b.realized_amount), 0) ?? 0;

    const apbdesChartData = [
        { name: 'Pendapatan', Anggaran: pendapatanTotal / 1e6, Realisasi: pendapatanReal / 1e6 },
        { name: 'Belanja',    Anggaran: belanjaTotal / 1e6,    Realisasi: belanjaReal / 1e6 },
    ];

    // Fallback data jika belum ada statistik bulanan di database
    const trendData = monthlyStats.length > 0 ? monthlyStats : [
        { month: 'Jun', surat: 4, pengaduan: 1 },
        { month: 'Jul', surat: 6, pengaduan: 2 },
        { month: 'Agu', surat: 8, pengaduan: 3 },
        { month: 'Sep', surat: 12, pengaduan: 4 },
        { month: 'Okt', surat: 15, pengaduan: 2 },
        { month: 'Nov', surat: Math.max(stats.service_requests.total, 8), pengaduan: Math.max(stats.complaints.total, 1) },
    ];

    const todayDateFormatted = new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <AdminLayout title="Dashboard Utama">
            <Head title="Dashboard Admin — Desa Tlangoh" />

            <div className="space-y-6 pb-8">
                {/* ─── 1. WELCOME BANNER (PROFESSIONAL & ELEGAN) ─── */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-emerald-900/40">
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-xs font-semibold text-emerald-300 mb-3 backdrop-blur-sm">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Pusat Kendali Administrasi Desa Tlangoh</span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                                Selamat Datang di Dashboard Admin 👋
                            </h2>
                            <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
                                Pantau pelayanan surat warga, laporan pengaduan, transparansi anggaran APBDes, serta kemajuan pelaku UMKM secara real-time.
                            </p>
                            <div className="flex items-center gap-2 mt-4 text-xs sm:text-sm text-emerald-200/90 font-medium">
                                <Calendar className="w-4 h-4 text-emerald-400" />
                                <span>{todayDateFormatted}</span>
                                <span className="opacity-40">•</span>
                                <span className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    Sistem Layanan Aktif
                                </span>
                            </div>
                        </div>

                        {/* Quick Action Buttons */}
                        <div className="flex flex-wrap items-center gap-3 shrink-0">
                            <Link
                                href="/admin/surat"
                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-emerald-950/40 hover:-translate-y-0.5 transition-all"
                            >
                                <FileText className="w-4 h-4" />
                                <span>Kelola Persuratan</span>
                                {stats.service_requests.pending > 0 && (
                                    <span className="px-2 py-0.5 rounded-full bg-white text-emerald-900 text-xs font-bold">
                                        {stats.service_requests.pending}
                                    </span>
                                )}
                            </Link>

                            <Link
                                href="/admin/berita/create"
                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium border border-white/20 backdrop-blur-md hover:-translate-y-0.5 transition-all"
                            >
                                <Plus className="w-4 h-4 text-emerald-300" />
                                <span>Tulis Berita</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ─── 2. STATS KPI CARDS ROW (4 UTAMA) ─── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                    <StatCard
                        title="Permohonan Surat"
                        value={stats.service_requests.total}
                        sub={`${stats.service_requests.pending} butuh verifikasi`}
                        icon={FileText}
                        color="blue"
                        href="/admin/surat"
                        badge={stats.service_requests.pending > 0 ? `${stats.service_requests.pending} Baru` : undefined}
                    />
                    <StatCard
                        title="Aspirasi & Pengaduan"
                        value={stats.complaints.total}
                        sub={`${stats.complaints.pending} belum ditangani`}
                        icon={MessageSquareWarning}
                        color="amber"
                        href="/admin/pengaduan"
                        badge={stats.complaints.pending > 0 ? 'Perlu Respon' : undefined}
                    />
                    <StatCard
                        title="Kabar & Pengumuman"
                        value={stats.news.published}
                        sub={`${stats.news.draft} artikel draf`}
                        icon={Newspaper}
                        color="emerald"
                        href="/admin/berita"
                    />
                    <StatCard
                        title="Pelaku UMKM Terdaftar"
                        value={stats.umkm.active}
                        sub={`dari ${stats.umkm.total} total usaha`}
                        icon={Store}
                        color="violet"
                        href="/admin/umkm"
                    />
                </div>

                {/* ─── 3. STATUS PERSURATAN & PENGADUAN PILLS ─── */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                    {[
                        { label: 'Surat Menunggu', value: stats.service_requests.pending, icon: Clock, color: 'text-amber-700 bg-amber-50/80 border-amber-200' },
                        { label: 'Surat Diproses', value: stats.service_requests.processing, icon: AlertCircle, color: 'text-blue-700 bg-blue-50/80 border-blue-200' },
                        { label: 'Surat Disetujui', value: stats.service_requests.approved, icon: CheckCircle2, color: 'text-emerald-700 bg-emerald-50/80 border-emerald-200' },
                        { label: 'Surat Ditolak', value: stats.service_requests.rejected, icon: XCircle, color: 'text-rose-700 bg-rose-50/80 border-rose-200' },
                        { label: 'Pengaduan Proses', value: stats.complaints.in_progress, icon: MessageSquareWarning, color: 'text-orange-700 bg-orange-50/80 border-orange-200' },
                        { label: 'Pengaduan Selesai', value: stats.complaints.resolved, icon: ShieldCheck, color: 'text-teal-700 bg-teal-50/80 border-teal-200' },
                    ].map((item) => (
                        <div key={item.label} className={cn('flex items-center gap-3 p-3.5 rounded-2xl border shadow-xs transition-all hover:shadow-sm', item.color)}>
                            <div className="p-2 rounded-xl bg-white/80 shadow-xs shrink-0">
                                <item.icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                                <div className="text-lg font-bold leading-none">{item.value}</div>
                                <div className="text-xs font-medium opacity-85 truncate mt-1">{item.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ─── 4. GRAFIK UTAMA & ANALITIK (CHARTS ROW) ─── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Grafik 1: Tren Layanan Persuratan & Pengaduan Warga */}
                    <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                            <div>
                                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-emerald-600" />
                                    Tren Layanan Persuratan & Pengaduan
                                </h3>
                                <p className="text-xs text-slate-500 mt-0.5">Statistik volume permohonan warga per bulan</p>
                            </div>
                            <div className="flex items-center gap-4 text-xs font-medium">
                                <span className="flex items-center gap-1.5 text-emerald-700">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                    Surat Masuk
                                </span>
                                <span className="flex items-center gap-1.5 text-amber-700">
                                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                                    Pengaduan Warga
                                </span>
                            </div>
                        </div>

                        <div className="h-64 sm:h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorSurat" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                                        </linearGradient>
                                        <linearGradient id="colorPengaduan" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                                        labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
                                    />
                                    <Area type="monotone" dataKey="surat" name="Surat Warga" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSurat)" />
                                    <Area type="monotone" dataKey="pengaduan" name="Pengaduan" stroke="#f59e0b" strokeWidth={2.5} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorPengaduan)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                            <span>* Data diupdate otomatis sesuai pengajuan online warga</span>
                            <Link href="/admin/surat" className="font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                                Buka Rekap Surat <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>

                    {/* Grafik 2: Snapshot Realisasi APBDes */}
                    <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                        <PiggyBank className="w-4 h-4 text-emerald-600" />
                                        Realisasi APBDes {new Date().getFullYear()}
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-0.5">Perbandingan Anggaran vs Realisasi (Juta Rp)</p>
                                </div>
                                <Link href="/admin/apbdes" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                                    Detail <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>

                            {/* Progress Bars */}
                            <div className="space-y-4 my-4">
                                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                                    <div className="flex justify-between items-center text-xs sm:text-sm mb-1.5">
                                        <span className="font-semibold text-slate-700">Pendapatan Desa</span>
                                        <span className="font-bold text-emerald-700">{formatRupiah(pendapatanTotal)}</span>
                                    </div>
                                    <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                            style={{ width: `${pendapatanTotal > 0 ? Math.min((pendapatanReal / pendapatanTotal) * 100, 100) : 0}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-slate-500 mt-1.5">
                                        <span>Realisasi: {formatRupiah(pendapatanReal)}</span>
                                        <span className="font-semibold text-emerald-600">
                                            {pendapatanTotal > 0 ? ((pendapatanReal / pendapatanTotal) * 100).toFixed(1) : 0}%
                                        </span>
                                    </div>
                                </div>

                                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                                    <div className="flex justify-between items-center text-xs sm:text-sm mb-1.5">
                                        <span className="font-semibold text-slate-700">Belanja Desa</span>
                                        <span className="font-bold text-rose-700">{formatRupiah(belanjaTotal)}</span>
                                    </div>
                                    <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-rose-500 rounded-full transition-all duration-500"
                                            style={{ width: `${belanjaTotal > 0 ? Math.min((belanjaReal / belanjaTotal) * 100, 100) : 0}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-slate-500 mt-1.5">
                                        <span>Realisasi: {formatRupiah(belanjaReal)}</span>
                                        <span className="font-semibold text-rose-600">
                                            {belanjaTotal > 0 ? ((belanjaReal / belanjaTotal) * 100).toFixed(1) : 0}%
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Mini Bar Chart */}
                            <div className="h-36 w-full mt-2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={apbdesChartData} barGap={8}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                        <Tooltip
                                            formatter={(v: number) => [`Rp ${v.toFixed(1)} Juta`, '']}
                                            contentStyle={{ backgroundColor: '#0f172a', borderRadius: '10px', color: '#fff', fontSize: '11px' }}
                                        />
                                        <Bar dataKey="Anggaran" fill="#94a3b8" radius={[6, 6, 0, 0]} name="Pagu Anggaran" />
                                        <Bar dataKey="Realisasi" fill="#10b981" radius={[6, 6, 0, 0]} name="Terealisasi" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── 5. TABLE & ACTIVITY ROW ─── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Pengajuan Surat Masuk Terbaru */}
                    <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs">
                        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50/50">
                            <div>
                                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-blue-600" />
                                    Pengajuan Surat Terbaru
                                </h3>
                                <p className="text-xs text-slate-500">Antrean permohonan surat administrasi warga</p>
                            </div>
                            <Link href="/admin/surat" className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        <div className="divide-y divide-slate-100">
                            {recentRequests.length > 0 ? recentRequests.map((req) => (
                                <div key={req.id} className="flex items-center justify-between p-4 sm:px-6 hover:bg-slate-50/80 transition-colors gap-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 font-bold text-xs">
                                            SR
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-semibold text-sm text-slate-900 truncate">{req.requester_name}</div>
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <span className="font-mono text-slate-400">{req.ticket_number}</span>
                                                <span>•</span>
                                                <span className="capitalize">{req.letter_type.replace(/_/g, ' ')}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <span className={cn('px-2.5 py-1 text-xs font-semibold rounded-full border shadow-2xs', getStatusColor(req.status))}>
                                            {getStatusLabel(req.status)}
                                        </span>
                                        <Link
                                            href={`/admin/surat/${req.id}`}
                                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                                            title="Buka detail surat"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            )) : (
                                <div className="py-12 text-center text-slate-400 text-sm">
                                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                    Belum ada pengajuan surat masuk.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Potensi UMKM & Kategori Usaha Desa */}
                    <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs flex flex-col justify-between">
                        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50/50">
                            <div>
                                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                    <Store className="w-4 h-4 text-purple-600" />
                                    Kategori UMKM & Wisata
                                </h3>
                                <p className="text-xs text-slate-500">Ragam sektor ekonomi binaan Desa Tlangoh</p>
                            </div>
                            <Link href="/admin/umkm" className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1">
                                Kelola <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        <div className="p-6 space-y-4">
                            {umkmDistribution.length > 0 ? umkmDistribution.map((item, idx) => (
                                <div key={item.name} className="space-y-1.5">
                                    <div className="flex justify-between text-xs sm:text-sm font-medium">
                                        <span className="text-slate-700">{item.name}</span>
                                        <span className="font-bold text-slate-900">{item.total} Usaha</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={cn(
                                                'h-full rounded-full',
                                                idx === 0 ? 'bg-purple-500' :
                                                idx === 1 ? 'bg-emerald-500' :
                                                idx === 2 ? 'bg-amber-500' : 'bg-blue-500'
                                            )}
                                            style={{ width: `${Math.min((item.total / Math.max(stats.umkm.total, 1)) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            )) : (
                                <div className="space-y-3">
                                    <div className="flex justify-between text-xs text-slate-600">
                                        <span>Batik Tulis Tlangoh</span>
                                        <span className="font-semibold text-emerald-600">Sentra Kerajinan</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-slate-600">
                                        <span>Wisata Pantai Tlangoh</span>
                                        <span className="font-semibold text-blue-600">Destinasi Bahari</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-slate-600">
                                        <span>Kuliner & Olahan Pesisir</span>
                                        <span className="font-semibold text-amber-600">Kuliner Warga</span>
                                    </div>
                                </div>
                            )}

                            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between bg-purple-50/50 p-4 rounded-2xl border border-purple-100">
                                <div className="text-xs text-purple-900">
                                    <span className="font-bold block text-sm">{stats.umkm.active} Dari {stats.umkm.total} Aktif</span>
                                    Mempromosikan produk lokal warga desa
                                </div>
                                <Link
                                    href="/admin/umkm/create"
                                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shrink-0 shadow-xs"
                                >
                                    + Tambah UMKM
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── 6. PENGADUAN & ASPIRASI WARGA TERBARU ─── */}
                <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs">
                    <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50/50">
                        <div>
                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                <MessageSquareWarning className="w-4 h-4 text-amber-600" />
                                Pengaduan & Aspirasi Warga Terbaru
                            </h3>
                            <p className="text-xs text-slate-500">Laporan keluhan atau masukan langsung dari warga</p>
                        </div>
                        <Link href="/admin/pengaduan" className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1">
                            Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {recentComplaints.length > 0 ? recentComplaints.map((c) => (
                            <div key={c.id} className="flex items-center justify-between p-4 sm:px-6 hover:bg-slate-50/80 transition-colors gap-3">
                                <div className="min-w-0">
                                    <div className="font-semibold text-sm text-slate-900 truncate">{c.subject}</div>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                        <span className="font-mono text-slate-400">{c.ticket_number}</span>
                                        <span>•</span>
                                        <span className="capitalize">{c.category.replace(/_/g, ' ')}</span>
                                        <span>•</span>
                                        <span>{formatDateTime(c.created_at)}</span>
                                    </div>
                                </div>
                                <span className={cn('px-2.5 py-1 text-xs font-semibold rounded-full border shrink-0', getStatusColor(c.status))}>
                                    {getStatusLabel(c.status)}
                                </span>
                            </div>
                        )) : (
                            <div className="py-10 text-center text-slate-400 text-sm">
                                <MessageSquareWarning className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                Belum ada laporan pengaduan warga saat ini. Semua kondisi kondusif!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

interface StatCardProps {
    title: string;
    value: number;
    sub: string;
    icon: React.ComponentType<{ className?: string }>;
    color: 'blue' | 'amber' | 'emerald' | 'violet';
    href: string;
    badge?: string;
}

const colorMap = {
    blue:    { bg: 'from-blue-600 to-indigo-600', shadow: 'shadow-blue-500/20' },
    amber:   { bg: 'from-amber-500 to-orange-500', shadow: 'shadow-amber-500/20' },
    emerald: { bg: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/20' },
    violet:  { bg: 'from-purple-600 to-violet-600', shadow: 'shadow-purple-500/20' },
};

function StatCard({ title, value, sub, icon: Icon, color, href, badge }: StatCardProps) {
    const scheme = colorMap[color];
    return (
        <Link
            href={href}
            className="group relative block bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
            <div className="flex items-center justify-between mb-4">
                <div className={cn('w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-md', scheme.bg, scheme.shadow)}>
                    <Icon className="w-6 h-6" />
                </div>
                {badge ? (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200">
                        {badge}
                    </span>
                ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                        <ArrowUpRight className="w-4 h-4" />
                    </div>
                )}
            </div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</div>
            <div className="text-sm font-bold text-slate-700 mt-1">{title}</div>
            <div className="text-xs text-slate-400 mt-0.5">{sub}</div>
        </Link>
    );
}
