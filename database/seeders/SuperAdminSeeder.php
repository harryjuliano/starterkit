<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        $role = Role::firstOrCreate([
            'name' => 'super-admin',
        ]);

        $user = User::firstOrCreate(
            [
                'email' => 'admin@julianoo.work',
            ],
            [
                'name' => 'harryjuliano',
                'password' => Hash::make('1122334455'),
            ],
        );

        $user->assignRole($role);
    }
}
