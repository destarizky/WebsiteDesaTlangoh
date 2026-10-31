<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Complaint extends Model
{
    use HasFactory;

    protected $fillable = [
        'ticket_number', 'reporter_name', 'reporter_phone',
        'category', 'subject', 'description', 'location',
        'attachment', 'is_anonymous', 'status', 'admin_response',
        'handled_by', 'resolved_at',
    ];

    protected $casts = [
        'is_anonymous'  => 'boolean',
        'resolved_at'   => 'datetime',
    ];

    protected static function boot(): void
    {
        parent::boot();
        static::creating(function ($model) {
            $model->ticket_number = 'LP-' . strtoupper(Str::random(8));
        });
    }

    public function handler()
    {
        return $this->belongsTo(User::class, 'handled_by');
    }
}
