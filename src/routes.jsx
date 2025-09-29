import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import LoginPage from './features/auth/LoginPage';
import Dashboard from './features/dashboard/Dashboard';
import PatientsList from './features/patients/PatientsList';
import PatientDetail from './features/patients/PatientDetail';
import AppointmentsList from './features/appointments/AppointmentsList';
import UsersList from './features/users/UsersList';
import RolesList from './features/roles/RolesList';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'patients', element: <PatientsList /> },
      { path: 'patients/:id', element: <PatientDetail /> },
      { path: 'appointments', element: <AppointmentsList /> },
      { path: 'users', element: <UsersList /> },
      { path: 'roles', element: <RolesList /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
