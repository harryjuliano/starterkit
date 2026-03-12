# Laravel + React + Inertia Starterkit

Starterkit ini disiapkan untuk dipakai ulang lintas proyek (SaaS, internal tools, e-commerce) dengan fokus fitur **foundational** agar setup awal tidak berulang.

## Yang Sudah Tersedia

### 1) Authentication & Authorization
- Auth dasar Laravel Breeze (login/register/reset password/email verification).
- RBAC dengan `spatie/laravel-permission` (roles + permissions + halaman admin CRUD).
- Shared auth context ke frontend (`user`, `roles`, `permissions`) via Inertia middleware.

### 2) Reusable UI Foundation
- Tailwind CSS sebagai UI foundation.
- Komponen form dasar (`Input`, `Checkbox`, `Modal`, `Button`, dll).
- Layout terpisah: `AuthenticatedLayout` dan `GuestLayout`.

### 3) Global State & Shared Data
- Global app settings context untuk:
  - language switcher (`en`/`id`)
  - dark/light mode
  - helper translasi `t(key)`
- Flash message handler global (toast sederhana dari session Laravel).
- Shared global props via `HandleInertiaRequests`:
  - `auth.user`, `auth.roles`, `auth.permissions`
  - `app.locale`, `app.available_locales`
  - `translations` dari file `lang/{locale}.json`
  - `flash` (`success`, `error`, `warning`, `info`)

### 4) DX & Structure
- Ziggy (`@routes`) sudah aktif pada blade app shell.
- Struktur starterkit disiapkan untuk scale-up:
  - `app/Services` (service layer)
  - `resources/js/Hooks` (custom hooks reusable)

### 5) Fitur Pendukung Umum
- Localization frontend (EN/ID) menggunakan file JSON Laravel (`lang/en.json`, `lang/id.json`).
- Dark mode support berbasis Tailwind `darkMode: 'class'`, disimpan di localStorage.
- Helper upload frontend (`useFileUpload`) sebagai pondasi upload ke local/S3.

## Struktur Folder Rekomendasi

| Folder | Deskripsi |
| --- | --- |
| `app/Services` | Logika bisnis agar controller tetap ramping |
| `resources/js/Components` | Komponen atomik reusable |
| `resources/js/Layouts` | Layout halaman (guest/auth/admin) |
| `resources/js/Hooks` | Custom hooks reusable |
| `resources/js/Pages` | Page-level components Inertia |

## Stubs / Next Step (Opsional)

Agar tetap fleksibel, fitur di bawah disiapkan sebagai **stubs/roadmap** (tidak dipaksa aktif di semua proyek):

- Social login (Google/GitHub) via Laravel Socialite.
- Two-factor authentication (2FA) (Fortify/Jetstream style flow).
- DataTable reusable dengan search/filter/pagination server-side.
- TypeScript migration (`resources/js/Types` + strict typing page props).
- Maintenance page khusus branding aplikasi.

## Quick Start

```bash
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed
npm install
npm run dev
php artisan serve
```

> Jika environment CI/runner membatasi akses internet, `composer install` bisa gagal karena tidak bisa mengunduh dependensi dari GitHub/Packagist.
