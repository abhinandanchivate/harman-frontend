import { useState } from 'react';
import {
  useListRolesQuery,
  useCreateRoleMutation,
  useDeleteRoleMutation,
} from '../../api/rolesApi';
import Loading from '../../components/Loading';
import ErrorBlock from '../../components/ErrorBlock';

export default function RolesList() {
  const { data = [], isLoading, isError, error } = useListRolesQuery();
  const [createRole, { isLoading: creating, error: createError }] = useCreateRoleMutation();
  const [deleteRole, { isLoading: deleting }] = useDeleteRoleMutation();
  const [form, setForm] = useState({ name: '', description: '', permissions: '{"patients": ["read"]}' });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const permissions = JSON.parse(form.permissions || '{}');
      await createRole({
        name: form.name,
        description: form.description,
        permissions,
      }).unwrap();
      setForm({ name: '', description: '', permissions: '{"patients": ["read"]}' });
    } catch (err) {
      console.error('Role creation failed', err);
    }
  };

  const handleDelete = async (roleId) => {
    if (window.confirm('Delete this role?')) {
      await deleteRole(roleId);
    }
  };

  if (isLoading) return <Loading message="Loading roles" />;
  if (isError) return <ErrorBlock error={error} />;

  return (
    <section className="stack gap-lg">
      <header className="section-header">
        <div>
          <h1>Roles</h1>
          <p>Manage RBAC roles and their permission scopes.</p>
        </div>
      </header>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Permissions</th>
              <th aria-label="actions" />
            </tr>
          </thead>
          <tbody>
            {data.map((role) => (
              <tr key={role.id}>
                <td>{role.name}</td>
                <td>{role.description}</td>
                <td>
                  {role.permissions &&
                    Object.entries(role.permissions).map(([entity, actions]) => (
                      <span key={entity} className="chip">
                        {entity}: {actions.join(', ')}
                      </span>
                    ))}
                </td>
                <td>
                  <button
                    type="button"
                    className="link-button danger"
                    onClick={() => handleDelete(role.id)}
                    disabled={deleting}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form className="card" onSubmit={handleSubmit}>
        <h3>Create role</h3>
        <div className="form-grid">
          <label htmlFor="role-name">Name</label>
          <input
            id="role-name"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            required
          />

          <label htmlFor="role-description">Description</label>
          <input
            id="role-description"
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
          />

          <label htmlFor="role-permissions">Permissions JSON</label>
          <textarea
            id="role-permissions"
            rows={4}
            value={form.permissions}
            onChange={(event) => setForm((prev) => ({ ...prev, permissions: event.target.value }))}
          />
        </div>

        {createError && <ErrorBlock error={createError} />}

        <button type="submit" className="primary" disabled={creating}>
          {creating ? 'Creating…' : 'Create role'}
        </button>
      </form>
    </section>
  );
}
