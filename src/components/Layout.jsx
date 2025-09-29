import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import LogoutButton from '../features/auth/LogoutButton';

export default function Layout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">Harman Care Portal</div>
        <div className="header-actions">
          <LogoutButton />
        </div>
      </header>
      <div className="app-body">
        <NavBar />
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
