import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useLoginMutation, useMeQuery } from '../../api/authApi';
import { setCredentials } from './authSlice';
import Loading from '../../components/Loading';
import ErrorBlock from '../../components/ErrorBlock';

const initialForm = {
  email: '',
  password: '',
};

export default function LoginPage() {
  const [form, setForm] = useState(initialForm);
  const [formError, setFormError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const { data: meData, isFetching: loadingMe, isSuccess: hasMe } = useMeQuery(undefined, {
    skip: !accessToken,
  });
  const [login, { isLoading, error }] = useLoginMutation();

  useEffect(() => {
    if (hasMe && meData) {
      dispatch(setCredentials({ user: meData }));
      const redirectTo = location.state?.from || '/';
      navigate(redirectTo, { replace: true });
    }
  }, [dispatch, hasMe, meData, navigate, location.state]);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError(null);
    try {
      const result = await login({ email: form.email, password: form.password }).unwrap();
      dispatch(setCredentials(result));
    } catch (err) {
      setFormError(err?.data || { detail: 'Unable to sign in. Please try again.' });
    }
  };

  if (loadingMe) {
    return <Loading message="Validating session..." />;
  }

  if (accessToken && hasMe && meData) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Welcome back</h1>
        <p className="auth-subtitle">Sign in with your portal credentials.</p>

        {formError && <ErrorBlock error={formError} />}
        {error && !formError && <ErrorBlock error={error} />}

        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange('email')}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={form.password}
          onChange={handleChange('password')}
          required
        />

        <button type="submit" className="primary" disabled={isLoading}>
          {isLoading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
