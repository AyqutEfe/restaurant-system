import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="navbar glass-panel" id="main-navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🌊</span>
          <span className="brand-text">gölet restaurant  </span>
        </Link>

        <div className="navbar-right">
          <div className="navbar-links">
            <Link
              to="/"
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
              id="nav-home"
            >
              Ana Sayfa
            </Link>
            <Link
              to="/about"
              className={`nav-link ${isActive('/about') ? 'active' : ''}`}
              id="nav-about"
            >
              Kurumsal
            </Link>
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
            <Link
              to="/contact"
              className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
              id="nav-contact"
            >
              İletişim
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
