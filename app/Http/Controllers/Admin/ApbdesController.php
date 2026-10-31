<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Apbdes;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ApbdesController extends Controller
{
    public function index(Request $request): Response
    {
        $year = $request->get('year', now()->year);

        $data = Apbdes::where('year', $year)
            ->orderBy('type')
            ->orderBy('category')
            ->get();

        $years = Apbdes::selectRaw('DISTINCT year')
            ->orderByDesc('year')
            ->pluck('year');

        $summary = [
            'pendapatan' => [
                'budgeted' => $data->where('type', 'pendapatan')->sum('budgeted_amount'),
                'realized' => $data->where('type', 'pendapatan')->sum('realized_amount'),
            ],
            'belanja' => [
                'budgeted' => $data->where('type', 'belanja')->sum('budgeted_amount'),
                'realized' => $data->where('type', 'belanja')->sum('realized_amount'),
            ],
            'pembiayaan' => [
                'budgeted' => $data->where('type', 'pembiayaan')->sum('budgeted_amount'),
                'realized' => $data->where('type', 'pembiayaan')->sum('realized_amount'),
            ],
        ];

        return Inertia::render('Admin/Apbdes/Index', [
            'data'         => $data,
            'years'        => $years,
            'selectedYear' => $year,
            'summary'      => $summary,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'year'             => 'required|integer|min:2020|max:2099',
            'month'            => 'nullable|integer|min:1|max:12',
            'category'         => 'required|string|max:255',
            'type'             => 'required|in:pendapatan,belanja,pembiayaan',
            'description'      => 'required|string',
            'budgeted_amount'  => 'required|numeric|min:0',
            'realized_amount'  => 'required|numeric|min:0',
            'notes'            => 'nullable|string',
        ]);

        $validated['user_id'] = auth()->id();

        Apbdes::create($validated);

        return back()->with('success', 'Data APBDes berhasil ditambahkan.');
    }

    public function update(Request $request, Apbdes $apbdes): RedirectResponse
    {
        $validated = $request->validate([
            'year'             => 'required|integer',
            'month'            => 'nullable|integer|min:1|max:12',
            'category'         => 'required|string|max:255',
            'type'             => 'required|in:pendapatan,belanja,pembiayaan',
            'description'      => 'required|string',
            'budgeted_amount'  => 'required|numeric|min:0',
            'realized_amount'  => 'required|numeric|min:0',
            'notes'            => 'nullable|string',
        ]);

        $apbdes->update($validated);

        return back()->with('success', 'Data APBDes berhasil diperbarui.');
    }

    public function destroy(Apbdes $apbdes): RedirectResponse
    {
        $apbdes->delete();

        return back()->with('success', 'Data APBDes berhasil dihapus.');
    }
}
