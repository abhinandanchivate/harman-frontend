import { NavLink } from 'react-router-dom';
import useAuthGuard from '../features/auth/useAuthGuard';

const navItems = [
  { to: '/', label: 'Home', exact: true },
  { to: '/dashboard', label: 'Dashboard' },
  {
    to: '/patients',
    label: 'Patients',
    permission: { entity: 'patients', action: 'read' },
  },
  {
    to: '/appointments',
    label: 'Appointments',
    permission: { entity: 'appointments', action: 'read' },
  },
  {
    to: '/users',
    label: 'Users',
    roles: ['ADMIN', 'MANAGER'],
  },
  {
    to: '/roles',
    label: 'Roles',
    roles: ['ADMIN'],
  },
];

export default function NavBar() {
  const { user } = useAuthGuard();

  const canAccess = (item) => {
    if (!user) return false;
    const roles = Array.isArray(item.roles) ? item.roles : [];
    const permissions = user.permissions || {};

    const hasRole =
      !roles.length || roles.some((role) => user.roles?.map((r) => r.toUpperCase()).includes(role));

    if (!hasRole) return false;

    if (!item.permission) return true;
    const { entity, action } = item.permission;
    if (!entity || !action) return true;
    const actions = permissions[entity] || permissions['*'] || [];
    return actions.includes(action) || actions.includes('*');
  };

  return (
    <nav className="side-nav">
      <div className="user-card">
        <div className="user-name">{user?.username || user?.email}</div>
        <div className="user-roles">{user?.roles?.join(', ')}</div>
      </div>
      <ul>
        {navItems.map((item) => {
          if (!canAccess(item)) return null;
          return (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.exact}
                className={({ isActive }) => (isActive ? 'active' : undefined)}
              >
                {item.label}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
