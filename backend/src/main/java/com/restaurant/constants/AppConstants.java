package com.restaurant.constants;

public final class AppConstants {

    private AppConstants() {}

    // Table constraints
    public static final int MIN_TABLE_NUMBER = 1;
    public static final int MAX_TABLE_NUMBER = 10;
    public static final int MAX_PARTY_SIZE = 6;

    // Reservation time constraints
    public static final int OPENING_HOUR = 12;
    public static final int CLOSING_HOUR = 22;
    public static final int TIME_SLOT_MINUTES = 30;

    // Messages
    public static final String RESERVATION_CONFLICT_MSG = "Bu tarih, saat ve masa için zaten bir rezervasyon mevcut";
    public static final String RESERVATION_NOT_FOUND_MSG = "Rezervasyon bulunamadı: ";
    public static final String MENU_ITEM_NOT_FOUND_MSG = "Menü öğesi bulunamadı: ";
    public static final String INVALID_TIME_MSG = "Rezervasyon saati 12:00-22:00 arasında olmalıdır";
    public static final String INVALID_PARTY_SIZE_MSG = "Kişi sayısı 1-6 arasında olmalıdır";
}
