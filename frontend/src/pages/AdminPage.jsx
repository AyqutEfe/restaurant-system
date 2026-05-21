import { useState, useEffect } from 'react';
import { ADMIN_CREDENTIALS, CATEGORIES, CATEGORY_ORDER, RESERVATION_STATUS } from '../constants';
import {
  getAdminReservations,
  updateReservationStatus,
  getAdminMenu,
  createMenuItem,
  updateMenuItem,
  toggleMenuItemAvailability,
} from '../services/api';
import useToast from '../hooks/useToast';
import ToastContainer from '../components/Toast';
import './AdminPage.css';

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(
    () => localStorage.getItem('admin_auth') === 'true'
  );
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (
      credentials.username === ADMIN_CREDENTIALS.username &&
      credentials.password === ADMIN_CREDENTIALS.password
    ) {
      localStorage.setItem('admin_auth', 'true');
      setAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Geçersiz kullanıcı adı veya şifre');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    setAuthenticated(false);
  };

  if (!authenticated) {
    return (
      <div className="admin-page" id="admin-login-page">
        <div className="login-container">
          <div className="login-icon">🔐</div>
          <h1 className="login-title">Admin Paneli</h1>
          <p className="login-subtitle">Yönetim paneline erişmek için giriş yapın</p>
          <form className="login-form" onSubmit={handleLogin} id="login-form">
            <div className="form-group">
              <label htmlFor="login-username">Kullanıcı Adı</label>
              <input
                id="login-username"
                type="text"
                required
                placeholder="Kullanıcı adı"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="login-password">Şifre</label>
              <input
                id="login-password"
                type="password"
                required
                placeholder="Şifre"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              />
            </div>
            {loginError && <p className="login-error">{loginError}</p>}
            <button type="submit" className="login-btn" id="login-submit">Giriş Yap</button>
          </form>
        </div>
      </div>
    );
  }

  return <AdminDashboard onLogout={handleLogout} />;
}

function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('reservations');
  const { toasts, addToast, removeToast } = useToast();

  return (
    <div className="admin-page" id="admin-dashboard">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <div className="admin-header">
        <h1 className="admin-title">Admin Paneli</h1>
        <button className="logout-btn" onClick={onLogout} id="logout-btn">
          Çıkış Yap
        </button>
      </div>

      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === 'reservations' ? 'active' : ''}`}
          onClick={() => setActiveTab('reservations')}
          id="tab-reservations"
        >
          📋 Rezervasyonlar
        </button>
        <button
          className={`admin-tab ${activeTab === 'menu' ? 'active' : ''}`}
          onClick={() => setActiveTab('menu')}
          id="tab-menu"
        >
          🍽️ Menü Yönetimi
        </button>
      </div>

      {activeTab === 'reservations' ? (
        <ReservationsPanel addToast={addToast} />
      ) : (
        <MenuPanel addToast={addToast} />
      )}
    </div>
  );
}

function ReservationsPanel({ addToast }) {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const res = await getAdminReservations();
      setReservations(res.data);
    } catch (err) {
      addToast('Rezervasyonlar yüklenemedi', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateReservationStatus(id, status);
      addToast(
        status === 'CONFIRMED' ? 'Rezervasyon onaylandı ✅' : 'Rezervasyon iptal edildi ❌',
        status === 'CONFIRMED' ? 'success' : 'warning'
      );
      fetchReservations();
    } catch (err) {
      addToast('Durum güncellenemedi', 'error');
    }
  };

  if (loading) {
    return <div className="panel-loading"><div className="loader"></div></div>;
  }

  return (
    <div className="panel" id="reservations-panel">
      {reservations.length === 0 ? (
        <div className="panel-empty">Henüz rezervasyon bulunmuyor</div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table" id="reservations-table">
            <thead>
              <tr>
                <th>Ad</th>
                <th>Telefon</th>
                <th>Tarih</th>
                <th>Saat</th>
                <th>Kişi</th>
                <th>Masa</th>
                <th>Durum</th>
                <th>Özel İstek</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r.id}>
                  <td>{r.customerName}</td>
                  <td>{r.customerPhone}</td>
                  <td>{r.reservationDate}</td>
                  <td>{r.reservationTime?.substring(0, 5)}</td>
                  <td>{r.partySize}</td>
                  <td>{r.tableNumber}</td>
                  <td>
                    <span className={`status-badge status-${r.status?.toLowerCase()}`}>
                      {RESERVATION_STATUS[r.status]}
                    </span>
                  </td>
                  <td className="special-req">{r.specialRequest || '-'}</td>
                  <td className="action-cell">
                    {r.status === 'PENDING' && (
                      <>
                        <button
                          className="action-btn confirm-btn"
                          onClick={() => handleStatusUpdate(r.id, 'CONFIRMED')}
                        >
                          Onayla
                        </button>
                        <button
                          className="action-btn cancel-btn"
                          onClick={() => handleStatusUpdate(r.id, 'CANCELLED')}
                        >
                          İptal
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function MenuPanel({ addToast }) {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
  });

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await getAdminMenu();
      setMenuItems(res.data);
    } catch (err) {
      addToast('Menü yüklenemedi', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', category: '', imageUrl: '' });
    setEditingItem(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, price: parseFloat(form.price) };

    try {
      if (editingItem) {
        await updateMenuItem(editingItem.id, payload);
        addToast('Ürün güncellendi ✏️', 'success');
      } else {
        await createMenuItem(payload);
        addToast('Yeni ürün eklendi 🎉', 'success');
      }
      resetForm();
      fetchMenu();
    } catch (err) {
      addToast(err.response?.data?.message || 'İşlem başarısız', 'error');
    }
  };

  const handleEdit = (item) => {
    setForm({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      category: item.category,
      imageUrl: item.imageUrl || '',
    });
    setEditingItem(item);
    setShowForm(true);
  };

  const handleToggle = async (id) => {
    try {
      await toggleMenuItemAvailability(id);
      addToast('Ürün durumu güncellendi', 'success');
      fetchMenu();
    } catch (err) {
      addToast('Durum güncellenemedi', 'error');
    }
  };

  if (loading) {
    return <div className="panel-loading"><div className="loader"></div></div>;
  }

  return (
    <div className="panel" id="menu-panel">
      <div className="panel-actions">
        <button
          className="add-btn"
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          id="add-menu-item-btn"
        >
          {showForm ? '✕ Kapat' : '+ Yeni Ürün Ekle'}
        </button>
      </div>

      {showForm && (
        <form className="menu-form" onSubmit={handleSubmit} id="menu-item-form">
          <h3>{editingItem ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Ürün Adı</label>
              <input
                required
                placeholder="Ürün adı"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Fiyat (₺)</label>
              <input
                required
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Kategori</label>
              <select
                required
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="">Seçin</option>
                {CATEGORY_ORDER.map((cat) => (
                  <option key={cat} value={cat}>{CATEGORIES[cat]}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Görsel URL (Opsiyonel)</label>
              <input
                placeholder="https://..."
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Açıklama</label>
            <textarea
              rows="2"
              placeholder="Ürün açıklaması"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="form-buttons">
            <button type="submit" className="save-btn">
              {editingItem ? 'Güncelle' : 'Kaydet'}
            </button>
            <button type="button" className="cancel-form-btn" onClick={resetForm}>
              İptal
            </button>
          </div>
        </form>
      )}

      <div className="table-wrapper">
        <table className="data-table" id="menu-items-table">
          <thead>
            <tr>
              <th>Ad</th>
              <th>Kategori</th>
              <th>Fiyat</th>
              <th>Durum</th>
              <th>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map((item) => (
              <tr key={item.id} className={!item.isAvailable ? 'row-disabled' : ''}>
                <td>
                  <div className="item-name-cell">
                    <strong>{item.name}</strong>
                    {item.description && <small>{item.description}</small>}
                  </div>
                </td>
                <td>{CATEGORIES[item.category]}</td>
                <td className="price-cell">₺{Number(item.price).toFixed(2)}</td>
                <td>
                  <span className={`availability-badge ${item.isAvailable ? 'available' : 'unavailable'}`}>
                    {item.isAvailable ? 'Mevcut' : 'Tükendi'}
                  </span>
                </td>
                <td className="action-cell">
                  <button className="action-btn edit-btn" onClick={() => handleEdit(item)}>
                    Düzenle
                  </button>
                  <button
                    className={`action-btn toggle-btn ${item.isAvailable ? 'disable-toggle' : 'enable-toggle'}`}
                    onClick={() => handleToggle(item.id)}
                  >
                    {item.isAvailable ? 'Tükendi' : 'Aktif Et'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
