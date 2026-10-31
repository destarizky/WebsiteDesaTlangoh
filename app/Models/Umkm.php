<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Umkm extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'umkm';

    protected $fillable = [
        'user_id', 'name', 'slug', 'type', 'description',
        'owner_name', 'phone', 'address', 'cover_image',
        'gallery', 'price_from', 'price_to', 'is_active', 'is_featured',
    ];

    protected $casts = [
        'gallery'     => 'array',
        'is_active'   => 'boolean',
        'is_featured' => 'boolean',
        'price_from'  => 'decimal:2',
        'price_to'    => 'decimal:2',
    ];

    protected static function boot(): void
    {
        parent::boot();
        static::creating(function ($model) {
            $model->slug = Str::slug($model->name);
        });
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
