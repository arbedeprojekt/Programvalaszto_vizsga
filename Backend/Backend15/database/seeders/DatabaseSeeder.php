<?php
 
namespace Database\Seeders;
 
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
 
class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeders.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            'name' => 'admin',
            'email' => 'admin@email.com',
            'password' => bcrypt('Password123'),
            'admin' => 1,
            'email_verified_at' => now(),
        ]);

        DB::table('users')->insert([
            'name' => 'superadmin',
            'email' => 'superadmin@email.com',
            'password' => bcrypt('Password123'),
            'admin' => 2,
            'email_verified_at' => now(),
        ]);

        DB::table('users')->insert([
            'name' => 'testuser',
            'email' => 'testuser@email.com',
            'password' => bcrypt('Almafa12'),
            'admin' => 0,
            'email_verified_at' => now(),
        ]);
    }
}