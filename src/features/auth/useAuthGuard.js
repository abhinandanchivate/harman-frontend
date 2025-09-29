import { useMemo } from 'react';
import { useSelector } from 'react-redux';

const normalize = (value) => (Array.isArray(value) ? value : value ? [value] : []);

const roleMatches = (userRoles = [], requiredRoles = []) => {
  if (!requiredRoles.length) return true;
  const normalizedRoles = userRoles.map((role) => role?.toLowerCase());
  return requiredRoles.some((role) => normalizedRoles.includes(role?.toLowerCase()));
};

const permissionMatches = (userPermissions = {}, requiredPermission) => {
  if (!requiredPermission) return true;
  const { entity, action } = requiredPermission;
  if (!entity || !action) return true;
  const actions = userPermissions?.[entity] || [];
  return actions.includes(action);
};

export default function useAuthGuard(options = {}) {
  const { roles: rolesOption, permission } = options;
  const user = useSelector((state) => state.auth.user);

  return useMemo(() => {
    const requiredRoles = normalize(rolesOption);
    const allowed =
      Boolean(user) &&
      roleMatches(user?.roles || [], requiredRoles) &&
      permissionMatches(user?.permissions || {}, permission);

    return {
      allowed,
      user,
    };
  }, [user, rolesOption, permission]);
}
