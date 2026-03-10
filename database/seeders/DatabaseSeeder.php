<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // reset cache permission
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // buat role super-admin jika belum ada
        $role = Role::firstOrCreate([
            'name' => 'super-admin'
        ]);

        // buat user super admin
        $user = User::firstOrCreate(
            [
                'email' => 'admin@julianoo.work'
            ],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('Admin123!'),
            ]
        );

        // assign role
        $user->assignRole($role);
    }
}