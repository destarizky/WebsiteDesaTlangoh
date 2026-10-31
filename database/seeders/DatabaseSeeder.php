<?php

namespace Database\Seeders;

use App\Models\Apbdes;
use App\Models\News;
use App\Models\Umkm;
use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create Roles
        $roles = ['admin', 'kades', 'sekdes', 'operator'];
        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role]);
        }

        // Create Admin User
        $admin = User::firstOrCreate(
            ['email' => 'admin@desatlangoh.id'],
            [
                'name'     => 'Admin Desa Tlangoh',
                'password' => bcrypt('password'),
            ]
        );
        $admin->assignRole('admin');

        // Create Kades User
        $kades = User::firstOrCreate(
            ['email' => 'kades@desatlangoh.id'],
            [
                'name'     => 'Kepala Desa Tlangoh',
                'password' => bcrypt('password'),
            ]
        );
        $kades->assignRole('kades');

        // Seed Sample News
        $newsItems = [
            [
                'title'        => 'Pembangunan Jalan Desa Tlangoh Tahap II Dimulai',
                'excerpt'      => 'Pemerintah Desa Tlangoh memulai pembangunan jalan desa tahap kedua yang menghubungkan Dusun Krajan dengan Dusun Lor.',
                'body'         => '<p>Pembangunan infrastruktur jalan desa terus digenjot oleh Pemerintah Desa Tlangoh. Memasuki tahap kedua, proyek ini akan memperluas jangkauan akses jalan hingga ke wilayah Dusun Lor yang selama ini masih mengalami kendala akses.</p><p>Dana yang dialokasikan dari APBDes tahun ini mencapai Rp 450 juta, diharapkan proyek ini rampung sebelum musim hujan tiba.</p>',
                'category'     => 'berita',
                'status'       => 'published',
                'published_at' => now()->subDays(2),
            ],
            [
                'title'        => 'Pengumuman: Jadwal Pelayanan Surat Menyurat Desa',
                'excerpt'      => 'Demi memberikan pelayanan terbaik kepada warga, kami mengumumkan jadwal pelayanan surat menyurat terbaru.',
                'body'         => '<p>Mulai 1 November 2024, pelayanan surat menyurat di Kantor Desa Tlangoh akan menggunakan sistem antrian digital. Warga dapat mengajukan permohonan surat melalui website ini atau datang langsung ke kantor desa.</p><p>Jam operasional: Senin - Jumat, pukul 08.00 - 15.00 WIB.</p>',
                'category'     => 'pengumuman',
                'status'       => 'published',
                'published_at' => now()->subDays(1),
            ],
            [
                'title'        => 'Festival UMKM Desa Tlangoh 2024: Pamerkan Produk Lokal Unggulan',
                'excerpt'      => 'Festival tahunan UMKM Desa Tlangoh akan kembali hadir, menampilkan puluhan produk unggulan dari warga desa.',
                'body'         => '<p>Festival UMKM Desa Tlangoh 2024 akan diselenggarakan pada tanggal 15-17 November 2024 di halaman Balai Desa. Acara ini diharapkan dapat meningkatkan perekonomian warga sekaligus memperkenalkan produk-produk lokal kepada masyarakat luas.</p>',
                'category'     => 'agenda',
                'status'       => 'published',
                'published_at' => now(),
            ],
        ];

        foreach ($newsItems as $item) {
            $item['user_id'] = $admin->id;
            News::firstOrCreate(['title' => $item['title']], $item);
        }

        // Seed Sample UMKM
        $umkmItems = [
            [
                'name'        => 'Keripik Singkong Bu Sari',
                'type'        => 'kuliner',
                'description' => 'Keripik singkong gurih dengan berbagai varian rasa: original, balado, keju, dan pedas manis. Dibuat dari singkong pilihan dari kebun sendiri.',
                'owner_name'  => 'Sari Wahyuni',
                'phone'       => '08123456789',
                'address'     => 'Dusun Krajan RT 02/RW 01',
                'price_from'  => 10000,
                'price_to'    => 25000,
                'is_active'   => true,
                'is_featured' => true,
            ],
            [
                'name'        => 'Batik Tulis Tlangoh',
                'type'        => 'kerajinan',
                'description' => 'Batik tulis khas Desa Tlangoh dengan motif-motif lokal yang terinspirasi dari kekayaan alam desa. Dikerjakan oleh pengrajin berpengalaman.',
                'owner_name'  => 'Kelompok Pengrajin Batik Tlangoh',
                'phone'       => '08198765432',
                'address'     => 'Dusun Tengah RT 01/RW 02',
                'price_from'  => 150000,
                'price_to'    => 500000,
                'is_active'   => true,
                'is_featured' => true,
            ],
            [
                'name'        => 'Wisata Alam Bukit Tlangoh',
                'type'        => 'wisata',
                'description' => 'Destinasi wisata alam dengan pemandangan sawah dan perbukitan yang memukau. Tersedia jalur trekking, area camping, dan gazebo untuk bersantai.',
                'owner_name'  => 'Pokdarwis Desa Tlangoh',
                'phone'       => '081234567890',
                'address'     => 'Dusun Lor, Desa Tlangoh',
                'price_from'  => 5000,
                'price_to'    => 15000,
                'is_active'   => true,
                'is_featured' => true,
            ],
        ];

        foreach ($umkmItems as $item) {
            $item['user_id'] = $admin->id;
            Umkm::firstOrCreate(['name' => $item['name']], $item);
        }

        // Seed Sample APBDes
        $apbdesItems = [
            ['type' => 'pendapatan', 'category' => 'Pendapatan Asli Desa',   'description' => 'Hasil Usaha Desa',      'budgeted_amount' => 50000000,  'realized_amount' => 47500000],
            ['type' => 'pendapatan', 'category' => 'Dana Transfer',           'description' => 'Dana Desa (APBN)',      'budgeted_amount' => 850000000, 'realized_amount' => 850000000],
            ['type' => 'pendapatan', 'category' => 'Dana Transfer',           'description' => 'ADD dari Kabupaten',   'budgeted_amount' => 350000000, 'realized_amount' => 350000000],
            ['type' => 'belanja',    'category' => 'Bidang Penyelenggaraan',  'description' => 'Belanja Pegawai',      'budgeted_amount' => 200000000, 'realized_amount' => 198000000],
            ['type' => 'belanja',    'category' => 'Bidang Pembangunan',      'description' => 'Pembangunan Jalan',    'budgeted_amount' => 450000000, 'realized_amount' => 320000000],
            ['type' => 'belanja',    'category' => 'Bidang Pemberdayaan',     'description' => 'Program PKK & Posyandu', 'budgeted_amount' => 75000000, 'realized_amount' => 72000000],
            ['type' => 'belanja',    'category' => 'Bidang Penanggulangan',   'description' => 'Kebencanaan & Darurat', 'budgeted_amount' => 50000000, 'realized_amount' => 25000000],
            ['type' => 'pembiayaan', 'category' => 'Penerimaan Pembiayaan',   'description' => 'SiLPA Tahun Lalu',    'budgeted_amount' => 125000000, 'realized_amount' => 125000000],
        ];

        foreach ($apbdesItems as $item) {
            $item['user_id'] = $admin->id;
            $item['year']    = now()->year;
            $item['month']   = null;
            Apbdes::firstOrCreate(
                ['year' => $item['year'], 'description' => $item['description']],
                $item
            );
        }
    }
}
