import { useState, useEffect } from 'react';
import { getMenu } from '../services/api';
import { CATEGORIES, CATEGORY_ORDER } from '../constants';
import './MenuPage.css';

export default function MenuPage() {
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await getMenu();
      setItems(res.data);
    } catch (err) {
      console.error('Menü yüklenemedi:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = activeCategory === 'ALL'
    ? items
    : items.filter((item) => item.category === activeCategory);

  if (loading) {
    return (
      <div className="menu-page">
        <div className="menu-loading">
          <div className="loader"></div>
          <p>Menü yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="menu-page" id="menu-page">
      <div className="menu-header">
        <h1 className="menu-title">Menümüz</h1>
        <p className="menu-subtitle">Şefimizin özenle hazırladığı lezzetler</p>
      </div>

      <div className="category-tabs" id="category-tabs">
        <button
          className={`category-tab ${activeCategory === 'ALL' ? 'active' : ''}`}
          onClick={() => setActiveCategory('ALL')}
        >
          Tümü
        </button>
        {CATEGORY_ORDER.map((cat) => (
          <button
            key={cat}
            className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {CATEGORIES[cat]}
          </button>
        ))}
      </div>

      <div className="menu-grid">
        {filtered.length === 0 ? (
          <div className="menu-empty">
            <p>Bu kategoride ürün bulunmamaktadır.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`menu-card ${!item.isAvailable ? 'sold-out' : ''}`}
              id={`menu-item-${item.id}`}
            >
              {item.imageUrl && (
                <div className="menu-card-image">
                  <img src={item.imageUrl} alt={item.name} />
                </div>
              )}
              <div className="menu-card-content">
                <div className="menu-card-header">
                  <h3 className="menu-card-name">{item.name}</h3>
                  <span className="menu-card-price">
                    ₺{Number(item.price).toFixed(2)}
                  </span>
                </div>
                {item.description && (
                  <p className="menu-card-desc">{item.description}</p>
                )}
                <span className="menu-card-category">
                  {CATEGORIES[item.category]}
                </span>
                {!item.isAvailable && (
                  <div className="sold-out-badge">Tükendi</div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
