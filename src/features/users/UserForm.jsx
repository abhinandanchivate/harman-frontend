import { useEffect, useState } from 'react';
import { useCreateUserMutation } from '../../api/usersApi';
import ErrorBlock from '../../components/ErrorBlock';

const initialState = {
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  phone: '',
  dateOfBirth: '',
  verificationMethod: 'email',
  acceptTerms: true,
};

export default function UserForm() {
  const [form, setForm] = useState(initialState);
  const [createUser, { isLoading, error, isSuccess }] = useCreateUserMutation();

  useEffect(() => {
    if (isSuccess) {
      setForm(initialState);
    }
  }, [isSuccess]);

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await createUser({
      email: form.email,
      password: form.password,
      confirm_password: form.confirmPassword,
      accept_terms: form.acceptTerms,
      verification_method: form.verificationMethod,
      profile: {
        first_name: form.firstName,
        last_name: form.lastName,
        phone: form.phone,
        date_of_birth: form.dateOfBirth || null,
      },
    });
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h3>Create patient portal user</h3>
      <div className="form-grid">
        <label htmlFor="user-email">Email</label>
        <input
          id="user-email"
          type="email"
          value={form.email}
          onChange={handleChange('email')}
          required
        />

        <label htmlFor="user-first-name">First name</label>
        <input
          id="user-first-name"
          value={form.firstName}
          onChange={handleChange('firstName')}
          required
        />

        <label htmlFor="user-last-name">Last name</label>
        <input
          id="user-last-name"
          value={form.lastName}
          onChange={handleChange('lastName')}
          required
        />

        <label htmlFor="user-phone">Phone</label>
        <input id="user-phone" value={form.phone} onChange={handleChange('phone')} />

        <label htmlFor="user-dob">Date of birth</label>
        <input
          id="user-dob"
          type="date"
          value={form.dateOfBirth}
          onChange={handleChange('dateOfBirth')}
        />

        <label htmlFor="user-password">Password</label>
        <input
          id="user-password"
          type="password"
          value={form.password}
          onChange={handleChange('password')}
          required
        />

        <label htmlFor="user-confirm-password">Confirm password</label>
        <input
          id="user-confirm-password"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange('confirmPassword')}
          required
        />
      </div>

      <label className="checkbox">
        <input
          type="checkbox"
          checked={form.acceptTerms}
          onChange={handleChange('acceptTerms')}
        />
        <span>I confirm the user accepted the portal terms of service.</span>
      </label>

      {error && <ErrorBlock error={error} />}
      {isSuccess && <p className="success">User registered successfully.</p>}

      <button type="submit" className="primary" disabled={isLoading}>
        {isLoading ? 'Creating user…' : 'Create user'}
      </button>
    </form>
  );
}
