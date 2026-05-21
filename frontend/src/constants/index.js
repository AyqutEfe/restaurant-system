export const API_BASE_URL = 'http://localhost:8080';

export const ENDPOINTS = {
  MENU: `${API_BASE_URL}/api/menu`,
  RESERVATIONS: `${API_BASE_URL}/api/reservations`,
  ADMIN_RESERVATIONS: `${API_BASE_URL}/admin/reservations`,
  ADMIN_MENU: `${API_BASE_URL}/admin/menu`,
};

export const CATEGORIES = {
  STARTER: 'Başlangıç',
  MAIN: 'Ana Yemek',
  DESSERT: 'Tatlı',
  DRINK: 'İçecek',
};

export const CATEGORY_ORDER = ['STARTER', 'MAIN', 'DESSERT', 'DRINK'];

export const RESERVATION_STATUS = {
  PENDING: 'Beklemede',
  CONFIRMED: 'Onaylandı',
  CANCELLED: 'İptal Edildi',
};

export const TIME_SLOTS = [];
for (let h = 12; h < 22; h++) {
  TIME_SLOTS.push(`${String(h).padStart(2, '0')}:00`);
  TIME_SLOTS.push(`${String(h).padStart(2, '0')}:30`);
}

export const TABLE_COUNT = 10;
export const MAX_PARTY_SIZE = 6;

export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
};
