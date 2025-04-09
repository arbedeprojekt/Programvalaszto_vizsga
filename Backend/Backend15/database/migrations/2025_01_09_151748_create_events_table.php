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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string("name");
            $table->date('startDate')->nullable();
            $table->date('endDate')->nullable();
            $table->time('startTime')->nullable();
            $table->time('endTime')->nullable();
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->string('locationName')->nullable();
            $table->string('locationcountry')->nullable();
            $table->string('address')->nullable();
            $table->integer('state')->nullable();
            $table->string('weblink')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->string('gpx')->nullable();
            $table->unsignedInteger('subscribed')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
