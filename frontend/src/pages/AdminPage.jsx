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

// Helper to parse description field in Admin panel
const parseItemDescription = (desc) => {
  if (!desc) return { text: '', ingredients: [], allergens: [], tags: [] };
  try {
    const parsed = JSON.parse(desc);
    return {
      text: parsed.desc || '',
      ingredients: parsed.ingredients || [],
      allergens: parsed.allergens || [],
      tags: parsed.tags || []
    };
  } catch (e) {
    return {
      text: desc,
      ingredients: [],
      allergens: [],
      tags: []
    };
  }
};

function MenuPanel({ addToast }) {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({
    name: '',
    price: '',
    category: '',
    imageUrl: '',
  });

  // Local state for description subfields
  const [descFields, setDescFields] = useState({
    descText: '',
    ingredients: '',
    allergens: '',
    tags: '',
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
    setForm({ name: '', price: '', category: '', imageUrl: '' });
    setDescFields({ descText: '', ingredients: '', allergens: '', tags: '' });
    setEditingItem(null);
    setShowForm(false);
  };

  const handleDescChange = (e) => {
    setDescFields({ ...descFields, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Compile description fields into a JSON string
    const compiledDescription = JSON.stringify({
      desc: descFields.descText.trim(),
      ingredients: descFields.ingredients
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      allergens: descFields.allergens
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      tags: descFields.tags
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    });

    const payload = {
      name: form.name,
      price: parseFloat(form.price),
      category: form.category,
      imageUrl: form.imageUrl,
      description: compiledDescription,
    };

    try {
      if (editingItem) {
        await updateMenuItem(editingItem.id, payload);
        addToast('Ürün başarıyla güncellendi ✏️', 'success');
      } else {
        await createMenuItem(payload);
        addToast('Yeni ürün menüye eklendi 🎉', 'success');
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
      price: item.price.toString(),
      category: item.category,
      imageUrl: item.imageUrl || '',
    });

    const parsed = parseItemDescription(item.description);
    setDescFields({
      descText: parsed.text,
      ingredients: parsed.ingredients.join(', '),
      allergens: parsed.allergens.join(', '),
      tags: parsed.tags.join(', '),
    });

    setEditingItem(item);
    setShowForm(true);
  };

  const handleToggle = async (id) => {
    try {
      await toggleMenuItemAvailability(id);
      addToast('Ürün durumu başarıyla güncellendi', 'success');
      fetchMenu();
    } catch (err) {
      addToast('Durum güncellenemedi', 'error');
    }
  };

  if (loading) {
    return <div className="panel-loading"><div className="loader"></div></div>;
  }

  return (
    <div className="panel glass-panel river-stone-lg" id="menu-panel">
      <div className="panel-actions">
        <button
          className="add-btn river-stone-sm"
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          id="add-menu-item-btn"
        >
          {showForm ? '✕ Formu Kapat' : '+ Yeni Ürün Ekle'}
        </button>
      </div>

      {showForm && (
        <form className="menu-form" onSubmit={handleSubmit} id="menu-item-form">
          <h3 className="serif-heading">{editingItem ? 'Ürünü Düzenle' : 'Yeni Menü Ürünü Ekle'}</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Ürün Adı</label>
              <input
                required
                placeholder="Örn: Tereyağlı Alabalık"
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
                <option value="">Kategori seçin</option>
                {CATEGORY_ORDER.map((cat) => (
                  <option key={cat} value={cat}>{CATEGORIES[cat]}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Görsel URL (Opsiyonel)</label>
              <input
                placeholder="https://gorsel-adresi.com/resim.jpg"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              />
            </div>
          </div>

          {/* Enriched Metadata Fields */}
          <div className="form-group full-width">
            <label>Açıklama (Tanıtım Yazısı)</label>
            <textarea
              name="descText"
              rows="2"
              placeholder="Ürünün kısa lezzet açıklaması..."
              value={descFields.descText}
              onChange={handleDescChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Malzemeler (Virgülle ayırın)</label>
              <input
                name="ingredients"
                placeholder="Levrek, zeytinyağı, limon, kekik"
                value={descFields.ingredients}
                onChange={handleDescChange}
              />
            </div>
            <div className="form-group">
              <label>Alerjenler (Virgülle ayırın)</label>
              <input
                name="allergens"
                placeholder="Balık, Süt Ürünleri, Glüten"
                value={descFields.allergens}
                onChange={handleDescChange}
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label>Etiketler / Alt Kategoriler (Virgülle ayırın)</label>
            <input
              name="tags"
              placeholder="Vegan, Glutensiz, Mezeler, Şefin Seçimi, Alkollü"
              value={descFields.tags}
              onChange={handleDescChange}
            />
            <small style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '4px' }}>
              Filtrelemede görünmesi için 'Vegan', 'Vejetaryen' veya 'Glutensiz' etiketlerini birebir kullanabilirsiniz.
            </small>
          </div>

          <div className="form-buttons">
            <button type="submit" className="save-btn river-stone-sm">
              {editingItem ? 'Ürünü Güncelle' : 'Menüye Kaydet'}
            </button>
            <button type="button" className="cancel-form-btn river-stone-sm" onClick={resetForm}>
              İptal
            </button>
          </div>
        </form>
      )}

      <div className="table-wrapper">
        <table className="data-table" id="menu-items-table">
          <thead>
            <tr>
              <th>Ürün Adı & Malzemeler</th>
              <th>Kategori</th>
              <th>Fiyat</th>
              <th>Durum</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map((item) => {
              const parsed = parseItemDescription(item.description);
              return (
                <tr key={item.id} className={!item.isAvailable ? 'row-disabled' : ''}>
                  <td>
                    <div className="item-name-cell">
                      <strong>{item.name}</strong>
                      {parsed.text && <small>{parsed.text}</small>}
                      {parsed.ingredients.length > 0 && (
                        <span className="admin-ing-list">
                          <strong>İçerik:</strong> {parsed.ingredients.join(', ')}
                        </span>
                      )}
                      {parsed.tags.length > 0 && (
                        <div className="admin-tags-list">
                          {parsed.tags.map(t => (
                            <span key={t} className="admin-tag-badge">{t}</span>
                          ))}
                        </div>
                      )}
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
                      {item.isAvailable ? 'Tükendi Yap' : 'Mevcut Yap'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
