<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\ServiceRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServiceRequestController extends Controller
{
    public function create(): Response
    {
        $letterTypes = [
            'surat_keterangan_domisili'     => 'Surat Keterangan Domisili',
            'surat_keterangan_tidak_mampu'  => 'Surat Keterangan Tidak Mampu',
            'surat_keterangan_usaha'        => 'Surat Keterangan Usaha',
            'surat_pengantar_nikah'         => 'Surat Pengantar Nikah',
            'surat_keterangan_kelahiran'    => 'Surat Keterangan Kelahiran',
            'surat_keterangan_kematian'     => 'Surat Keterangan Kematian',
            'surat_keterangan_lainnya'      => 'Surat Keterangan Lainnya',
        ];

        return Inertia::render('Frontend/Services/Create', [
            'letterTypes' => $letterTypes,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'requester_name'    => 'required|string|max:255',
            'requester_nik'     => 'required|digits:16',
            'requester_phone'   => 'nullable|string|max:20',
            'requester_address' => 'required|string',
            'letter_type'       => 'required|in:surat_keterangan_domisili,surat_keterangan_tidak_mampu,surat_keterangan_usaha,surat_pengantar_nikah,surat_keterangan_kelahiran,surat_keterangan_kematian,surat_keterangan_lainnya',
            'purpose'           => 'required|string',
            'attachment'        => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('attachment')) {
            $validated['attachment'] = $request->file('attachment')->store('service-attachments', 'public');
        }

        $serviceRequest = ServiceRequest::create($validated);

        return redirect()->route('services.success', $serviceRequest->ticket_number)
            ->with('success', 'Pengajuan surat berhasil dikirim!');
    }

    public function success(string $ticket): Response
    {
        $serviceRequest = ServiceRequest::where('ticket_number', $ticket)->firstOrFail();

        return Inertia::render('Frontend/Services/Success', [
            'serviceRequest' => $serviceRequest,
        ]);
    }

    public function track(Request $request): Response
    {
        $ticket = $request->get('ticket');
        $serviceRequest = null;

        if ($ticket) {
            $serviceRequest = ServiceRequest::where('ticket_number', $ticket)->first();
        }

        return Inertia::render('Frontend/Services/Track', [
            'serviceRequest' => $serviceRequest,
            'ticket'         => $ticket,
        ]);
    }
}
