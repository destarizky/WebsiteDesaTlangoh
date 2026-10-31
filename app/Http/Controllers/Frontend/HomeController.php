<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Apbdes;
use App\Models\Complaint;
use App\Models\News;
use App\Models\ServiceRequest;
use App\Models\Umkm;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $featuredNews = News::published()
            ->with('author')
            ->latest('published_at')
            ->first();

        $latestNews = News::published()
            ->with('author')
            ->latest('published_at')
            ->skip(1)
            ->take(5)
            ->get();

        $announcements = News::published()
            ->where('category', 'pengumuman')
            ->latest('published_at')
            ->take(3)
            ->get();

        $apbdesSummary = Apbdes::where('year', now()->year)
            ->whereNull('month')
            ->get()
            ->groupBy('type');

        $umkmFeatured = Umkm::active()
            ->where('is_featured', true)
            ->take(6)
            ->get();

        return Inertia::render('Frontend/Home', [
            'featuredNews'  => $featuredNews,
            'latestNews'    => $latestNews,
            'announcements' => $announcements,
            'apbdesSummary' => $apbdesSummary,
            'umkmFeatured'  => $umkmFeatured,
            'stats'         => [
                'penduduk'          => 3247,
                'kk'                => 956,
                'luas_wilayah'      => '425 Ha',
                'dusun'             => 4,
                'rt'                => 12,
                'rw'                => 4,
            ],
        ]);
    }

    public function news(): Response
    {
        $news = News::published()
            ->with('author')
            ->latest('published_at')
            ->paginate(9);

        $categories = ['berita', 'pengumuman', 'agenda'];

        return Inertia::render('Frontend/News/Index', [
            'news'       => $news,
            'categories' => $categories,
        ]);
    }

    public function showNews(string $slug): Response
    {
        $article = News::published()
            ->with('author')
            ->where('slug', $slug)
            ->firstOrFail();

        $article->increment('views');

        $related = News::published()
            ->where('category', $article->category)
            ->where('id', '!=', $article->id)
            ->take(3)
            ->get();

        return Inertia::render('Frontend/News/Show', [
            'article' => $article,
            'related' => $related,
        ]);
    }

    public function apbdes(): Response
    {
        $year = request('year', now()->year);

        $data = Apbdes::where('year', $year)
            ->orderBy('type')
            ->orderBy('category')
            ->get()
            ->groupBy('type');

        $years = Apbdes::selectRaw('DISTINCT year')
            ->orderByDesc('year')
            ->pluck('year');

        return Inertia::render('Frontend/Apbdes/Index', [
            'apbdes'      => $data,
            'selectedYear' => $year,
            'years'        => $years,
        ]);
    }

    public function umkm(): Response
    {
        $type   = request('type', 'all');
        $query  = Umkm::active()->latest();

        if ($type !== 'all') {
            $query->where('type', $type);
        }

        $items = $query->paginate(12);
        $types = ['all', 'produk', 'kuliner', 'kerajinan', 'wisata', 'jasa'];

        return Inertia::render('Frontend/Umkm/Index', [
            'items'        => $items,
            'types'        => $types,
            'selectedType' => $type,
        ]);
    }
}
