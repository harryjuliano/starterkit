import os
import tempfile
import unittest

from starterkit.services import (
    AccessControlService,
    ConflictError,
    NotFoundError,
    ValidationError,
)


class AccessControlServiceFileDbTest(unittest.TestCase):
    def setUp(self) -> None:
        fd, self.db_path = tempfile.mkstemp(suffix=".db")
        os.close(fd)
        self.svc = AccessControlService(self.db_path)

    def tearDown(self) -> None:
        self.svc.close()
        if os.path.exists(self.db_path):
            os.unlink(self.db_path)

    def test_users_crud(self) -> None:
        user = self.svc.create_user("Harry", "harry@example.com")
        self.assertEqual(user["name"], "Harry")

        fetched = self.svc.get_user(user["id"])
        self.assertEqual(fetched["email"], "harry@example.com")

        updated = self.svc.update_user(user["id"], name="Hary", email="hary@example.com")
        self.assertEqual(updated["name"], "Hary")

        self.svc.delete_user(user["id"])
        with self.assertRaises(NotFoundError):
            self.svc.get_user(user["id"])

    def test_roles_permissions_and_access_resolution(self) -> None:
        user = self.svc.create_user("Harry", "harry@example.com")
        admin = self.svc.create_role("admin")
        editor = self.svc.create_role("editor")
        p1 = self.svc.create_permission("users.create")
        p2 = self.svc.create_permission("users.delete")

        self.svc.assign_permission_to_role(admin["id"], p1["id"])
        self.svc.assign_permission_to_role(admin["id"], p2["id"])
        self.svc.assign_role_to_user(user["id"], admin["id"])
        self.svc.assign_role_to_user(user["id"], editor["id"])

        access = self.svc.get_user_with_access(user["id"])
        self.assertEqual(len(access["roles"]), 2)
        self.assertEqual({perm["name"] for perm in access["permissions"]}, {"users.create", "users.delete"})
        self.assertTrue(self.svc.user_has_permission(user["id"], "users.create"))

    def test_conflict_and_validation(self) -> None:
        self.svc.create_user("Harry", "harry@example.com")
        with self.assertRaises(ConflictError):
            self.svc.create_user("Harry 2", "harry@example.com")

        with self.assertRaises(ValidationError):
            self.svc.create_user("   ", "x@example.com")

        self.svc.create_role("admin")
        with self.assertRaises(ConflictError):
            self.svc.create_role("admin")

        self.svc.create_permission("users.read")
        with self.assertRaises(ConflictError):
            self.svc.create_permission("users.read")

    def test_delete_role_cascades_user_and_permission_mapping(self) -> None:
        user = self.svc.create_user("Harry", "harry@example.com")
        role = self.svc.create_role("admin")
        perm = self.svc.create_permission("users.read")

        self.svc.assign_role_to_user(user["id"], role["id"])
        self.svc.assign_permission_to_role(role["id"], perm["id"])
        self.svc.delete_role(role["id"])

        access = self.svc.get_user_with_access(user["id"])
        self.assertEqual(access["roles"], [])
        self.assertEqual(access["permissions"], [])


class AccessControlServiceInMemoryTest(unittest.TestCase):
    def test_in_memory_database_persists_between_operations(self) -> None:
        svc = AccessControlService()
        try:
            user = svc.create_user("Memory User", "memory@example.com")
            fetched = svc.get_user(user["id"])
            self.assertEqual(fetched["email"], "memory@example.com")
            self.assertEqual(len(svc.list_users()), 1)
        finally:
            svc.close()


if __name__ == "__main__":
    unittest.main()
