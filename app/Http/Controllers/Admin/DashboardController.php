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

        return Inertia::render('Admin/Dashboard', [
            'stats'             => $stats,
            'recentRequests'    => $recentRequests,
            'recentComplaints'  => $recentComplaints,
            'apbdesSummary'     => $apbdesSummary,
        ]);
    }
}
