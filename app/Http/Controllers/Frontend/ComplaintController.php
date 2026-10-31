<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Complaint;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ComplaintController extends Controller
{
    public function create(): Response
    {
        $categories = [
            'infrastruktur'     => 'Infrastruktur & Jalan',
            'pelayanan_publik'  => 'Pelayanan Publik',
            'lingkungan'        => 'Lingkungan & Kebersihan',
            'keamanan'          => 'Keamanan & Ketertiban',
            'sosial'            => 'Masalah Sosial',
            'lainnya'           => 'Lainnya',
        ];

        return Inertia::render('Frontend/Complaint/Create', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'reporter_name'   => 'required_if:is_anonymous,false|nullable|string|max:255',
            'reporter_phone'  => 'nullable|string|max:20',
            'category'        => 'required|in:infrastruktur,pelayanan_publik,lingkungan,keamanan,sosial,lainnya',
            'subject'         => 'required|string|max:255',
            'description'     => 'required|string',
            'location'        => 'nullable|string|max:255',
            'attachment'      => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
            'is_anonymous'    => 'boolean',
        ]);

        if ($request->hasFile('attachment')) {
            $validated['attachment'] = $request->file('attachment')->store('complaint-attachments', 'public');
        }

        $complaint = Complaint::create($validated);

        return redirect()->route('complaint.success', $complaint->ticket_number)
            ->with('success', 'Pengaduan berhasil dikirim!');
    }

    public function success(string $ticket): Response
    {
        $complaint = Complaint::where('ticket_number', $ticket)->firstOrFail();

        return Inertia::render('Frontend/Complaint/Success', [
            'complaint' => $complaint,
        ]);
    }
}
