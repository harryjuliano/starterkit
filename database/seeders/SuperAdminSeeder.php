<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
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
                'name' => 'harryjuliano',
                'password' => Hash::make('1122334455'),
            ]
        );

        // assign role
        $user->assignRole($role);
    }
}}
