<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_requests', function (Blueprint $table) {
            $table->id();
            $table->string('ticket_number')->unique();
            $table->string('requester_name');
            $table->string('requester_nik', 16);
            $table->string('requester_phone')->nullable();
            $table->string('requester_address');
            $table->enum('letter_type', [
                'surat_keterangan_domisili',
                'surat_keterangan_tidak_mampu',
                'surat_keterangan_usaha',
                'surat_pengantar_nikah',
                'surat_keterangan_kelahiran',
                'surat_keterangan_kematian',
                'surat_keterangan_lainnya',
            ]);
            $table->text('purpose');
            $table->string('attachment')->nullable();
            $table->enum('status', ['pending', 'processing', 'approved', 'rejected'])->default('pending');
            $table->text('admin_notes')->nullable();
            $table->foreignId('processed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_requests');
    }
};
