# Starterkit - Users, Roles, and Permissions CRUD

Starterkit ini menyediakan modul Python berbasis `sqlite3` untuk manajemen:

- Users
- Roles
- Permissions
- Relasi user-role
- Relasi role-permission

## Struktur

- `starterkit/db.py` - inisialisasi database dan skema tabel.
- `starterkit/services.py` - service CRUD + assignment role/permission.
- `tests/test_services.py` - unit test utama.

## Menjalankan test

```bash
python -m unittest discover -s tests -p 'test_*.py' -v
```

## Contoh penggunaan singkat

```python
from starterkit.services import AccessControlService

svc = AccessControlService('starterkit.db')

admin_role = svc.create_role('admin')
read_perm = svc.create_permission('users.read')
svc.assign_permission_to_role(admin_role['id'], read_perm['id'])

user = svc.create_user('Harry', 'harry@example.com')
svc.assign_role_to_user(user['id'], admin_role['id'])

result = svc.get_user_with_access(user['id'])
print(result)
```
