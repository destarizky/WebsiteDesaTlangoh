import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatRupiah(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

export function formatDate(dateString: string | null | undefined, options?: Intl.DateTimeFormatOptions): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        ...options,
    });
}

export function formatDateTime(dateString: string | null | undefined): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
}

export function getStatusColor(status: string): string {
    const colors: Record<string, string> = {
        pending:     'bg-amber-100 text-amber-800 border-amber-200',
        processing:  'bg-blue-100 text-blue-800 border-blue-200',
        approved:    'bg-emerald-100 text-emerald-800 border-emerald-200',
        rejected:    'bg-red-100 text-red-800 border-red-200',
        reviewed:    'bg-purple-100 text-purple-800 border-purple-200',
        in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
        resolved:    'bg-emerald-100 text-emerald-800 border-emerald-200',
        closed:      'bg-slate-100 text-slate-800 border-slate-200',
        published:   'bg-emerald-100 text-emerald-800 border-emerald-200',
        draft:       'bg-slate-100 text-slate-800 border-slate-200',
    };
    return colors[status] ?? 'bg-slate-100 text-slate-800 border-slate-200';
}

export function getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
        pending:     'Menunggu',
        processing:  'Diproses',
        approved:    'Disetujui',
        rejected:    'Ditolak',
        reviewed:    'Ditinjau',
        in_progress: 'Sedang Ditangani',
        resolved:    'Selesai',
        closed:      'Ditutup',
        published:   'Dipublikasikan',
        draft:       'Draft',
    };
    return labels[status] ?? status;
}
