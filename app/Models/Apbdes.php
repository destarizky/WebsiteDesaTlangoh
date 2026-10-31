<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Apbdes extends Model
{
    use HasFactory;

    protected $table = 'apbdes';

    protected $fillable = [
        'user_id', 'year', 'month', 'category', 'type',
        'description', 'budgeted_amount', 'realized_amount', 'notes',
    ];

    protected $casts = [
        'budgeted_amount'  => 'decimal:2',
        'realized_amount'  => 'decimal:2',
        'year'             => 'integer',
        'month'            => 'integer',
    ];

    public function author()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function getRealizationPercentageAttribute(): float
    {
        if ($this->budgeted_amount == 0) return 0;
        return round(($this->realized_amount / $this->budgeted_amount) * 100, 1);
    }
}
