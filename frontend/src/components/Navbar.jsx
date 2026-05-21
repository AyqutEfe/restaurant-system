import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🍽️</span>
          <span className="brand-text">La Maison</span>
        </Link>
        <div className="navbar-links">
          <Link
            to="/menu"
            className={`nav-link ${isActive('/menu') ? 'active' : ''}`}
            id="nav-menu"
          >
            Menü
          </Link>
          <Link
            to="/reservation"
            className={`nav-link ${isActive('/reservation') ? 'active' : ''}`}
            id="nav-reservation"
          >
            Rezervasyon
          </Link>
        </div>
      </div>
    </nav>
  );
}
