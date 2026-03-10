import os
import tempfile
import unittest

from starterkit.services import AccessControlService, ConflictError, NotFoundError


class AccessControlServiceTest(unittest.TestCase):
    def setUp(self) -> None:
        fd, self.db_path = tempfile.mkstemp(suffix=".db")
        os.close(fd)
        self.svc = AccessControlService(self.db_path)

    def tearDown(self) -> None:
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

    def test_roles_and_permissions_crud(self) -> None:
        role = self.svc.create_role("admin", "Administrator")
        perm = self.svc.create_permission("users.read", "Read users")

        self.assertEqual(self.svc.get_role(role["id"])["name"], "admin")
        self.assertEqual(self.svc.get_permission(perm["id"])["name"], "users.read")

        role2 = self.svc.update_role(role["id"], description="Admin role")
        perm2 = self.svc.update_permission(perm["id"], description="Can read users")

        self.assertEqual(role2["description"], "Admin role")
        self.assertEqual(perm2["description"], "Can read users")

    def test_assignment_and_access_resolution(self) -> None:
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

        self.svc.revoke_role_from_user(user["id"], editor["id"])
        access_after_revoke = self.svc.get_user_with_access(user["id"])
        self.assertEqual(len(access_after_revoke["roles"]), 1)

    def test_conflict_constraints(self) -> None:
        self.svc.create_user("Harry", "harry@example.com")
        with self.assertRaises(ConflictError):
            self.svc.create_user("Harry 2", "harry@example.com")

        self.svc.create_role("admin")
        with self.assertRaises(ConflictError):
            self.svc.create_role("admin")

        self.svc.create_permission("users.read")
        with self.assertRaises(ConflictError):
            self.svc.create_permission("users.read")


if __name__ == "__main__":
    unittest.main()
