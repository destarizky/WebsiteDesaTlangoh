<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ServiceRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'ticket_number', 'requester_name', 'requester_nik',
        'requester_phone', 'requester_address', 'letter_type',
        'purpose', 'attachment', 'status', 'admin_notes',
        'processed_by', 'processed_at',
    ];

    protected $casts = [
        'processed_at' => 'datetime',
    ];

    protected static function boot(): void
    {
        parent::boot();
        static::creating(function ($model) {
            $model->ticket_number = 'SR-' . strtoupper(Str::random(8));
        });
    }

    public function processor()
    {
        return $this->belongsTo(User::class, 'processed_by');
    }

    public function getLetterTypeLabelAttribute(): string
    {
        return match ($this->letter_type) {
            'surat_keterangan_domisili'     => 'Surat Keterangan Domisili',
            'surat_keterangan_tidak_mampu'  => 'Surat Keterangan Tidak Mampu',
            'surat_keterangan_usaha'        => 'Surat Keterangan Usaha',
            'surat_pengantar_nikah'         => 'Surat Pengantar Nikah',
            'surat_keterangan_kelahiran'    => 'Surat Keterangan Kelahiran',
            'surat_keterangan_kematian'     => 'Surat Keterangan Kematian',
            default                         => 'Surat Keterangan Lainnya',
        };
    }
}
