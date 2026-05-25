import './CorporatePage.css';

export default function CorporatePage() {
  return (
    <div className="corporate-page" id="corporate-page">
      {/* Hero Section */}
      <section className="corp-hero">
        <div className="corp-hero-content">
          <span className="corp-badge">Biz Kimiz?</span>
          <h1 className="corp-title">Lezzet ve Eğlence Felsefemiz</h1>
          <p className="corp-subtitle">"Keşan Göleti kıyısında eğlence, kalite ve lezzet bir arada."</p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="philosophy-detail">
        <div className="corp-container">
          <div className="philosophy-grid">
            <div className="philosophy-text">
              <h2>Kalite ve Lezzet Anlayışımız</h2>
              <p>
                gölet restaurant, Keşan Göleti kıyısında yer alan, sadece göl manzarası sunan bir restoran değil; aynı zamanda eğlence, üstün hizmet kalitesi ve unutulmaz lezzetlerin bir arada harmanlandığı seçkin bir buluşma noktasıdır. En büyük misyonumuz, misafirlerimize en taze malzemelerle hazırlanmış eşsiz lezzetleri sunarken, eğlence dolu ve kaliteli bir atmosfer yaşatmaktır.
              </p>
              <p>
                Yemeklerimizde kullandığımız malzemeleri özenle seçiyoruz. Keşan'ın ve Trakya'nın en verimli topraklarından ve yerel üreticilerinden tedarik ettiğimiz taze malzemeler ve birinci sınıf etler, uzman şeflerimizin elinde sanata dönüşerek masanıza geliyor. Her tabakta yüksek kalite standartlarını ve enfes lezzeti hissedeceksiniz.
              </p>
            </div>
            <div className="philosophy-image-box glass-panel river-stone-lg">
              <div className="corp-image-placeholder">✨🍽️</div>
              <div className="image-overlay-text">Kalite & Eğlence</div>
            </div>
          </div>
        </div>
      </section>

      {/* Three Pillars (Quality, Taste, Entertainment) */}
      <section className="corp-pillars">
        <div className="corp-container">
          <div className="section-header">
            <span className="section-badge">Değerlerimiz</span>
            <h2 className="section-title">Değerlerimizin Üç Temel Taşı</h2>
          </div>

          <div className="pillars-grid">
            <div className="pillar-card glass-panel river-stone-md">
              <div className="pillar-icon">✨</div>
              <h3>Kusursuz Kalite</h3>
              <p>
                Servisten mutfağa kadar her alanda en yüksek kalite standartlarını uyguluyoruz. Seçkin malzemeler ve titiz çalışma prensibimizle misafirlerimize mükemmeliyeti sunuyoruz.
              </p>
            </div>
            <div className="pillar-card glass-panel river-stone-md">
              <div className="pillar-icon">🍽️</div>
              <h3>Eşsiz Lezzet Deneyimi</h3>
              <p>
                Şeflerimizin özel reçeteleriyle hazırlanan ve her damak zevkine hitap eden gurme lezzetlerimizle, gastronomi tutkunlarına unutulmaz bir lezzet şöleni sunuyoruz.
              </p>
            </div>
            <div className="pillar-card glass-panel river-stone-md">
              <div className="pillar-icon">🎉</div>
              <h3>Eğlenceli Atmosfer</h3>
              <p>
                Hafta sonu canlı müzik etkinliklerimiz, konsept gecelerimiz ve büyüleyici göl kenarı ambiyansımız ile keyifli ve eğlence dolu anlar biriktirmenizi sağlıyoruz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story / Vision Mission */}
      <section className="vision-mission-section">
        <div className="corp-container">
          <div className="vision-mission-grid">
            <div className="vm-card glass-panel river-stone-md">
              <h2>Vizyonumuz</h2>
              <p>
                Keşan'da lezzet ve eğlence denildiğinde akla ilk gelen, sunduğu üstün kalite ve eşsiz göl manzarasıyla Trakya bölgesinin en prestijli ve tercih edilen restoran markası olmak.
              </p>
            </div>
            <div className="vm-card glass-panel river-stone-md">
              <h2>Misyonumuz</h2>
              <p>
                Misafirlerimize, yüksek hizmet standartlarımız, seçkin lezzetlerimiz ve canlı atmosferimizle hem gurme bir ziyafet sunmak hem de sosyal yaşamlarına eğlence ve kalite katmak.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
