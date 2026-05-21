import { useState } from 'react';
import { createReservation } from '../services/api';
import { TIME_SLOTS, TABLE_COUNT, MAX_PARTY_SIZE } from '../constants';
import useToast from '../hooks/useToast';
import ToastContainer from '../components/Toast';
import './ReservationPage.css';

export default function ReservationPage() {
  const { toasts, addToast, removeToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    reservationDate: '',
    reservationTime: '',
    partySize: '',
    tableNumber: '',
    specialRequest: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...form,
        partySize: parseInt(form.partySize, 10),
        tableNumber: parseInt(form.tableNumber, 10),
      };
      await createReservation(payload);
      addToast('Rezervasyonunuz başarıyla oluşturuldu! 🎉', 'success');
      setForm({
        customerName: '',
        customerPhone: '',
        reservationDate: '',
        reservationTime: '',
        partySize: '',
        tableNumber: '',
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

  return (
    <div className="reservation-page" id="reservation-page">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <div className="reservation-container">
        <div className="reservation-header">
          <h1 className="reservation-title">Rezervasyon</h1>
          <p className="reservation-subtitle">Masanızı şimdiden ayırtın</p>
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
                <option value="">Kişi sayısı</option>
                {Array.from({ length: MAX_PARTY_SIZE }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n} Kişi</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="tableNumber">Masa Numarası</label>
              <select
                id="tableNumber"
                name="tableNumber"
                required
                value={form.tableNumber}
                onChange={handleChange}
              >
                <option value="">Masa seçin</option>
                {Array.from({ length: TABLE_COUNT }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>Masa {n}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group full-width">
            <label htmlFor="specialRequest">Özel İstek (Opsiyonel)</label>
            <textarea
              id="specialRequest"
              name="specialRequest"
              rows="3"
              placeholder="Doğum günü, alerji bilgisi, pencere kenarı tercihi vb."
              value={form.specialRequest}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="submit-btn"
            id="submit-reservation"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="btn-loader"></span>
                Gönderiliyor...
              </>
            ) : (
              'Rezervasyon Yap'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
