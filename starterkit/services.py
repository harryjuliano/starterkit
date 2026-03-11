from __future__ import annotations

import sqlite3
from typing import Any

from starterkit.db import Database


class NotFoundError(ValueError):
    pass


class ConflictError(ValueError):
    pass


class ValidationError(ValueError):
    pass


class AccessControlService:
    def __init__(self, db_path: str = ":memory:") -> None:
        self.db = Database(db_path)

    @staticmethod
    def _raise_not_found(entity: str, entity_id: int) -> None:
        raise NotFoundError(f"{entity} with id={entity_id} not found")

    @staticmethod
    def _require_non_empty(value: str, field_name: str) -> str:
        value = value.strip()
        if not value:
            raise ValidationError(f"{field_name} must not be empty")
        return value

    # ---------- users CRUD ----------
    def create_user(self, name: str, email: str) -> dict[str, Any]:
        name = self._require_non_empty(name, "name")
        email = self._require_non_empty(email, "email")
        with self.db.connection() as conn:
            try:
                cur = conn.execute(
                    "INSERT INTO users (name, email) VALUES (?, ?)",
                    (name, email),
                )
            except sqlite3.IntegrityError as exc:
                raise ConflictError(f"email '{email}' already exists") from exc
            user_id = cur.lastrowid
        return self.get_user(user_id)

    def list_users(self) -> list[dict[str, Any]]:
        with self.db.connection() as conn:
            rows = conn.execute("SELECT * FROM users ORDER BY id").fetchall()
        return [dict(row) for row in rows]

    def get_user(self, user_id: int) -> dict[str, Any]:
        with self.db.connection() as conn:
            row = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
        if row is None:
            self._raise_not_found("user", user_id)
        return dict(row)

    def update_user(self, user_id: int, *, name: str | None = None, email: str | None = None) -> dict[str, Any]:
        existing = self.get_user(user_id)
        next_name = self._require_non_empty(name, "name") if name is not None else existing["name"]
        next_email = self._require_non_empty(email, "email") if email is not None else existing["email"]

        with self.db.connection() as conn:
            try:
                conn.execute(
                    """
                    UPDATE users
                    SET name = ?, email = ?, updated_at = CURRENT_TIMESTAMP
                    WHERE id = ?
                    """,
                    (next_name, next_email, user_id),
                )
            except sqlite3.IntegrityError as exc:
                raise ConflictError(f"email '{next_email}' already exists") from exc
        return self.get_user(user_id)

    def delete_user(self, user_id: int) -> None:
        self.get_user(user_id)
        with self.db.connection() as conn:
            conn.execute("DELETE FROM users WHERE id = ?", (user_id,))

    # ---------- roles CRUD ----------
    def create_role(self, name: str, description: str | None = None) -> dict[str, Any]:
        name = self._require_non_empty(name, "role name")
        with self.db.connection() as conn:
            try:
                cur = conn.execute(
                    "INSERT INTO roles (name, description) VALUES (?, ?)",
                    (name, description),
                )
            except sqlite3.IntegrityError as exc:
                raise ConflictError(f"role '{name}' already exists") from exc
            role_id = cur.lastrowid
        return self.get_role(role_id)

    def list_roles(self) -> list[dict[str, Any]]:
        with self.db.connection() as conn:
            rows = conn.execute("SELECT * FROM roles ORDER BY id").fetchall()
        return [dict(row) for row in rows]

    def get_role(self, role_id: int) -> dict[str, Any]:
        with self.db.connection() as conn:
            row = conn.execute("SELECT * FROM roles WHERE id = ?", (role_id,)).fetchone()
        if row is None:
            self._raise_not_found("role", role_id)
        return dict(row)

    def update_role(self, role_id: int, *, name: str | None = None, description: str | None = None) -> dict[str, Any]:
        existing = self.get_role(role_id)
        next_name = self._require_non_empty(name, "role name") if name is not None else existing["name"]
        next_description = description if description is not None else existing["description"]

        with self.db.connection() as conn:
            try:
                conn.execute(
                    """
                    UPDATE roles
                    SET name = ?, description = ?, updated_at = CURRENT_TIMESTAMP
                    WHERE id = ?
                    """,
                    (next_name, next_description, role_id),
                )
            except sqlite3.IntegrityError as exc:
                raise ConflictError(f"role '{next_name}' already exists") from exc
        return self.get_role(role_id)

    def delete_role(self, role_id: int) -> None:
        self.get_role(role_id)
        with self.db.connection() as conn:
            conn.execute("DELETE FROM roles WHERE id = ?", (role_id,))

    # ---------- permissions CRUD ----------
    def create_permission(self, name: str, description: str | None = None) -> dict[str, Any]:
        name = self._require_non_empty(name, "permission name")
        with self.db.connection() as conn:
            try:
                cur = conn.execute(
                    "INSERT INTO permissions (name, description) VALUES (?, ?)",
                    (name, description),
                )
            except sqlite3.IntegrityError as exc:
                raise ConflictError(f"permission '{name}' already exists") from exc
            permission_id = cur.lastrowid
        return self.get_permission(permission_id)

    def list_permissions(self) -> list[dict[str, Any]]:
        with self.db.connection() as conn:
            rows = conn.execute("SELECT * FROM permissions ORDER BY id").fetchall()
        return [dict(row) for row in rows]

    def get_permission(self, permission_id: int) -> dict[str, Any]:
        with self.db.connection() as conn:
            row = conn.execute("SELECT * FROM permissions WHERE id = ?", (permission_id,)).fetchone()
        if row is None:
            self._raise_not_found("permission", permission_id)
        return dict(row)

    def update_permission(
        self,
        permission_id: int,
        *,
        name: str | None = None,
        description: str | None = None,
    ) -> dict[str, Any]:
        existing = self.get_permission(permission_id)
        next_name = self._require_non_empty(name, "permission name") if name is not None else existing["name"]
        next_description = description if description is not None else existing["description"]

        with self.db.connection() as conn:
            try:
                conn.execute(
                    """
                    UPDATE permissions
                    SET name = ?, description = ?, updated_at = CURRENT_TIMESTAMP
                    WHERE id = ?
                    """,
                    (next_name, next_description, permission_id),
                )
            except sqlite3.IntegrityError as exc:
                raise ConflictError(f"permission '{next_name}' already exists") from exc
        return self.get_permission(permission_id)

    def delete_permission(self, permission_id: int) -> None:
        self.get_permission(permission_id)
        with self.db.connection() as conn:
            conn.execute("DELETE FROM permissions WHERE id = ?", (permission_id,))

    # ---------- assignments ----------
    def assign_role_to_user(self, user_id: int, role_id: int) -> None:
        self.get_user(user_id)
        self.get_role(role_id)
        with self.db.connection() as conn:
            conn.execute(
                "INSERT OR IGNORE INTO user_roles (user_id, role_id) VALUES (?, ?)",
                (user_id, role_id),
            )

    def revoke_role_from_user(self, user_id: int, role_id: int) -> None:
        with self.db.connection() as conn:
            conn.execute(
                "DELETE FROM user_roles WHERE user_id = ? AND role_id = ?",
                (user_id, role_id),
            )

    def assign_permission_to_role(self, role_id: int, permission_id: int) -> None:
        self.get_role(role_id)
        self.get_permission(permission_id)
        with self.db.connection() as conn:
            conn.execute(
                "INSERT OR IGNORE INTO role_permissions (role_id, permission_id) VALUES (?, ?)",
                (role_id, permission_id),
            )

    def revoke_permission_from_role(self, role_id: int, permission_id: int) -> None:
        with self.db.connection() as conn:
            conn.execute(
                "DELETE FROM role_permissions WHERE role_id = ? AND permission_id = ?",
                (role_id, permission_id),
            )

    def list_roles_for_user(self, user_id: int) -> list[dict[str, Any]]:
        self.get_user(user_id)
        with self.db.connection() as conn:
            rows = conn.execute(
                """
                SELECT r.*
                FROM roles r
                JOIN user_roles ur ON ur.role_id = r.id
                WHERE ur.user_id = ?
                ORDER BY r.id
                """,
                (user_id,),
            ).fetchall()
        return [dict(row) for row in rows]

    def list_permissions_for_role(self, role_id: int) -> list[dict[str, Any]]:
        self.get_role(role_id)
        with self.db.connection() as conn:
            rows = conn.execute(
                """
                SELECT p.*
                FROM permissions p
                JOIN role_permissions rp ON rp.permission_id = p.id
                WHERE rp.role_id = ?
                ORDER BY p.id
                """,
                (role_id,),
            ).fetchall()
        return [dict(row) for row in rows]

    def user_has_permission(self, user_id: int, permission_name: str) -> bool:
        permission_name = self._require_non_empty(permission_name, "permission name")
        self.get_user(user_id)
        with self.db.connection() as conn:
            row = conn.execute(
                """
                SELECT 1
                FROM permissions p
                JOIN role_permissions rp ON rp.permission_id = p.id
                JOIN user_roles ur ON ur.role_id = rp.role_id
                WHERE ur.user_id = ? AND p.name = ?
                LIMIT 1
                """,
                (user_id, permission_name),
            ).fetchone()
        return row is not None

    def get_user_with_access(self, user_id: int) -> dict[str, Any]:
        user = self.get_user(user_id)
        user["roles"] = self.list_roles_for_user(user_id)

        with self.db.connection() as conn:
            permission_rows = conn.execute(
                """
                SELECT DISTINCT p.*
                FROM permissions p
                JOIN role_permissions rp ON rp.permission_id = p.id
                JOIN user_roles ur ON ur.role_id = rp.role_id
                WHERE ur.user_id = ?
                ORDER BY p.id
                """,
                (user_id,),
            ).fetchall()

        user["permissions"] = [dict(row) for row in permission_rows]
        return user

    def close(self) -> None:
        self.db.close()
