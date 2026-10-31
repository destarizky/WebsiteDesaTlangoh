<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ServiceRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServiceRequestController extends Controller
{
    public function index(Request $request): Response
    {
        $query = ServiceRequest::latest();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('ticket_number', 'like', "%{$request->search}%")
                  ->orWhere('requester_name', 'like', "%{$request->search}%")
                  ->orWhere('requester_nik', 'like', "%{$request->search}%");
            });
        }

        $requests = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/Services/Index', [
            'requests' => $requests,
            'filters'  => $request->only(['status', 'search']),
        ]);
    }

    public function show(ServiceRequest $serviceRequest): Response
    {
        return Inertia::render('Admin/Services/Show', [
            'serviceRequest' => $serviceRequest->load('processor'),
        ]);
    }

    public function approve(ServiceRequest $serviceRequest): RedirectResponse
    {
        $serviceRequest->update([
            'status'        => 'approved',
            'processed_by'  => auth()->id(),
            'processed_at'  => now(),
        ]);

        return back()->with('success', 'Pengajuan surat disetujui.');
    }

    public function reject(Request $request, ServiceRequest $serviceRequest): RedirectResponse
    {
        $request->validate(['admin_notes' => 'required|string']);

        $serviceRequest->update([
            'status'        => 'rejected',
            'admin_notes'   => $request->admin_notes,
            'processed_by'  => auth()->id(),
            'processed_at'  => now(),
        ]);

        return back()->with('success', 'Pengajuan surat ditolak.');
    }

    public function process(ServiceRequest $serviceRequest): RedirectResponse
    {
        $serviceRequest->update([
            'status'       => 'processing',
            'processed_by' => auth()->id(),
        ]);

        return back()->with('success', 'Pengajuan sedang diproses.');
    }
}
