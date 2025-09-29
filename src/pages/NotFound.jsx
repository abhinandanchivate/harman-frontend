import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="stack gap-md not-found">
      <h1>404</h1>
      <p>The page you are looking for could not be found.</p>
      <Link to="/" className="primary">
        Go home
      </Link>
    </section>
  );
}
