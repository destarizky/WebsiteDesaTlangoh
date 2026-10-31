<?php

use App\Http\Controllers\Frontend\ComplaintController;
use App\Http\Controllers\Frontend\HomeController;
use App\Http\Controllers\Frontend\ServiceRequestController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Frontend Routes
|--------------------------------------------------------------------------
*/

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/berita', [HomeController::class, 'news'])->name('news.index');
Route::get('/berita/{slug}', [HomeController::class, 'showNews'])->name('news.show');
Route::get('/apbdes', [HomeController::class, 'apbdes'])->name('apbdes.index');
Route::get('/potensi-umkm', [HomeController::class, 'umkm'])->name('umkm.index');

// Layanan Persuratan
Route::get('/layanan-surat', [ServiceRequestController::class, 'create'])->name('services.create');
Route::post('/layanan-surat', [ServiceRequestController::class, 'store'])->name('services.store');
Route::get('/layanan-surat/berhasil/{ticket}', [ServiceRequestController::class, 'success'])->name('services.success');
Route::get('/layanan-surat/lacak', [ServiceRequestController::class, 'track'])->name('services.track');

// Pengaduan Warga
Route::get('/pengaduan', [ComplaintController::class, 'create'])->name('complaint.create');
Route::post('/pengaduan', [ComplaintController::class, 'store'])->name('complaint.store');
Route::get('/pengaduan/berhasil/{ticket}', [ComplaintController::class, 'success'])->name('complaint.success');

// Dashboard Alias Redirect
Route::get('/dashboard', function () {
    return redirect()->route('admin.dashboard');
})->middleware(['auth'])->name('dashboard');

/*
|--------------------------------------------------------------------------
| Admin Routes (requires auth + role)
|--------------------------------------------------------------------------
*/
require __DIR__ . '/admin.php';

/*
|--------------------------------------------------------------------------
| Auth Routes (Breeze)
|--------------------------------------------------------------------------
*/
require __DIR__ . '/auth.php';
