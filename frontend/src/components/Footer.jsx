import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer glass-panel" id="main-footer">
      <div className="footer-inner">
        {/* Left Column: Brand & Motto */}
        <div className="footer-col brand-col">
          <Link to="/" className="footer-brand">
            <span className="brand-icon">🌊</span>
            <span className="brand-text">gölet restaurant  </span>
          </Link>
          <p className="footer-desc">
            Eşsiz gölet manzarası eşliğinde, eğlence, üstün kalite ve benzersiz gurme lezzetlerin buluşma noktası.
          </p>
          <div className="social-links">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" title="Instagram">📸 Instagram</a>
            <a href="https://tripadvisor.com" target="_blank" rel="noreferrer" title="TripAdvisor">🦉 TripAdvisor</a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" title="Facebook">📘 Facebook</a>
          </div>
        </div>

        {/* Middle Column: Links */}
        <div className="footer-col links-col">
          <h4>Hızlı Bağlantılar</h4>
          <ul className="footer-links-list">
            <li><Link to="/">Ana Sayfa</Link></li>
            <li><Link to="/about">Kurumsal</Link></li>
            <li><Link to="/menu">Menü</Link></li>
            <li><Link to="/reservation">Rezervasyon</Link></li>
            <li><Link to="/contact">İletişim</Link></li>
          </ul>
        </div>

        {/* Right Column: Opening Hours & Contact Info */}
        <div className="footer-col contact-col">
          <h4>Çalışma Saatleri</h4>
          <p className="hours-text">Haftanın Her Günü: 09:00 – 23:00</p>
          <p className="breakfast-text">Kahvaltı Servisi: 09:00 – 13:00</p>

          <h4 style={{ marginTop: '16px' }}>Bize Ulaşın</h4>
          <p className="contact-item">📍 Gölet Kıyısı, No: 22, Keşan / Edirne</p>
          <p className="contact-item">📞 +90 (284) 515 12 34</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} gölet restaurant  . Tüm hakları saklıdır. | Designed by Antigravity</p>
      </div>
    </footer>
  );
}
