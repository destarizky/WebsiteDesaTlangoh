<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Apbdes;
use App\Models\Complaint;
use App\Models\News;
use App\Models\ServiceRequest;
use App\Models\Umkm;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $stats = [
            'service_requests' => [
                'total'      => ServiceRequest::count(),
                'pending'    => ServiceRequest::where('status', 'pending')->count(),
                'processing' => ServiceRequest::where('status', 'processing')->count(),
                'approved'   => ServiceRequest::where('status', 'approved')->count(),
                'rejected'   => ServiceRequest::where('status', 'rejected')->count(),
            ],
            'complaints' => [
                'total'       => Complaint::count(),
                'pending'     => Complaint::where('status', 'pending')->count(),
                'in_progress' => Complaint::where('status', 'in_progress')->count(),
                'resolved'    => Complaint::where('status', 'resolved')->count(),
            ],
            'news' => [
                'total'     => News::count(),
                'published' => News::where('status', 'published')->count(),
                'draft'     => News::where('status', 'draft')->count(),
            ],
            'umkm' => [
                'total'  => Umkm::count(),
                'active' => Umkm::where('is_active', true)->count(),
            ],
        ];

        $recentRequests = ServiceRequest::latest()->take(5)->get();
        $recentComplaints = Complaint::latest()->take(5)->get();

        $apbdesSummary = Apbdes::where('year', now()->year)
            ->whereNull('month')
            ->get()
            ->groupBy('type');

        // Tren Persuratan & Pengaduan 6 Bulan Terakhir
        $monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        $monthlyStats = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $mIdx = (int)$date->format('n') - 1;
            $label = $monthNames[$mIdx];
            $year = (int)$date->format('Y');
            $month = (int)$date->format('n');

            $srCount = ServiceRequest::whereYear('created_at', $year)
                ->whereMonth('created_at', $month)
                ->count();
            $complaintCount = Complaint::whereYear('created_at', $year)
                ->whereMonth('created_at', $month)
                ->count();

            $monthlyStats[] = [
                'month'       => $label,
                'surat'       => $srCount,
                'pengaduan'   => $complaintCount,
            ];
        }

        // Distribusi UMKM berdasarkan Kategori
        $umkmDistribution = Umkm::selectRaw('type, count(*) as count')
            ->groupBy('type')
            ->get()
            ->map(function ($item) {
                return [
                    'name'  => ucfirst($item->type),
                    'total' => (int)$item->count,
                ];
            });

        // Detail Alokasi Belanja APBDes
        $belanjaCategories = Apbdes::where('year', now()->year)
            ->where('type', 'belanja')
            ->whereNull('month')
            ->get()
            ->map(function ($item) {
                return [
                    'category'  => $item->category,
                    'anggaran'  => (float) $item->budgeted_amount,
                    'realisasi' => (float) $item->realized_amount,
                    'persen'    => $item->budgeted_amount > 0 ? round(($item->realized_amount / $item->budgeted_amount) * 100, 1) : 0,
                ];
            });

        return Inertia::render('Admin/Dashboard', [
            'stats'             => $stats,
            'recentRequests'    => $recentRequests,
            'recentComplaints'  => $recentComplaints,
            'apbdesSummary'     => $apbdesSummary,
            'monthlyStats'      => $monthlyStats,
            'umkmDistribution'  => $umkmDistribution,
            'belanjaCategories' => $belanjaCategories,
        ]);
    }
}
