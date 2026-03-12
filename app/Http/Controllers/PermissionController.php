<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->string('search', ''));
        $perPage = max(1, min((int) $request->integer('per_page', 10), 100));

        $permissions = Permission::query()
            ->when($search !== '', fn ($query) => $query->where('name', 'like', "%{$search}%"))
            ->orderBy('name')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Admin/Permissions/Index', [
            'permissions' => $permissions,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('permissions', 'name')],
        ]);

        Permission::create(['name' => $validated['name']]);

        return back()->with('success', 'Permission berhasil dibuat.');
    }

    public function update(Request $request, Permission $permission): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('permissions', 'name')->ignore($permission->id)],
        ]);

        $permission->update(['name' => $validated['name']]);

        return back()->with('success', 'Permission berhasil diperbarui.');
    }

    public function destroy(Permission $permission): RedirectResponse
    {
        $permission->delete();

        return back()->with('success', 'Permission berhasil dihapus.');
    }
}
