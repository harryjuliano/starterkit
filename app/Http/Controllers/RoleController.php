<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->string('search', ''));
        $permission = trim((string) $request->string('permission', ''));
        $perPage = max(1, min((int) $request->integer('per_page', 10), 100));

        $roles = Role::query()
            ->with('permissions:id,name')
            ->when($search !== '', fn ($query) => $query->where('name', 'like', "%{$search}%"))
            ->when($permission !== '', fn ($query) => $query->whereHas('permissions', fn ($permissionQuery) => $permissionQuery->where('name', $permission)))
            ->orderBy('name')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Admin/Roles/Index', [
            'roles' => $roles,
            'permissions' => Permission::query()->orderBy('name')->get(['id', 'name']),
            'filters' => [
                'search' => $search,
                'permission' => $permission,
                'per_page' => $perPage,
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('roles', 'name')],
            'permissions' => ['array'],
            'permissions.*' => ['string', Rule::exists('permissions', 'name')],
        ]);

        $role = Role::create(['name' => $validated['name']]);
        $role->syncPermissions($validated['permissions'] ?? []);

        return back()->with('success', 'Role berhasil dibuat.');
    }

    public function update(Request $request, Role $role): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('roles', 'name')->ignore($role->id)],
            'permissions' => ['array'],
            'permissions.*' => ['string', Rule::exists('permissions', 'name')],
        ]);

        $role->update(['name' => $validated['name']]);
        $role->syncPermissions($validated['permissions'] ?? []);

        return back()->with('success', 'Role berhasil diperbarui.');
    }

    public function destroy(Role $role): RedirectResponse
    {
        $role->delete();

        return back()->with('success', 'Role berhasil dihapus.');
    }
}
