import { useState } from 'react';
import { createReservation } from '../services/api';
import { TIME_SLOTS, MAX_PARTY_SIZE } from '../constants';
import { useAmbient, AMBIENT_THEMES } from '../context/AmbientContext';
import useToast from '../hooks/useToast';
import ToastContainer from '../components/Toast';
import './ReservationPage.css';

export default function ReservationPage() {
  const { theme } = useAmbient();
  const { toasts, addToast, removeToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    reservationDate: '',
    reservationTime: '',
    partySize: '',
    specialRequest: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Assign a random table number 1-10
    const dummyTable = Math.floor(Math.random() * 10) + 1;

    try {
      const payload = {
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        reservationDate: form.reservationDate,
        reservationTime: form.reservationTime,
        partySize: parseInt(form.partySize, 10),
        tableNumber: dummyTable,
        specialRequest: form.specialRequest,
      };
      await createReservation(payload);
      addToast('Rezervasyon talebiniz alınmıştır! İşletmemiz masa yerleşiminizi kişi sayınıza göre planlayacaktır. 🍽️✨', 'success');
      setForm({
        customerName: '',
        customerPhone: '',
        reservationDate: '',
        reservationTime: '',
        partySize: '',
        specialRequest: '',
      });
    } catch (err) {
      const message = err.response?.data?.message || 'Rezervasyon oluşturulamadı';
      addToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  const getAmbientInvite = () => {
    switch (theme) {
      case AMBIENT_THEMES.SUNRISE:
        return {
          title: 'Gölün Sabah Dinginliği',
          desc: 'Sabahın ilk ışıklarında, nilüferlerin uyanışı eşliğinde enfes lezzetlerle dolu taze bir kahvaltı keyfi.',
        };
      case AMBIENT_THEMES.SUNSET:
        return {
          title: 'Göl Kıyısında Gün Batımı',
          desc: 'Gökyüzü kızıla bürünüp gölet sularına yansırken, mum ışığı ve eşsiz müzikler eşliğinde kusursuz bir akşam yemeği.',
        };
      case AMBIENT_THEMES.NIGHT:
        return {
          title: 'Mehtap Eşliğinde Akşam Yemeği',
          desc: 'Yıldızların göle düştüğü, canlı müzik tınılarıyla çevrelenmiş, eğlence ve gurme lezzetlerin buluştuğu özel bir gece deneyimi.',
        };
      case AMBIENT_THEMES.NOON:
      default:
        return {
          title: 'Gölün Ferahlatıcı Esintisi',
          desc: 'Gölün ferahlatıcı esintisi eşliğinde, öğle saatlerinde kaliteyi hissedeceğiniz keyifli lezzet molaları.',
        };
    }
  };

  const inviteInfo = getAmbientInvite();

  return (
    <div className="reservation-page" id="reservation-page">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <div className="reservation-container">
        {/* Left Column: Ambient Info & Seat allocation policy */}
        <div className="reservation-info-pane glass-panel river-stone-lg">
          <div className="info-pane-content">
            <span className="pane-badge">Masa Yerleşimi</span>
            <h2 className="pane-title">{inviteInfo.title}</h2>
            <p className="pane-desc">{inviteInfo.desc}</p>

            <div className="pane-highlight river-stone-sm">
              <p>
                <strong>⚠️ Önemli Bilgilendirme:</strong> gölet restaurant'ta masa yerleşimleri, müşterilerimizin konforunu, lezzet ve servis kalitesini en üst düzeyde sunabilmek amacıyla <strong>işletme yetkilimiz tarafından</strong> planlanır.
              </p>
            </div>

            <div className="table-layout-details">
              <h4>Ayrıcalıklarımız</h4>
              <div className="layout-item">
                <span className="layout-icon">⭐</span>
                <div>
                  <strong>Üstün Hizmet Kalitesi:</strong>
                  <p>Her anınızda kendinizi özel hissedeceğiniz profesyonel servis ekibimiz ve güler yüzlü hizmetimiz.</p>
                </div>
              </div>
              <div className="layout-item">
                <span className="layout-icon">🍽️</span>
                <div>
                  <strong>Gurme Lezzetler:</strong>
                  <p>En kaliteli malzemelerle hazırlanan, damak hafızanızda yer edinecek şef spesiyalleri.</p>
                </div>
              </div>
              <div className="layout-item">
                <span className="layout-icon">🎉</span>
                <div>
                  <strong>Eğlence ve Canlı Müzik:</strong>
                  <p>Hafta sonları canlı müzik programlarımız ve göl manzaralı eşsiz etkinlik alanlarımız.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Booking Form */}
        <div className="reservation-form-pane glass-panel river-stone-lg">
          <div className="reservation-header">
            <h1 className="reservation-title">Masa Rezervasyonu</h1>
            <p className="reservation-subtitle">Göl kenarındaki yerinizi şimdi ayırtın</p>
          </div>

          <form className="reservation-form" onSubmit={handleSubmit} id="reservation-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="customerName">Ad Soyad</label>
                <input
                  id="customerName"
                  name="customerName"
                  type="text"
                  required
                  placeholder="Adınızı girin"
                  value={form.customerName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="customerPhone">Telefon</label>
                <input
                  id="customerPhone"
                  name="customerPhone"
                  type="tel"
                  required
                  placeholder="05XX XXX XX XX"
                  value={form.customerPhone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="reservationDate">Tarih</label>
                <input
                  id="reservationDate"
                  name="reservationDate"
                  type="date"
                  required
                  min={today}
                  value={form.reservationDate}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="reservationTime">Saat</label>
                <select
                  id="reservationTime"
                  name="reservationTime"
                  required
                  value={form.reservationTime}
                  onChange={handleChange}
                >
                  <option value="">Saat seçin</option>
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="partySize">Kişi Sayısı</label>
                <select
                  id="partySize"
                  name="partySize"
                  required
                  value={form.partySize}
                  onChange={handleChange}
                >
                  <option value="">Kişi sayısı seçin</option>
                  {Array.from({ length: MAX_PARTY_SIZE }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>{n} Kişi</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor="specialRequest">Özel İstekler (Opsiyonel)</label>
              <textarea
                id="specialRequest"
                name="specialRequest"
                rows="3"
                placeholder="Alerji hassasiyetleri, bebek sandalyesi talebi veya özel günler için not yazabilirsiniz..."
                value={form.specialRequest}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="submit-btn river-stone-sm"
              id="submit-reservation"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="btn-loader"></span>
                  İletiliyor...
                </>
              ) : (
                'Rezervasyon Talebini İlet'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
