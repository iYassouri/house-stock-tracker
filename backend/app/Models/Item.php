<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    protected $fillable = [
        'name',
        'category',
        'storage_location',
        'image_path',
        'bought_at',
        'tracking_type',
        'quantity',
        'unit',
        'level',
        'min_threshold',
    ];
}