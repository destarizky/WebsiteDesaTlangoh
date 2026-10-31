import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link } from '@inertiajs/react';
import {
    FileText, MessageSquareWarning, Newspaper, TrendingUp,
    Clock, CheckCircle2, XCircle, AlertCircle, Users,
    ArrowRight, BarChart3
} from 'lucide-react';
import { formatRupiah, formatDateTime, getStatusLabel, getStatusColor } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

interface Props {
    stats: Stats;
    recentRequests: ServiceRequest[];
    recentComplaints: Complaint[];
    apbdesSummary: Record<string, { budgeted_amount: number; realized_amount: number }[]>;
}

export default function AdminDashboard({ stats, recentRequests, recentComplaints, apbdesSummary }: Props) {
    const pendapatanTotal = apbdesSummary['pendapatan']?.reduce((a, b) => a + Number(b.budgeted_amount), 0) ?? 0;
    const belanjaTotal    = apbdesSummary['belanja']?.reduce((a, b) => a + Number(b.budgeted_amount), 0) ?? 0;
    const pendapatanReal  = apbdesSummary['pendapatan']?.reduce((a, b) => a + Number(b.realized_amount), 0) ?? 0;
    const belanjaReal     = apbdesSummary['belanja']?.reduce((a, b) => a + Number(b.realized_amount), 0) ?? 0;

    const chartData = [
        { name: 'Pendapatan', Anggaran: pendapatanTotal / 1e6, Realisasi: pendapatanReal / 1e6 },
        { name: 'Belanja',    Anggaran: belanjaTotal / 1e6,    Realisasi: belanjaReal / 1e6 },
    ];

    return (
        <AdminLayout title="Dashboard">
            <Head title="Dashboard Admin — Desa Tlangoh" />

            <div className="space-y-6">
                {/* Welcome */}
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Selamat Datang! 👋</h2>
                    <p className="text-slate-500 text-sm mt-1">Ringkasan aktivitas Desa Tlangoh hari ini</p>
                </div>

                {/* Overview Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Pengajuan Surat"
                        value={stats.service_requests.total}
                        sub={`${stats.service_requests.pending} menunggu`}
                        icon={FileText}
                        color="blue"
                        href="/admin/surat"
                    />
                    <StatCard
                        title="Pengaduan Warga"
                        value={stats.complaints.total}
                        sub={`${stats.complaints.pending} belum ditangani`}
                        icon={MessageSquareWarning}
                        color="amber"
                        href="/admin/pengaduan"
                    />
                    <StatCard
                        title="Berita & Info"
                        value={stats.news.published}
                        sub={`${stats.news.draft} draft`}
                        icon={Newspaper}
                        color="emerald"
                        href="/admin/berita"
                    />
                    <StatCard
                        title="UMKM Aktif"
                        value={stats.umkm.active}
                        sub={`dari ${stats.umkm.total} total`}
                        icon={Users}
                        color="violet"
                        href="/admin/umkm"
                    />
                </div>

                {/* Surat Status Breakdown */}
                <div className="grid lg:grid-cols-3 gap-4">
                    {[
                        { label: 'Menunggu',  value: stats.service_requests.pending,    icon: Clock,         color: 'text-amber-600 bg-amber-50 border-amber-100' },
                        { label: 'Diproses',  value: stats.service_requests.processing, icon: AlertCircle,   color: 'text-blue-600 bg-blue-50 border-blue-100' },
                        { label: 'Disetujui', value: stats.service_requests.approved,   icon: CheckCircle2,  color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
                        { label: 'Ditolak',   value: stats.service_requests.rejected,   icon: XCircle,       color: 'text-red-600 bg-red-50 border-red-100' },
                        { label: 'Pengaduan Aktif', value: stats.complaints.in_progress, icon: MessageSquareWarning, color: 'text-orange-600 bg-orange-50 border-orange-100' },
                        { label: 'Pengaduan Selesai', value: stats.complaints.resolved, icon: CheckCircle2, color: 'text-teal-600 bg-teal-50 border-teal-100' },
                    ].map((item) => (
                        <div key={item.label} className={cn('flex items-center gap-3 p-4 rounded-xl border', item.color)}>
                            <item.icon className="w-5 h-5 shrink-0" />
                            <div>
                                <div className="text-xl font-bold">{item.value}</div>
                                <div className="text-xs font-medium opacity-80">{item.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-5 gap-6">
                    {/* Recent Service Requests */}
                    <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-blue-500" />
                                Pengajuan Surat Terbaru
                            </h3>
                            <Link href="/admin/surat" className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {recentRequests.length > 0 ? recentRequests.map((req) => (
                                <div key={req.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-sm text-slate-900 truncate">{req.requester_name}</div>
                                        <div className="text-xs text-slate-400 font-mono">{req.ticket_number}</div>
                                    </div>
                                    <span className={cn('px-2.5 py-1 text-xs font-medium rounded-full border', getStatusColor(req.status))}>
                                        {getStatusLabel(req.status)}
                                    </span>
                                </div>
                            )) : (
                                <div className="px-5 py-8 text-center text-slate-400 text-sm">Belum ada pengajuan surat</div>
                            )}
                        </div>
                    </div>

                    {/* APBDes Snapshot */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                <BarChart3 className="w-4 h-4 text-emerald-500" />
                                APBDes {new Date().getFullYear()}
                            </h3>
                            <Link href="/admin/apbdes" className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                                Detail <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                        <div className="p-5">
                            <div className="space-y-4 mb-5">
                                <div>
                                    <div className="flex justify-between text-sm mb-1.5">
                                        <span className="text-slate-500">Pendapatan</span>
                                        <span className="font-medium text-slate-900 text-xs">{formatRupiah(pendapatanTotal)}</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-emerald-500 rounded-full"
                                            style={{ width: `${pendapatanTotal > 0 ? Math.min((pendapatanReal / pendapatanTotal) * 100, 100) : 0}%` }}
                                        />
                                    </div>
                                    <div className="text-xs text-slate-400 mt-1">
                                        {formatRupiah(pendapatanReal)} terealisasi ({pendapatanTotal > 0 ? ((pendapatanReal / pendapatanTotal) * 100).toFixed(1) : 0}%)
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1.5">
                                        <span className="text-slate-500">Belanja</span>
                                        <span className="font-medium text-slate-900 text-xs">{formatRupiah(belanjaTotal)}</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-rose-500 rounded-full"
                                            style={{ width: `${belanjaTotal > 0 ? Math.min((belanjaReal / belanjaTotal) * 100, 100) : 0}%` }}
                                        />
                                    </div>
                                    <div className="text-xs text-slate-400 mt-1">
                                        {formatRupiah(belanjaReal)} terealisasi ({belanjaTotal > 0 ? ((belanjaReal / belanjaTotal) * 100).toFixed(1) : 0}%)
                                    </div>
                                </div>
                            </div>
                            <ResponsiveContainer width="100%" height={120}>
                                <BarChart data={chartData} barGap={6}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                                    <Tooltip formatter={(v: number) => [`${v.toFixed(1)} Juta`, '']} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                                    <Bar dataKey="Anggaran" fill="#10b981" radius={[4, 4, 0, 0]} opacity={0.5} />
                                    <Bar dataKey="Realisasi" fill="#10b981" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Recent Complaints */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                            <MessageSquareWarning className="w-4 h-4 text-amber-500" />
                            Pengaduan Terbaru
                        </h3>
                        <Link href="/admin/pengaduan" className="text-xs text-amber-600 hover:text-amber-700 flex items-center gap-1">
                            Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {recentComplaints.length > 0 ? recentComplaints.map((c) => (
                            <div key={c.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm text-slate-900 truncate">{c.subject}</div>
                                    <div className="text-xs text-slate-400 capitalize">{c.category.replace('_', ' ')} · {formatDateTime(c.created_at)}</div>
                                </div>
                                <span className={cn('px-2.5 py-1 text-xs font-medium rounded-full border', getStatusColor(c.status))}>
                                    {getStatusLabel(c.status)}
                                </span>
                            </div>
                        )) : (
                            <div className="px-5 py-8 text-center text-slate-400 text-sm">Belum ada pengaduan</div>
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
}

const colorMap = {
    blue:    'from-blue-500 to-blue-600',
    amber:   'from-amber-500 to-orange-500',
    emerald: 'from-emerald-500 to-teal-600',
    violet:  'from-violet-500 to-purple-600',
};

function StatCard({ title, value, sub, icon: Icon, color, href }: StatCardProps) {
    return (
        <Link href={href} className="group block bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4', colorMap[color])}>
                <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{value}</div>
            <div className="text-sm font-medium text-slate-700 mt-0.5">{title}</div>
            <div className="text-xs text-slate-400 mt-1">{sub}</div>
        </Link>
    );
}
