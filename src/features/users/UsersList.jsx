import { useMemo, useState } from 'react';
import { useListUsersQuery, useAssignRolesMutation } from '../../api/usersApi';
import Loading from '../../components/Loading';
import ErrorBlock from '../../components/ErrorBlock';
import UserForm from './UserForm';

export default function UsersList() {
  const { data = [], isLoading, isError, error } = useListUsersQuery();
  const [assignRoles, { isLoading: assigning, error: assignError, isSuccess: assignSuccess }] =
    useAssignRolesMutation();
  const [roleInput, setRoleInput] = useState({ userId: '', roles: '', reason: '' });

  const rows = useMemo(() => data || [], [data]);

  const handleAssignSubmit = async (event) => {
    event.preventDefault();
    if (!roleInput.userId || !roleInput.roles) return;
    const roles = roleInput.roles.split(',').map((item) => item.trim()).filter(Boolean);
    await assignRoles({
      user_id: roleInput.userId,
      roles,
      reason: roleInput.reason || 'Updated via portal UI',
    });
  };

  if (isLoading) return <Loading message="Loading users" />;
  if (isError) return <ErrorBlock error={error} />;

  return (
    <section className="stack gap-lg">
      <header className="section-header">
        <div>
          <h1>Users</h1>
          <p>
            The backend currently exposes a self profile endpoint, so this list includes the authenticated
            session.
          </p>
        </div>
      </header>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Roles</th>
              <th>Permissions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>{user.roles?.join(', ')}</td>
                <td>
                  {user.permissions &&
                    Object.entries(user.permissions).map(([entity, actions]) => (
                      <span key={entity} className="chip">
                        {entity}: {actions.join(', ')}
                      </span>
                    ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <UserForm />

      <form className="card" onSubmit={handleAssignSubmit}>
        <h3>Assign roles</h3>
        <p className="muted">
          Provide a user ID and comma separated role names (e.g. ADMIN, MANAGER). Effective dates default to now.
        </p>
        <div className="form-grid">
          <label htmlFor="assign-user-id">User ID</label>
          <input
            id="assign-user-id"
            value={roleInput.userId}
            onChange={(event) => setRoleInput((prev) => ({ ...prev, userId: event.target.value }))}
            required
          />

          <label htmlFor="assign-roles">Roles</label>
          <input
            id="assign-roles"
            value={roleInput.roles}
            onChange={(event) => setRoleInput((prev) => ({ ...prev, roles: event.target.value }))}
            placeholder="ADMIN, STAFF"
            required
          />

          <label htmlFor="assign-reason">Reason</label>
          <input
            id="assign-reason"
            value={roleInput.reason}
            onChange={(event) => setRoleInput((prev) => ({ ...prev, reason: event.target.value }))}
            placeholder="Portal update"
          />
        </div>

        {assignError && <ErrorBlock error={assignError} />}
        {assignSuccess && <p className="success">Roles updated.</p>}

        <button type="submit" className="primary" disabled={assigning}>
          {assigning ? 'Saving…' : 'Assign roles'}
        </button>
      </form>
    </section>
  );
}
