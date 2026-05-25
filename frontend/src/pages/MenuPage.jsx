import { useState, useEffect } from 'react';
import { getMenu } from '../services/api';
import { CATEGORIES, CATEGORY_ORDER } from '../constants';
import './MenuPage.css';

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
    return {
      text: desc,
      ingredients: [],
      allergens: [],
      tags: []
    };
  }
};

export default function MenuPage() {
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Interactive Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [dietaryFilters, setDietaryFilters] = useState({
    vegan: false,
    vegetarian: false,
    glutenFree: false,
  });
  const [selectedAllergenExclude, setSelectedAllergenExclude] = useState('');

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

  // Process items (parse descriptions)
  const processedItems = items.map((item) => {
    const parsed = parseItemDescription(item.description);
    return {
      ...item,
      descText: parsed.text,
      ingredients: parsed.ingredients,
      allergens: parsed.allergens,
      tags: parsed.tags,
    };
  });

  const allAllergens = Array.from(
    new Set(processedItems.flatMap((item) => item.allergens))
  ).filter(Boolean);

  // 1. Filtering logic
  const filteredItems = processedItems.filter((item) => {
    // Main Category Filter
    if (activeCategory !== 'ALL' && item.category !== activeCategory) {
      return false;
    }

    // Search Query Filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.descText.toLowerCase().includes(q);
      const matchIngredients = item.ingredients.some((ing) => ing.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchIngredients) {
        return false;
      }
    }

    // Dietary Filters
    const lowerTags = item.tags.map((t) => t.toLowerCase());
    if (dietaryFilters.vegan) {
      if (!lowerTags.includes('vegan')) return false;
    }
    if (dietaryFilters.vegetarian) {
      if (!lowerTags.includes('vejetaryen') && !lowerTags.includes('vegan')) return false;
    }
    if (dietaryFilters.glutenFree) {
      if (!lowerTags.includes('glutensiz') && !lowerTags.includes('gluten-free')) return false;
    }

    // Allergen Exclusion Filter
    if (selectedAllergenExclude !== '') {
      if (item.allergens.includes(selectedAllergenExclude)) {
        return false;
      }
    }

    return true;
  });

  // 2. Dynamic Grouping of Filtered Items
  const groupFilteredItems = (list) => {
    // Starter subdivision
    const breakfast = list.filter(
      (i) => i.category === 'STARTER' && (i.tags.includes('Kahvaltı') || i.tags.includes('Kahvaltı Mutluluğu'))
    );
    const otherStarters = list.filter(
      (i) => i.category === 'STARTER' && !(i.tags.includes('Kahvaltı') || i.tags.includes('Kahvaltı Mutluluğu'))
    );

    // Main subdivision
    const specials = list.filter(
      (i) => i.category === 'MAIN' && (i.tags.includes('Gölet Special') || i.tags.includes('Special') || i.tags.includes('Spesiyal'))
    );
    const otherMains = list.filter(
      (i) => i.category === 'MAIN' && !(i.tags.includes('Gölet Special') || i.tags.includes('Special') || i.tags.includes('Spesiyal'))
    );

    // Dessert
    const desserts = list.filter((i) => i.category === 'DESSERT');

    // Drinks subdivision
    const hotDrinks = list.filter(
      (i) => i.category === 'DRINK' && (i.tags.includes('Sıcak') || i.tags.includes('Sıcak İçecekler'))
    );
    const coldDrinks = list.filter(
      (i) => i.category === 'DRINK' && (i.tags.includes('Soğuk') || i.tags.includes('Soğuk İçecekler'))
    );
    const alcoholicDrinks = list.filter(
      (i) => i.category === 'DRINK' && (i.tags.includes('Alkollü') || i.tags.includes('Kokteyl') || i.tags.includes('Alkol') || i.tags.includes('Alkollü İçecekler'))
    );
    const otherDrinks = list.filter(
      (i) =>
        i.category === 'DRINK' &&
        !(
          i.tags.includes('Sıcak') || i.tags.includes('Sıcak İçecekler') ||
          i.tags.includes('Soğuk') || i.tags.includes('Soğuk İçecekler') ||
          i.tags.includes('Alkollü') || i.tags.includes('Kokteyl') || i.tags.includes('Alkol') || i.tags.includes('Alkollü İçecekler')
        )
    );

    return {
      breakfast,
      otherStarters,
      specials,
      otherMains,
      desserts,
      hotDrinks,
      coldDrinks,
      alcoholicDrinks,
      otherDrinks,
    };
  };

  const groups = groupFilteredItems(filteredItems);

  // Helper to check if all groups are empty
  const isMenuEmpty = Object.values(groups).every((arr) => arr.length === 0);

  const renderSection = (title, itemsList, icon) => {
    if (itemsList.length === 0) return null;
    return (
      <div className="menu-section" key={title}>
        <div className="menu-section-header">
          <span className="section-icon">{icon}</span>
          <h2 className="menu-section-title">{title}</h2>
          <span className="section-line"></span>
        </div>
        <div className="menu-grid">
          {itemsList.map((item) => (
            <div
              key={item.id}
              className={`menu-card glass-panel river-stone-md ${!item.isAvailable ? 'sold-out' : ''}`}
              id={`menu-item-${item.id}`}
            >
              {item.imageUrl ? (
                <div className="menu-card-image">
                  <img src={item.imageUrl} alt={item.name} loading="lazy" />
                  <div className="image-badges">
                    {item.tags.includes('Vegan') && <span className="img-badge badge-vegan" title="Vegan">🌱</span>}
                    {item.tags.includes('Vejetaryen') && !item.tags.includes('Vegan') && (
                      <span className="img-badge badge-veg" title="Vejetaryen">🥦</span>
                    )}
                    {item.tags.includes('Glutensiz') && <span className="img-badge badge-gf" title="Glutensiz">🌾</span>}
                  </div>
                </div>
              ) : (
                <div className="menu-card-no-image">
                  <span>gölet restaurant  </span>
                </div>
              )}

              <div className="menu-card-content">
                <div className="menu-card-header">
                  <h3 className="menu-card-name">{item.name}</h3>
                  <span className="menu-card-price">
                    ₺{Number(item.price).toFixed(2)}
                  </span>
                </div>

                {item.descText && (
                  <p className="menu-card-desc">{item.descText}</p>
                )}

                {item.ingredients && item.ingredients.length > 0 && (
                  <div className="menu-card-ingredients">
                    <strong>Malzemeler:</strong> {item.ingredients.join(', ')}
                  </div>
                )}

                {item.allergens && item.allergens.length > 0 && (
                  <div className="menu-card-allergens">
                    <span className="warning-icon">⚠️</span>
                    <span className="allergen-list">
                      <strong>Alerjen Uyarısı:</strong> {item.allergens.join(', ')}
                    </span>
                  </div>
                )}

                <div className="menu-card-footer">
                  <span className="menu-card-category-badge river-stone-sm">
                    {CATEGORIES[item.category]}
                  </span>

                  {item.tags && item.tags.filter(t => !['vegan', 'vejetaryen', 'glutensiz', 'Glutensiz', 'Vejetaryen', 'Vegan', 'Sıcak', 'Sıcak İçecekler', 'Soğuk', 'Soğuk İçecekler', 'Alkollü', 'Alkollü İçecekler', 'Kokteyl', 'Alkol'].includes(t)).map((tag) => (
                    <span key={tag} className="menu-card-tag river-stone-sm">
                      {tag}
                    </span>
                  ))}
                </div>

                {!item.isAvailable && (
                  <div className="sold-out-badge river-stone-sm">Tükendi</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="menu-page">
        <div className="menu-loading">
          <div className="loader"></div>
          <p>Lezzetlerimiz yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="menu-page" id="menu-page">
      <div className="menu-header">
        <span className="menu-header-badge">QR Menü Kataloğu</span>
        <h1 className="menu-title">gölet restaurant   Menü</h1>
        <p className="menu-subtitle">Mevsimsel ve taze malzemelerle hazırladığımız, zengin içecek ve spesiyallerimizi içeren menümüz</p>
      </div>

      {/* Categories Tabs */}
      <div className="category-tabs" id="category-tabs">
        <button
          className={`category-tab ${activeCategory === 'ALL' ? 'active' : ''}`}
          onClick={() => setActiveCategory('ALL')}
        >
          Tüm Menü
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

      {/* Filter and Search Panel */}
      <div className="filters-panel glass-panel river-stone-md">
        <div className="filters-row-top">
          <div className="filter-group search-group">
            <label htmlFor="menu-search">Arayın</label>
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                id="menu-search"
                type="text"
                placeholder="Yemek, içecek veya malzeme arayın..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="clear-search-btn" onClick={() => setSearchQuery('')}>✕</button>
              )}
            </div>
          </div>

          {allAllergens.length > 0 && (
            <div className="filter-group allergen-group">
              <label htmlFor="allergen-exclude">Alerjen Filtresi (Gizle)</label>
              <select
                id="allergen-exclude"
                value={selectedAllergenExclude}
                onChange={(e) => setSelectedAllergenExclude(e.target.value)}
              >
                <option value="">Alerjen seçin (tümü gösterilsin)</option>
                {allAllergens.map((allergen) => (
                  <option key={allergen} value={allergen}>
                    {allergen} İçermeyenler
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="filters-row-middle">
          <span className="filter-label">Beslenme Tercihi:</span>
          <div className="dietary-checkboxes">
            <label className={`dietary-checkbox-label ${dietaryFilters.vegetarian ? 'checked' : ''}`}>
              <input
                type="checkbox"
                checked={dietaryFilters.vegetarian}
                onChange={(e) => setDietaryFilters({ ...dietaryFilters, vegetarian: e.target.checked })}
              />
              <span>🥦 Vejetaryen</span>
            </label>
            <label className={`dietary-checkbox-label ${dietaryFilters.vegan ? 'checked' : ''}`}>
              <input
                type="checkbox"
                checked={dietaryFilters.vegan}
                onChange={(e) => setDietaryFilters({ ...dietaryFilters, vegan: e.target.checked })}
              />
              <span>🌱 Vegan</span>
            </label>
            <label className={`dietary-checkbox-label ${dietaryFilters.glutenFree ? 'checked' : ''}`}>
              <input
                type="checkbox"
                checked={dietaryFilters.glutenFree}
                onChange={(e) => setDietaryFilters({ ...dietaryFilters, glutenFree: e.target.checked })}
              />
              <span>🌾 Glutensiz</span>
            </label>
          </div>
        </div>
      </div>

      {/* Render Menu Sections */}
      {isMenuEmpty ? (
        <div className="menu-empty glass-panel river-stone-md">
          <div className="empty-icon">🍽️</div>
          <p>Seçilen filtrelerle eşleşen bir menü ürünü bulunamadı.</p>
          <button
            className="reset-filters-btn river-stone-sm"
            onClick={() => {
              setSearchQuery('');
              setSelectedAllergenExclude('');
              setDietaryFilters({ vegan: false, vegetarian: false, glutenFree: false });
            }}
          >
            Filtreleri Sıfırla
          </button>
        </div>
      ) : (
        <div className="menu-sections-wrapper">
          {/* Starters */}
          {renderSection('Kahvaltı Mutluluğu', groups.breakfast, '🍳')}
          {renderSection('Başlangıçlar & Mezeler', groups.otherStarters, '🥗')}

          {/* Mains */}
          {renderSection('Gölet Specials', groups.specials, '✨')}
          {renderSection('Ana Yemekler', groups.otherMains, '🥩')}

          {/* Desserts */}
          {renderSection('Tatlı Kaçamakları', groups.desserts, '🍰')}

          {/* Drinks */}
          {renderSection('Sıcak İçecekler', groups.hotDrinks, '☕')}
          {renderSection('Soğuk İçecekler', groups.coldDrinks, '🍹')}
          {renderSection('Alkollü İçecekler & Kokteyller', groups.alcoholicDrinks, '🍷')}
          {renderSection('Diğer İçecekler', groups.otherDrinks, '🥤')}
        </div>
      )}
    </div>
  );
}
