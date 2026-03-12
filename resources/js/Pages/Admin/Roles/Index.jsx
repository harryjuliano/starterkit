import DataTable from '@/Components/DataTable';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useMemo } from 'react';

const toPermissionNames = (permissions = []) => permissions.map((permission) => permission.name);

export default function RoleIndex({ roles, permissions, filters }) {
    const createForm = useForm({ name: '', permissions: [] });
    const editForm = useForm({ id: null, name: '', permissions: [] });

    const togglePermission = (form, permissionName) => {
        const exists = form.data.permissions.includes(permissionName);
        form.setData(
            'permissions',
            exists
                ? form.data.permissions.filter((name) => name !== permissionName)
                : [...form.data.permissions, permissionName],
        );
    };

    const columns = useMemo(() => [
        { key: 'name', label: 'Role', render: (role) => role.name },
        { key: 'permissions', label: 'Permissions', render: (role) => toPermissionNames(role.permissions).join(', ') || '-' },
        {
            key: 'actions',
            label: 'Aksi',
            render: (role) => (
                <div className="space-x-2">
                    <button className="rounded bg-blue-600 px-3 py-1 text-white" onClick={() => editForm.setData({ id: role.id, name: role.name, permissions: toPermissionNames(role.permissions) })}>Edit</button>
                    <button className="rounded bg-red-600 px-3 py-1 text-white" onClick={() => { if (confirm('Hapus role ini?')) { editForm.delete(route('roles.destroy', role.id)); } }}>Hapus</button>
                </div>
            ),
        },
    ], [editForm]);

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Role Management</h2>}>
            <Head title="Roles" />
            <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:px-8">
                <div className="rounded-lg bg-white p-6 shadow">
                    <h3 className="mb-4 text-lg font-semibold">Tambah Role</h3>
                    <form onSubmit={(e) => { e.preventDefault(); createForm.post(route('roles.store'), { onSuccess: () => createForm.reset() }); }} className="space-y-3">
                        <input className="w-full rounded border-gray-300" placeholder="Nama role" value={createForm.data.name} onChange={(e) => createForm.setData('name', e.target.value)} />
                        <div className="flex flex-wrap gap-3">
                            {permissions.map((permission) => (
                                <label key={permission.id} className="text-sm"><input type="checkbox" className="mr-1" checked={createForm.data.permissions.includes(permission.name)} onChange={() => togglePermission(createForm, permission.name)} />{permission.name}</label>
                            ))}
                        </div>
                        <button className="rounded bg-indigo-600 px-4 py-2 text-white">Simpan</button>
                    </form>
                </div>
                <div className="rounded-lg bg-white p-6 shadow">
                    <h3 className="mb-4 text-lg font-semibold">Edit Role</h3>
                    {editForm.data.id ? (
                        <form onSubmit={(e) => { e.preventDefault(); editForm.put(route('roles.update', editForm.data.id), { onSuccess: () => editForm.reset() }); }} className="space-y-3">
                            <input className="w-full rounded border-gray-300" value={editForm.data.name} onChange={(e) => editForm.setData('name', e.target.value)} />
                            <div className="flex flex-wrap gap-3">
                                {permissions.map((permission) => (
                                    <label key={permission.id} className="text-sm"><input type="checkbox" className="mr-1" checked={editForm.data.permissions.includes(permission.name)} onChange={() => togglePermission(editForm, permission.name)} />{permission.name}</label>
                                ))}
                            </div>
                            <button className="rounded bg-amber-600 px-4 py-2 text-white">Update</button>
                        </form>
                    ) : <p className="text-sm text-gray-500">Klik Edit pada tabel role.</p>}
                </div>
            </div>
            <div className="mx-auto mb-8 max-w-7xl px-4 sm:px-6 lg:px-8">
                <DataTable
                    columns={columns}
                    rows={roles.data}
                    getRowKey={(role) => role.id}
                    routeName="roles.index"
                    filters={filters}
                    searchPlaceholder="Cari role..."
                    filterOptions={[
                        {
                            key: 'permission',
                            label: 'Permission',
                            options: permissions.map((permission) => ({ value: permission.name, label: permission.name })),
                            placeholder: 'Semua permission',
                        },
                    ]}
                    pagination={roles}
                />
            </div>
        </AuthenticatedLayout>
    );
}
