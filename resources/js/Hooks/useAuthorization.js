import { usePage } from '@inertiajs/react';

export default function useAuthorization() {
    const { auth } = usePage().props;
    const permissions = auth?.permissions ?? [];
    const roles = auth?.roles ?? [];

    return {
        permissions,
        roles,
        can: (permission) => permissions.includes(permission),
        hasRole: (role) => roles.includes(role),
    };
}
