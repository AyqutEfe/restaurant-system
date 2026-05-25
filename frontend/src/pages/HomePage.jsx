import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMenu } from '../services/api';
import { useAmbient, AMBIENT_THEMES } from '../context/AmbientContext';
import './HomePage.css';

// Helper to parse description field
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
    return { text: desc, ingredients: [], allergens: [], tags: [] };
  }
};

export default function HomePage() {
  const { theme } = useAmbient();
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedMenu();
  }, []);

  const fetchFeaturedMenu = async () => {
    try {
      const res = await getMenu();
      // Enrich items
      const enriched = res.data.map(item => ({
        ...item,
        ...parseItemDescription(item.description)
      }));
      // Filter for items containing "Şefin Seçimi" or "Special" tags, or grab first 3
      let filtered = enriched.filter(item =>
        item.isAvailable &&
        (item.tags.includes('Şefin Seçimi') || item.tags.includes('Gölet Special') || item.tags.includes('Special'))
      );
      if (filtered.length === 0) {
        filtered = enriched.filter(item => item.isAvailable).slice(0, 3);
      } else {
        filtered = filtered.slice(0, 3);
      }
      setFeaturedItems(filtered);
    } catch (err) {
      console.error('Öne çıkan menü yüklenemedi:', err);
    } finally {
      setLoading(false);
    }
  };

  const getAmbientIntro = () => {
    switch (theme) {
      case AMBIENT_THEMES.SUNRISE:
        return 'Gölün üzerinde yükselen ilk ışıklar eşliğinde taptaze bir güne merhaba deyin.';
      case AMBIENT_THEMES.SUNSET:
        return 'Gökyüzünün kızıla boyandığı o sihirli saatlerde, gölün dinginliğini hissedin.';
      case AMBIENT_THEMES.NIGHT:
        return 'Yıldızların göl yüzeyindeki ışıltılı dansı ve mum ışığının huzuru eşliğinde akşam yemeği.';
      case AMBIENT_THEMES.NOON:
      default:
        return 'Gölün ferahlatıcı esintisi ve berrak yeşiliyle günün en lezzetli anlarını yaşayın.';
    }
  };

  return (
    <div className="home-page" id="home-page">
      {/* Large Hero Section (Deniz Lounge Style) */}
      <header className="hero-section">
        {/* Soft atmospheric gradient */}
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <span className="hero-badge">Göl Evi Gastronomisi</span>
          <h1 className="hero-title">gölet restaurant  </h1>
          <p className="hero-subtitle">{getAmbientIntro()}</p>
          <p className="hero-motto">
            "Eşsiz göl manzarası eşliğinde, eğlence, kalite ve lezzetin buluşma noktası."
          </p>
          <p className="hero-desc">
            Keşan'ın kalbinde, gölet kıyısında eğlence, üstün kalite ve eşsiz lezzetlerin bir araya geldiği unutulmaz bir gastronomi deneyimine davetlisiniz.
          </p>
          <div className="hero-actions">
            <Link to="/menu" className="btn-primary river-stone-sm">
              Menümüzü Keşfedin
            </Link>
            <Link to="/reservation" className="btn-secondary river-stone-sm">
              Rezervasyon Yapın
            </Link>
          </div>
        </div>

        {/* Animated Water Waves */}
        <div className="wave-wrapper">
          <svg className="waves" xmlns="http://www.w3.org/2000/svg" viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
            <defs>
              <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18v44h-352z" />
            </defs>
            <g className="parallax">
              <use href="#gentle-wave" x="48" y="0" fill="rgba(45,90,107,0.05)" />
              <use href="#gentle-wave" x="48" y="3" fill="rgba(27,59,50,0.03)" />
              <use href="#gentle-wave" x="48" y="5" fill="rgba(45,90,107,0.02)" />
              <use href="#gentle-wave" x="48" y="7" fill="var(--bg-primary)" />
            </g>
          </svg>
        </div>
      </header>

      {/* Featured Menu Items (Şefin Seçtikleri) */}
      <section className="featured-section">
        <div className="section-header">
          <span className="section-badge">Seçkin Lezzetler</span>
          <h2 className="section-title">Öne Çıkan Tatlar</h2>
          <p className="section-subtitle">Şefimizin en kaliteli malzemelerle hazırladığı, lezzet dolu imza spesiyalleri</p>
        </div>

        {loading ? (
          <div className="featured-loading">
            <div className="loader"></div>
            <p>Lezzetler hazırlanıyor...</p>
          </div>
        ) : (
          <div className="featured-grid">
            {featuredItems.map((item) => (
              <div key={item.id} className="featured-card glass-panel river-stone-md">
                {item.imageUrl && (
                  <div className="featured-card-image">
                    <img src={item.imageUrl} alt={item.name} />
                  </div>
                )}
                <div className="featured-card-content">
                  <div className="featured-card-header">
                    <h3>{item.name}</h3>
                    <span className="featured-price">₺{Number(item.price).toFixed(2)}</span>
                  </div>
                  {item.text && <p className="featured-desc-text">{item.text}</p>}
                  {item.ingredients.length > 0 && (
                    <div className="featured-ing">
                      <strong>İçerik:</strong> {item.ingredients.slice(0, 4).join(', ')}...
                    </div>
                  )}
                  <Link to="/menu" className="featured-link">Detayları Gör →</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Philosophy Section */}
      <section className="philosophy-section">
        <div className="section-header">
          <span className="section-badge">Ayrıcalıklarımız</span>
          <h2 className="section-title">Eğlence, Kalite & Lezzet</h2>
          <p className="section-subtitle">Misafirlerimize sunduğumuz ayrıcalıklı deneyim</p>
        </div>

        <div className="features-grid">
          <div className="feature-card glass-panel river-stone-md">
            <div className="feature-icon">✨</div>
            <h3>Seçkin Kalite</h3>
            <p>Mutfak ekibimizin özenle seçtiği birinci sınıf malzemelerle, hijyen ve kalite standartlarından ödün vermeden hazırlanan tabaklar sunuyoruz.</p>
          </div>
          <div className="feature-card glass-panel river-stone-md">
            <div className="feature-icon">🔥</div>
            <h3>Eğlence & Etkinlik</h3>
            <p>Göl kıyısındaki büyüleyici atmosferimizde, akşamları canlı müzik, özel etkinlikler ve unutulmaz anlar sizi bekliyor.</p>
          </div>
          <div className="feature-card glass-panel river-stone-md">
            <div className="feature-icon">🍽️</div>
            <h3>Benzersiz Lezzetler</h3>
            <p>Ödüllü şeflerimizin elinden çıkan, damak hafızanızda yer edinecek gurme lezzetlerle akşamınızı taçlandırın.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
