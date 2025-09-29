import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { useMeQuery } from '../api/authApi';
import Loading from './Loading';
import { clearAuth, setCredentials } from '../features/auth/authSlice';

export default function ProtectedRoute({ children }) {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const dispatch = useDispatch();
  const location = useLocation();

  const {
    data: me,
    isFetching,
    isError,
    error,
  } = useMeQuery(undefined, {
    skip: !accessToken,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (me) {
      dispatch(setCredentials({ user: me }));
    }
  }, [me, dispatch]);

  useEffect(() => {
    if (isError && error?.status === 401) {
      dispatch(clearAuth());
    }
  }, [isError, error, dispatch]);

  if (!accessToken) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (isFetching) {
    return <Loading message="Loading your workspace..." />;
  }

  if (isError && error?.status !== 401) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
