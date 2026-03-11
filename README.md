# Starterkit - CRUD Users, Roles, Permissions

Starterkit ini menyediakan modul Python sederhana berbasis `sqlite3` untuk manajemen:

- User
- Role
- Permission
- Relasi user-role
- Relasi role-permission

## Fitur

- CRUD lengkap untuk `users`, `roles`, dan `permissions`
- Assign/revoke role ke user
- Assign/revoke permission ke role
- Resolusi akses efektif user (`get_user_with_access`)
- Cek cepat permission user (`user_has_permission`)
- Validasi field kosong dan error handling (`ValidationError`, `ConflictError`, `NotFoundError`)

## Struktur

- `starterkit/db.py` - inisialisasi database + schema SQLite.
- `starterkit/services.py` - service CRUD dan relasi akses.
- `tests/test_services.py` - unit tests.

## Menjalankan test

```bash
python -m unittest discover -s tests -p 'test_*.py' -v
```

## Contoh penggunaan

```python
from starterkit import AccessControlService

svc = AccessControlService("starterkit.db")

admin = svc.create_role("admin", "Role administrator")
read_user = svc.create_permission("users.read", "Boleh membaca user")
svc.assign_permission_to_role(admin["id"], read_user["id"])

user = svc.create_user("Harry", "harry@example.com")
svc.assign_role_to_user(user["id"], admin["id"])

print(svc.user_has_permission(user["id"], "users.read"))  # True
print(svc.get_user_with_access(user["id"]))

svc.close()
```
