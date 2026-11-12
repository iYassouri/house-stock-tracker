<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up(): void
{
    Schema::create('items', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->enum('category', ['pantry', 'vegetables', 'meat'])->default('pantry');
        $table->enum('storage_location', ['pantry', 'fridge', 'freezer'])->default('pantry');
        $table->string('image_path')->nullable();
        $table->date('bought_at')->nullable();
        $table->enum('tracking_type', ['count', 'level'])->default('count');
        $table->integer('quantity')->default(0);
        $table->string('unit')->default('pcs');
        $table->enum('level', ['full', 'half', 'low', 'empty'])->default('full');
        $table->integer('min_threshold')->default(1);
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('items');
    }
};
