import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AmbientProvider } from './context/AmbientContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CorporatePage from './pages/CorporatePage';
import MenuPage from './pages/MenuPage';
import ReservationPage from './pages/ReservationPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <AmbientProvider>
      <BrowserRouter>
        <Navbar />
        <main style={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<CorporatePage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/reservation" element={<ReservationPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </AmbientProvider>
  );
}

export default App;
