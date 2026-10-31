<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Complaint;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ComplaintController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Complaint::latest();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('ticket_number', 'like', "%{$request->search}%")
                  ->orWhere('subject', 'like', "%{$request->search}%")
                  ->orWhere('reporter_name', 'like', "%{$request->search}%");
            });
        }

        $complaints = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/Complaints/Index', [
            'complaints' => $complaints,
            'filters'    => $request->only(['status', 'category', 'search']),
        ]);
    }

    public function show(Complaint $complaint): Response
    {
        return Inertia::render('Admin/Complaints/Show', [
            'complaint' => $complaint->load('handler'),
        ]);
    }

    public function respond(Request $request, Complaint $complaint): RedirectResponse
    {
        $request->validate([
            'admin_response' => 'required|string',
            'status'         => 'required|in:reviewed,in_progress,resolved,closed',
        ]);

        $data = [
            'admin_response' => $request->admin_response,
            'status'         => $request->status,
            'handled_by'     => auth()->id(),
        ];

        if ($request->status === 'resolved') {
            $data['resolved_at'] = now();
        }

        $complaint->update($data);

        return back()->with('success', 'Tanggapan berhasil disimpan.');
    }
}
