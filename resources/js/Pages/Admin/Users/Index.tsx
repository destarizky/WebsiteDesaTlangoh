import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, Trash2, Shield, User, Mail, Key, ShieldCheck, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn, formatDateTime } from '@/lib/utils';
import { useState } from 'react';

interface RoleItem {
    id: number;
    name: string;
}

interface UserItem {
    id: number;
    name: string;
    email: string;
    created_at: string;
    roles: RoleItem[];
}

interface PaginatedUsers {
    data: UserItem[];
    current_page: number;
    last_page: number;
    total: number;
    from: number;
    to: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    users: PaginatedUsers;
    roles: RoleItem[];
}

export default function AdminUsersIndex({ users, roles }: Props) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: roles[0]?.name || 'operator',
    });

    const handleCreateUser = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/pengguna', {
            onSuccess: () => {
                setIsAddModalOpen(false);
                reset();
            },
        });
    };

    const handleRoleChange = (userId: number, newRole: string) => {
        router.patch(`/admin/pengguna/${userId}/role`, { role: newRole }, { preserveScroll: true });
    };

    const handleDeleteUser = (user: UserItem) => {
        if (confirm(`Apakah Anda yakin ingin menghapus akun "${user.name}"?`)) {
            router.delete(`/admin/pengguna/${user.id}`, { preserveScroll: true });
        }
    };

    const roleBadgeColor: Record<string, string> = {
        admin: 'bg-red-50 text-red-700 border-red-200',
        kades: 'bg-amber-50 text-amber-800 border-amber-200',
        sekdes: 'bg-blue-50 text-blue-700 border-blue-200',
        operator: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    };

    return (
        <AdminLayout title="Manajemen Pengguna & Hak Akses">
            <Head title="Pengguna & Hak Akses — Admin Desa Tlangoh" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 font-serif">
                            Manajemen Pengguna
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Kelola akun aparatur desa, kepala desa, sekretaris, dan operator sistem.
                        </p>
                    </div>

                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition shadow-xs"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Pengguna Baru
                    </button>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/75 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                    <th className="py-4 px-6">Nama & Email</th>
                                    <th className="py-4 px-6">Hak Akses (Role)</th>
                                    <th className="py-4 px-6">Terdaftar Sejak</th>
                                    <th className="py-4 px-6 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {users.data.map((user) => {
                                    const currentRole = user.roles[0]?.name || 'operator';
                                    return (
                                        <tr key={user.id} className="hover:bg-slate-50/60 transition">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm shrink-0">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-slate-900">{user.name}</div>
                                                        <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                                                            <Mail className="w-3 h-3" />
                                                            {user.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <select
                                                        value={currentRole}
                                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                        className={cn(
                                                            'text-xs font-semibold rounded-lg px-2.5 py-1 border focus:outline-none cursor-pointer',
                                                            roleBadgeColor[currentRole] || 'bg-slate-100 text-slate-700 border-slate-200'
                                                        )}
                                                    >
                                                        {roles.map((r) => (
                                                            <option key={r.id} value={r.name}>
                                                                {r.name.toUpperCase()}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-xs text-slate-500 whitespace-nowrap">
                                                {formatDateTime(user.created_at)}
                                            </td>
                                            <td className="py-4 px-6 text-right whitespace-nowrap">
                                                <button
                                                    onClick={() => handleDeleteUser(user)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                                    title="Hapus Pengguna"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {users.last_page > 1 && (
                        <div className="p-4 border-t border-slate-100 flex items-center justify-between">
                            <p className="text-xs text-slate-500">
                                Menampilkan {users.from} - {users.to} dari {users.total} pengguna
                            </p>
                            <div className="flex items-center gap-1.5">
                                {users.links.map((link, idx) => {
                                    if (link.label.includes('&laquo;') || link.label.includes('Previous')) {
                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => link.url && router.get(link.url)}
                                                disabled={!link.url}
                                                className="p-2 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-30"
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                            </button>
                                        );
                                    }
                                    if (link.label.includes('&raquo;') || link.label.includes('Next')) {
                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => link.url && router.get(link.url)}
                                                disabled={!link.url}
                                                className="p-2 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-30"
                                            >
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        );
                                    }
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => link.url && router.get(link.url)}
                                            className={cn(
                                                'px-3 py-1.5 rounded-lg border text-xs font-medium',
                                                link.active ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-200 text-slate-600'
                                            )}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Tambah Pengguna */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                                Tambah Akun Pengguna
                            </h3>
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                    Nama Lengkap
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Contoh: Budi Santoso"
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                />
                                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                    Alamat Email
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="nama@desatlangoh.id"
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                />
                                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                    Hak Akses (Role)
                                </label>
                                <select
                                    value={data.role}
                                    onChange={(e) => setData('role', e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 capitalize"
                                >
                                    {roles.map((r) => (
                                        <option key={r.id} value={r.name}>
                                            {r.name.toUpperCase()}
                                        </option>
                                    ))}
                                </select>
                                {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                    Kata Sandi (Password)
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Minimal 8 karakter"
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                />
                                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                    Konfirmasi Kata Sandi
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="Ulangi kata sandi"
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 font-medium"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Akun'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
