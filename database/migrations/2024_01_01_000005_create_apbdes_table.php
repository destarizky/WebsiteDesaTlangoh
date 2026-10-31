<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('apbdes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->unsignedSmallInteger('year');
            $table->unsignedTinyInteger('month')->nullable()->comment('null = annual summary');
            $table->string('category'); // e.g. "Pendapatan Asli Desa", "Dana Desa", "Belanja Pegawai", etc.
            $table->enum('type', ['pendapatan', 'belanja', 'pembiayaan']);
            $table->string('description');
            $table->decimal('budgeted_amount', 18, 2)->default(0);
            $table->decimal('realized_amount', 18, 2)->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['year', 'month']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('apbdes');
    }
};
