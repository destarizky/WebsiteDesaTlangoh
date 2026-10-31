<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Umkm;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UmkmController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Umkm::with('author')->latest();

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('search')) {
            $query->where('name', 'like', "%{$request->search}%");
        }

        $items = $query->paginate(12)->withQueryString();

        return Inertia::render('Admin/Umkm/Index', [
            'items'   => $items,
            'filters' => $request->only(['type', 'search']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Umkm/Form', ['item' => null]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'         => 'required|string|max:255',
            'type'         => 'required|in:produk,kuliner,kerajinan,wisata,jasa',
            'description'  => 'required|string',
            'owner_name'   => 'required|string|max:255',
            'phone'        => 'nullable|string|max:20',
            'address'      => 'nullable|string',
            'cover_image'  => 'nullable|image|max:2048',
            'price_from'   => 'nullable|numeric',
            'price_to'     => 'nullable|numeric',
            'is_active'    => 'boolean',
            'is_featured'  => 'boolean',
        ]);

        if ($request->hasFile('cover_image')) {
            $validated['cover_image'] = $request->file('cover_image')->store('umkm-covers', 'public');
        }

        $validated['user_id'] = auth()->id();

        Umkm::create($validated);

        return redirect()->route('admin.umkm.index')->with('success', 'UMKM berhasil ditambahkan.');
    }

    public function edit(Umkm $umkm): Response
    {
        return Inertia::render('Admin/Umkm/Form', ['item' => $umkm]);
    }

    public function update(Request $request, Umkm $umkm): RedirectResponse
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'type'        => 'required|in:produk,kuliner,kerajinan,wisata,jasa',
            'description' => 'required|string',
            'owner_name'  => 'required|string|max:255',
            'phone'       => 'nullable|string|max:20',
            'address'     => 'nullable|string',
            'cover_image' => 'nullable|image|max:2048',
            'price_from'  => 'nullable|numeric',
            'price_to'    => 'nullable|numeric',
            'is_active'   => 'boolean',
            'is_featured' => 'boolean',
        ]);

        if ($request->hasFile('cover_image')) {
            $validated['cover_image'] = $request->file('cover_image')->store('umkm-covers', 'public');
        }

        $umkm->update($validated);

        return redirect()->route('admin.umkm.index')->with('success', 'UMKM berhasil diperbarui.');
    }

    public function destroy(Umkm $umkm): RedirectResponse
    {
        $umkm->delete();

        return back()->with('success', 'UMKM berhasil dihapus.');
    }
}
