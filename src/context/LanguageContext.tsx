"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export type LanguageCode = 'hi' | 'en' | 'mr' | 'gu' | 'bn' | 'ta' | 'te';

export interface TranslationStrings {
  home: string;
  shop: string;
  panchang: string;
  horoscope: string;
  poojaVidhi: string;
  pandits: string;
  consultancy: string;
  orders: string;
  account: string;
  wishlist: string;
  cart: string;
  chooseLanguage: string;
  myOrders: string;
  myBookings: string;
  savedAddresses: string;
  login: string;
  logout: string;
  searchPlaceholder: string;
  pureVedicSamagri: string;
  freeDelivery: string;
  panditHelpline: string;
}

export const translations: Record<LanguageCode, TranslationStrings> = {
  hi: {
    home: "होम",
    shop: "पूजा सामग्री",
    panchang: "पंचांग",
    horoscope: "राशिफल",
    poojaVidhi: "पूजा विधि",
    pandits: "पंडित जी",
    consultancy: "ज्योतिष परामर्श",
    orders: "ऑर्डर",
    account: "खाता",
    wishlist: "विशलिस्ट",
    cart: "कार्ट",
    chooseLanguage: "भाषा चुनें",
    myOrders: "मेरे ऑर्डर",
    myBookings: "मेरी बुकिंग",
    savedAddresses: "सहेजे गए पते",
    login: "लॉगिन करें",
    logout: "लॉगआउट",
    searchPlaceholder: "पूजा सामग्री, अगरबत्ती, दीया, हवन किट खोजें...",
    pureVedicSamagri: "100% शुद्ध एवं प्रामाणिक पूजा सामग्री",
    freeDelivery: "₹499+ के ऑर्डर पर मुफ्त डिलीवरी",
    panditHelpline: "पंडित सहायता",
  },
  en: {
    home: "Home",
    shop: "Pooja Samagri",
    panchang: "Panchang",
    horoscope: "Horoscope",
    poojaVidhi: "Pooja Vidhi",
    pandits: "Pandit Ji",
    consultancy: "Astrology",
    orders: "Orders",
    account: "Account",
    wishlist: "Wishlist",
    cart: "Cart",
    chooseLanguage: "Choose Language",
    myOrders: "My Orders",
    myBookings: "My Bookings",
    savedAddresses: "Saved Addresses",
    login: "Login",
    logout: "Logout",
    searchPlaceholder: "Search pooja samagri, incense, diya, kits...",
    pureVedicSamagri: "100% Pure & Vedic Pooja Items",
    freeDelivery: "Free delivery on orders above ₹499",
    panditHelpline: "Pandit Helpline",
  },
  mr: {
    home: "मुख्यपृष्ठ",
    shop: "पूजा साहित्य",
    panchang: "पंचांग",
    horoscope: "राशीभविष्य",
    poojaVidhi: "पूजा विधी",
    pandits: "गुरुजी",
    consultancy: "ज्योतिष सल्ला",
    orders: "ऑर्डर्स",
    account: "खाते",
    wishlist: "आवडते",
    cart: "गाडी",
    chooseLanguage: "भाषा निवडा",
    myOrders: "माझ्या ऑर्डर्स",
    myBookings: "माझे बुकिंग",
    savedAddresses: "जतन केलेले पत्ते",
    login: "लॉगिन",
    logout: "लॉगआउट",
    searchPlaceholder: "पूजा साहित्य, अगरबत्ती, दिवा शोधा...",
    pureVedicSamagri: "100% शुद्ध व वैदिक पूजा साहित्य",
    freeDelivery: "₹499+ च्या ऑर्डरवर मोफत डिलिव्हरी",
    panditHelpline: "पंडित मदत",
  },
  gu: {
    home: "હોમ",
    shop: "પૂજા સામગ્રી",
    panchang: "પંચાંગ",
    horoscope: "રાશિફળ",
    poojaVidhi: "પૂજા વિધિ",
    pandits: "પંડિત જી",
    consultancy: "જ્યોતિષ સલાહ",
    orders: "ઓર્ડર",
    account: "ખાતું",
    wishlist: "વિશલિસ્ટ",
    cart: "કાર્ટ",
    chooseLanguage: "ભાષા પસંદ કરો",
    myOrders: "મારા ઓર્ડર",
    myBookings: "મારી બુકિંગ",
    savedAddresses: "સાચવેલા સરનામાં",
    login: "લૉગિન",
    logout: "લૉગઆઉટ",
    searchPlaceholder: "પૂજા સામગ્રી, અગરબત્તી, દીવો શોધો...",
    pureVedicSamagri: "100% શુદ્ધ અને વૈદિક પૂજા સામગ્રી",
    freeDelivery: "₹499+ ના ઓર્ડર પર મફત ડિલિવરી",
    panditHelpline: "પંડિત હેલ્પલાઇન",
  },
  bn: {
    home: "হোম",
    shop: "পূজা সামগ্রী",
    panchang: "পঞ্জিকা",
    horoscope: "রাশিফল",
    poojaVidhi: "পূজা বিধি",
    pandits: "পুরোহিত মশাই",
    consultancy: "জ্যোতিষ পরামর্শ",
    orders: "অর্ডার",
    account: "অ্যাকাউন্ট",
    wishlist: "উইশলিস্ট",
    cart: "কার্ট",
    chooseLanguage: "ভাষা বেছে নিন",
    myOrders: "আমার অর্ডার",
    myBookings: "আমার বুকিং",
    savedAddresses: "সংরক্ষিত ঠিকানা",
    login: "লগইন",
    logout: "লগআউট",
    searchPlaceholder: "পূজা সামগ্রী, ধূপ, প্রদীপ খুঁজুন...",
    pureVedicSamagri: "১০০% খাঁটি ও বৈদিক সামগ্রী",
    freeDelivery: "₹৪৯৯+ অর্ডারে বিনামূল্যে ডেলিভারি",
    panditHelpline: "পুরোহিত হেল্পলাইন",
  },
  ta: {
    home: "முகப்பு",
    shop: "பூஜை பொருட்கள்",
    panchang: "பஞ்சாங்கம்",
    horoscope: "ராசி பலன்",
    poojaVidhi: "பூஜை முறை",
    pandits: "புரோகிதர்",
    consultancy: "ஜோதிட ஆலோசனை",
    orders: "ஆர்டர்கள்",
    account: "கணக்கு",
    wishlist: "விருப்பப்பட்டியல்",
    cart: "கார்ட்",
    chooseLanguage: "மொழியைத் தேர்ந்தெடுக்கவும்",
    myOrders: "எனது ஆர்டர்கள்",
    myBookings: "எனது முன்பதிவுகள்",
    savedAddresses: "சேமிக்கப்பட்ட முகவரிகள்",
    login: "உள்நுழைக",
    logout: "வெளியேறு",
    searchPlaceholder: "பூஜை பொருட்கள், தீபம், அகர்பத்தி தேடுங்கள்...",
    pureVedicSamagri: "100% தூய மற்றும் வேத முறை பொருட்கள்",
    freeDelivery: "₹499+ இலவச டெலிவரி",
    panditHelpline: "புரோகிதர் உதவி",
  },
  te: {
    home: "హోమ్",
    shop: "పూజా సామాగ్రి",
    panchang: "పంచాంగం",
    horoscope: "రాశి ఫలాలు",
    poojaVidhi: "పూజా విధానం",
    pandits: "పంతులు గారు",
    consultancy: "జ్యోతిష్య సలహా",
    orders: "ఆర్డర్లు",
    account: "ఖాతా",
    wishlist: "విష్‌లిస్ట్",
    cart: "కార్ట్",
    chooseLanguage: "భాషను ఎంచుకోండి",
    myOrders: "నా ఆర్డర్లు",
    myBookings: "నా బుకింగ్స్",
    savedAddresses: "సేవ్ చేసిన చిరునామాలు",
    login: "లాగిన్",
    logout: "లాగ్అవుట్",
    searchPlaceholder: "పూజా సామాగ్రి, అగర్‌బత్తీలు, దీపాలు వెతకండి...",
    pureVedicSamagri: "100% స్వచ్ఛమైన వైదిక పూజా సామాగ్రి",
    freeDelivery: "₹499+ పై ఉచిత డెలివరీ",
    panditHelpline: "పంతులు హెల్ప్‌లైన్",
  },
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: TranslationStrings;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>('hi');

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('hgmer_user_lang') as LanguageCode;
      if (savedLang && translations[savedLang]) {
        setLanguageState(savedLang);
      }
    } catch (e) {
      console.warn("Could not load language from localStorage", e);
    }
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('hgmer_user_lang', lang);
    } catch (e) {
      console.warn("Could not save language to localStorage", e);
    }
  };

  const t = translations[language] || translations['hi'];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
