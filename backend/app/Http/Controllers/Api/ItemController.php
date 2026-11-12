<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ItemController extends Controller
{
    public function index()
    {
        $items = Item::orderBy('name')->get()->map(function ($item) {
            $item->image_url = $item->image_path ? asset('storage/' . $item->image_path) : null;
            return $item;
        });

        return response()->json($items);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'             => 'required|string|max:100',
            'category'         => 'required|in:pantry,vegetables,meat',
            'storage_location' => 'nullable|in:pantry,fridge,freezer',
            'image'            => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'bought_at'        => 'nullable|date',
            'tracking_type'    => 'required|in:count,level',
            'quantity'         => 'nullable|integer|min:0',
            'unit'             => 'nullable|string|max:20',
            'level'            => 'nullable|in:full,half,low,empty',
            'min_threshold'    => 'nullable|integer|min:0',
        ]);

        if ($request->hasFile('image')) {
            $validated['image_path'] = $request->file('image')->store('products', 'public');
        }

        if (in_array($validated['category'], ['vegetables', 'meat'])) {
            $validated['tracking_type'] = 'count';
        }

        $item = Item::create($validated);
        $item->image_url = $item->image_path ? asset('storage/' . $item->image_path) : null;

        return response()->json($item, 201);
    }

    public function adjust(Request $request, Item $item)
    {
        if ($item->tracking_type === 'count') {
            $delta = (int) $request->input('delta', -1);
            $item->quantity = max(0, $item->quantity + $delta);
        } else {
            $item->level = $request->input('level', 'low');
        }

        $item->save();
        $item->image_url = $item->image_path ? asset('storage/' . $item->image_path) : null;

        return response()->json($item);
    }

    public function destroy(Item $item)
    {
        if ($item->image_path) {
            Storage::disk('public')->delete($item->image_path);
        }
        $item->delete();

        return response()->json(['message' => 'Deleted']);
    }
}