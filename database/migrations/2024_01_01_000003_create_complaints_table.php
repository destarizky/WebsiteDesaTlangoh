<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('complaints', function (Blueprint $table) {
            $table->id();
            $table->string('ticket_number')->unique();
            $table->string('reporter_name');
            $table->string('reporter_phone')->nullable();
            $table->enum('category', [
                'infrastruktur',
                'pelayanan_publik',
                'lingkungan',
                'keamanan',
                'sosial',
                'lainnya',
            ]);
            $table->string('subject');
            $table->text('description');
            $table->string('location')->nullable();
            $table->string('attachment')->nullable();
            $table->boolean('is_anonymous')->default(false);
            $table->enum('status', ['pending', 'reviewed', 'in_progress', 'resolved', 'closed'])->default('pending');
            $table->text('admin_response')->nullable();
            $table->foreignId('handled_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('complaints');
    }
};
