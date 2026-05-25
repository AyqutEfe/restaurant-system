import { useState } from 'react';
import useToast from '../hooks/useToast';
import ToastContainer from '../components/Toast';
import './ContactPage.css';

export default function ContactPage() {
  const { toasts, addToast, removeToast } = useToast();
  const [email, setEmail] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      addToast('E-Bülten aboneliğiniz başarıyla oluşturuldu! 🎶🍽️', 'success');
      setEmail('');
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    addToast('Mesajınız başarıyla iletildi! En kısa sürede dönüş yapacağız. ✉️', 'success');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="contact-page" id="contact-page">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Hero Section */}
      <section className="contact-hero">
        <span className="contact-badge">İletişim</span>
        <h1 className="contact-title">Bizimle İletişime Geçin</h1>
        <p className="contact-subtitle">Eşsiz göl manzarası ve kaliteli eğlencenin adresi</p>
      </section>

      {/* Main Grid */}
      <section className="contact-grid-section">
        <div className="contact-container">
          <div className="contact-grid">
            {/* Form Column */}
            <div className="contact-form-pane glass-panel river-stone-lg">
              <h2>Bize Mesaj Gönderin</h2>
              <form className="contact-form" onSubmit={handleContactSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Ad Soyad</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Adınız ve soyadınız"
                    value={form.name}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">E-Posta Adresi</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="ornek@eposta.com"
                    value={form.email}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Konu</label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    placeholder="Hangi konuda yazıyorsunuz?"
                    value={form.subject}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Mesajınız</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    required
                    placeholder="Mesajınızı buraya yazın..."
                    value={form.message}
                    onChange={handleFormChange}
                  />
                </div>
                <button type="submit" className="contact-submit-btn river-stone-sm">
                  Mesajımı İlet
                </button>
              </form>
            </div>

            {/* Info and Newsletter Column */}
            <div className="contact-info-pane">
              <div className="info-cards">
                <div className="info-card glass-panel river-stone-md">
                  <div className="info-icon">📍</div>
                  <div>
                    <h3>Adresimiz</h3>
                    <p>Gölet Kıyısı, No: 22, Keşan / Edirne</p>
                  </div>
                </div>
                <div className="info-card glass-panel river-stone-md">
                  <div className="info-icon">📞</div>
                  <div>
                    <h3>Telefon</h3>
                    <p>+90 (284) 515 12 34</p>
                  </div>
                </div>
                <div className="info-card glass-panel river-stone-md">
                  <div className="info-icon">✉️</div>
                  <div>
                    <h3>E-Posta</h3>
                    <p>iletisim@lamaisondulac.com</p>
                  </div>
                </div>
              </div>

              {/* Newsletter Subscription */}
              <div className="newsletter-box glass-panel river-stone-lg">
                <h3>E-Bültenimize Abone Olun</h3>
                <p>Mevsimsel menü değişiklikleri, şefin özel etkinlikleri ve göl kenarı konserlerimizden ilk siz haberdar olun.</p>
                <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
                  <input
                    type="email"
                    required
                    placeholder="E-posta adresinizi yazın"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button type="submit" className="newsletter-submit-btn river-stone-sm">
                    Kayıt Ol
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Integration */}
      <section className="map-section">
        <div className="contact-container">
          <div className="map-frame-wrapper glass-panel river-stone-lg">
            {/* OpenStreetMap Iframe */}
            <iframe
              title="gölet restaurant   Konum Haritası"
              width="100%"
              height="450"
              frameBorder="0"
              scrolling="no"
              marginHeight="0"
              marginWidth="0"
              src="https://www.openstreetmap.org/export/embed.html?bbox=26.61%2C40.84%2C26.65%2C40.87&amp;layer=mapnik"
              style={{ border: 0 }}
            />
            <div className="map-caption">
              <span>gölet restaurant   - Keşan Göleti Kıyısı</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
