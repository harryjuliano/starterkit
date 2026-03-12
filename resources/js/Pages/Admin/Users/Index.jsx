import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

const toRoleNames = (roles = []) => roles.map((role) => role.name);

export default function UserIndex({ users, roles }) {
    const createForm = useForm({
        name: '',
        email: '',
        password: '',
        roles: [],
    });

    const editForm = useForm({
        id: null,
        name: '',
        email: '',
        password: '',
        roles: [],
    });

    const submitCreate = (e) => {
        e.preventDefault();
        createForm.post(route('users.store'), {
            preserveScroll: true,
            onSuccess: () => createForm.reset(),
        });
    };

    const submitUpdate = (e) => {
        e.preventDefault();
        editForm.put(route('users.update', editForm.id), {
            preserveScroll: true,
            onSuccess: () => editForm.reset(),
        });
    };

    const toggleRole = (form, roleName) => {
        const hasRole = form.data.roles.includes(roleName);
        form.setData(
            'roles',
            hasRole
                ? form.data.roles.filter((role) => role !== roleName)
                : [...form.data.roles, roleName],
        );
    };

    const startEdit = (user) => {
        editForm.setData({
            id: user.id,
            name: user.name,
            email: user.email,
            password: '',
            roles: toRoleNames(user.roles),
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">User Management</h2>}
        >
            <Head title="Users" />

            <div className="py-8">
                <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
                    <div className="rounded-lg bg-white p-6 shadow">
                        <h3 className="mb-4 text-lg font-semibold">Tambah User</h3>
                        <form onSubmit={submitCreate} className="space-y-3">
                            <input className="w-full rounded border-gray-300" placeholder="Nama" value={createForm.data.name} onChange={(e) => createForm.setData('name', e.target.value)} />
                            <input className="w-full rounded border-gray-300" placeholder="Email" type="email" value={createForm.data.email} onChange={(e) => createForm.setData('email', e.target.value)} />
                            <input className="w-full rounded border-gray-300" placeholder="Password" type="password" value={createForm.data.password} onChange={(e) => createForm.setData('password', e.target.value)} />
                            <div>
                                <p className="mb-1 text-sm font-medium">Roles</p>
                                <div className="flex flex-wrap gap-3">
                                    {roles.map((role) => (
                                        <label key={role.id} className="text-sm">
                                            <input type="checkbox" className="mr-1" checked={createForm.data.roles.includes(role.name)} onChange={() => toggleRole(createForm, role.name)} />
                                            {role.name}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <button className="rounded bg-indigo-600 px-4 py-2 text-white">Simpan</button>
                        </form>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow">
                        <h3 className="mb-4 text-lg font-semibold">Edit User</h3>
                        {editForm.data.id ? (
                            <form onSubmit={submitUpdate} className="space-y-3">
                                <input className="w-full rounded border-gray-300" placeholder="Nama" value={editForm.data.name} onChange={(e) => editForm.setData('name', e.target.value)} />
                                <input className="w-full rounded border-gray-300" placeholder="Email" type="email" value={editForm.data.email} onChange={(e) => editForm.setData('email', e.target.value)} />
                                <input className="w-full rounded border-gray-300" placeholder="Password baru (opsional)" type="password" value={editForm.data.password} onChange={(e) => editForm.setData('password', e.target.value)} />
                                <div>
                                    <p className="mb-1 text-sm font-medium">Roles</p>
                                    <div className="flex flex-wrap gap-3">
                                        {roles.map((role) => (
                                            <label key={role.id} className="text-sm">
                                                <input type="checkbox" className="mr-1" checked={editForm.data.roles.includes(role.name)} onChange={() => toggleRole(editForm, role.name)} />
                                                {role.name}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <button className="rounded bg-amber-600 px-4 py-2 text-white">Update</button>
                            </form>
                        ) : (
                            <p className="text-sm text-gray-500">Klik tombol Edit pada tabel user.</p>
                        )}
                    </div>
                </div>

                <div className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="overflow-x-auto rounded-lg bg-white shadow">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="bg-gray-100 text-left">
                                    <th className="px-4 py-2">Nama</th>
                                    <th className="px-4 py-2">Email</th>
                                    <th className="px-4 py-2">Role</th>
                                    <th className="px-4 py-2">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id} className="border-t">
                                        <td className="px-4 py-2">{user.name}</td>
                                        <td className="px-4 py-2">{user.email}</td>
                                        <td className="px-4 py-2">{toRoleNames(user.roles).join(', ') || '-'}</td>
                                        <td className="space-x-2 px-4 py-2">
                                            <button className="rounded bg-blue-600 px-3 py-1 text-white" onClick={() => startEdit(user)}>Edit</button>
                                            <button className="rounded bg-red-600 px-3 py-1 text-white" onClick={() => {
                                                if (confirm('Hapus user ini?')) {
                                                    editForm.delete(route('users.destroy', user.id), { preserveScroll: true });
                                                }
                                            }}>Hapus</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
