<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\News;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class NewsController extends Controller
{
    public function index(Request $request): Response
    {
        $query = News::with('author')->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $query->where('title', 'like', "%{$request->search}%");
        }

        $news = $query->paginate(12)->withQueryString();

        return Inertia::render('Admin/News/Index', [
            'news'    => $news,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/News/Form', ['news' => null]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title'        => 'required|string|max:255',
            'excerpt'      => 'nullable|string',
            'body'         => 'required|string',
            'category'     => 'required|in:berita,pengumuman,agenda',
            'status'       => 'required|in:draft,published',
            'cover_image'  => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('cover_image')) {
            $validated['cover_image'] = $request->file('cover_image')->store('news-covers', 'public');
        }

        $validated['user_id']      = auth()->id();
        $validated['slug']         = Str::slug($validated['title']);
        $validated['published_at'] = $validated['status'] === 'published' ? now() : null;

        News::create($validated);

        return redirect()->route('admin.news.index')->with('success', 'Berita berhasil dipublikasikan.');
    }

    public function edit(News $news): Response
    {
        return Inertia::render('Admin/News/Form', ['news' => $news]);
    }

    public function update(Request $request, News $news): RedirectResponse
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'excerpt'     => 'nullable|string',
            'body'        => 'required|string',
            'category'    => 'required|in:berita,pengumuman,agenda',
            'status'      => 'required|in:draft,published',
            'cover_image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('cover_image')) {
            $validated['cover_image'] = $request->file('cover_image')->store('news-covers', 'public');
        }

        if ($validated['status'] === 'published' && ! $news->published_at) {
            $validated['published_at'] = now();
        }

        $news->update($validated);

        return redirect()->route('admin.news.index')->with('success', 'Berita berhasil diperbarui.');
    }

    public function destroy(News $news): RedirectResponse
    {
        $news->delete();

        return back()->with('success', 'Berita berhasil dihapus.');
    }
}
