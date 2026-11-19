<?php

use App\Http\Controllers\Admin\ApbdesController;
use App\Http\Controllers\Admin\ComplaintController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\NewsController;
use App\Http\Controllers\Admin\ServiceRequestController;
use App\Http\Controllers\Admin\UmkmController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Admin Routes — Protected by auth middleware + admin role
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified', 'role:admin|kades|sekdes|operator'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        // Dashboard
        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

        // Service Requests (Persuratan)
        Route::get('/surat', [ServiceRequestController::class, 'index'])->name('services.index');
        Route::get('/surat/{serviceRequest}', [ServiceRequestController::class, 'show'])->name('services.show');
        Route::patch('/surat/{serviceRequest}/status', [ServiceRequestController::class, 'updateStatus'])->name('services.update-status');
        Route::patch('/surat/{serviceRequest}/approve', [ServiceRequestController::class, 'approve'])->name('services.approve');
        Route::patch('/surat/{serviceRequest}/reject', [ServiceRequestController::class, 'reject'])->name('services.reject');
        Route::patch('/surat/{serviceRequest}/process', [ServiceRequestController::class, 'process'])->name('services.process');

        // Complaints (Pengaduan)
        Route::get('/pengaduan', [ComplaintController::class, 'index'])->name('complaints.index');
        Route::get('/pengaduan/{complaint}', [ComplaintController::class, 'show'])->name('complaints.show');
        Route::patch('/pengaduan/{complaint}/respond', [ComplaintController::class, 'respond'])->name('complaints.respond');

        // News & Announcements (CMS)
        Route::resource('berita', NewsController::class)
            ->parameters(['berita' => 'news'])
            ->names([
                'index'   => 'news.index',
                'create'  => 'news.create',
                'store'   => 'news.store',
                'edit'    => 'news.edit',
                'update'  => 'news.update',
                'destroy' => 'news.destroy',
            ]);

        // UMKM & Wisata
        Route::resource('umkm', UmkmController::class)
            ->names([
                'index'   => 'umkm.index',
                'create'  => 'umkm.create',
                'store'   => 'umkm.store',
                'edit'    => 'umkm.edit',
                'update'  => 'umkm.update',
                'destroy' => 'umkm.destroy',
            ]);

        // APBDes
        Route::get('/apbdes', [ApbdesController::class, 'index'])->name('apbdes.index');
        Route::post('/apbdes', [ApbdesController::class, 'store'])->name('apbdes.store');
        Route::put('/apbdes/{apbdes}', [ApbdesController::class, 'update'])->name('apbdes.update');
        Route::delete('/apbdes/{apbdes}', [ApbdesController::class, 'destroy'])->name('apbdes.destroy');

        // User Management (Kades only)
        Route::middleware('role:admin|kades')
            ->group(function () {
                Route::get('/pengguna', [UserController::class, 'index'])->name('users.index');
                Route::post('/pengguna', [UserController::class, 'store'])->name('users.store');
                Route::patch('/pengguna/{user}/role', [UserController::class, 'updateRole'])->name('users.update-role');
                Route::delete('/pengguna/{user}', [UserController::class, 'destroy'])->name('users.destroy');
            });
    });
