import DataTable from '@/Components/DataTable';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useMemo } from 'react';

export default function PermissionIndex({ permissions, filters }) {
    const createForm = useForm({ name: '' });
    const editForm = useForm({ id: null, name: '' });

    const columns = useMemo(() => [
        { key: 'name', label: 'Permission', render: (permission) => permission.name },
        {
            key: 'actions',
            label: 'Aksi',
            render: (permission) => (
                <div className="space-x-2">
                    <button className="rounded bg-blue-600 px-3 py-1 text-white" onClick={() => editForm.setData({ id: permission.id, name: permission.name })}>Edit</button>
                    <button className="rounded bg-red-600 px-3 py-1 text-white" onClick={() => { if (confirm('Hapus permission ini?')) { editForm.delete(route('permissions.destroy', permission.id)); } }}>Hapus</button>
                </div>
            ),
        },
    ], [editForm]);

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Permission Management</h2>}>
            <Head title="Permissions" />
            <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:px-8">
                <div className="rounded-lg bg-white p-6 shadow">
                    <h3 className="mb-4 text-lg font-semibold">Tambah Permission</h3>
                    <form onSubmit={(e) => { e.preventDefault(); createForm.post(route('permissions.store'), { onSuccess: () => createForm.reset() }); }} className="space-y-3">
                        <input className="w-full rounded border-gray-300" placeholder="Nama permission" value={createForm.data.name} onChange={(e) => createForm.setData('name', e.target.value)} />
                        <button className="rounded bg-indigo-600 px-4 py-2 text-white">Simpan</button>
                    </form>
                </div>
                <div className="rounded-lg bg-white p-6 shadow">
                    <h3 className="mb-4 text-lg font-semibold">Edit Permission</h3>
                    {editForm.data.id ? (
                        <form onSubmit={(e) => { e.preventDefault(); editForm.put(route('permissions.update', editForm.data.id), { onSuccess: () => editForm.reset() }); }} className="space-y-3">
                            <input className="w-full rounded border-gray-300" value={editForm.data.name} onChange={(e) => editForm.setData('name', e.target.value)} />
                            <button className="rounded bg-amber-600 px-4 py-2 text-white">Update</button>
                        </form>
                    ) : <p className="text-sm text-gray-500">Klik Edit pada tabel permission.</p>}
                </div>
            </div>
            <div className="mx-auto mb-8 max-w-7xl px-4 sm:px-6 lg:px-8">
                <DataTable
                    columns={columns}
                    rows={permissions.data}
                    getRowKey={(permission) => permission.id}
                    routeName="permissions.index"
                    filters={filters}
                    searchPlaceholder="Cari permission..."
                    pagination={permissions}
                />
            </div>
        </AuthenticatedLayout>
    );
}
