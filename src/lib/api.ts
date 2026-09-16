import axios from 'axios';

// Base API URL configuration - points directly to backend API
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use(
  async (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('hgmer_token') || localStorage.getItem('admin_token') || localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Types matching Backend Prisma Schema
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  mrp?: number | null;
  rating?: number;
  reviewCount?: number;
  stock?: number;
  type?: 'STANDARD' | 'BUNDLE';
  weight?: number | null;
  unit?: string | null;
  imageUrl?: string | null;
  status?: string;
  categoryId?: number;
  category?: {
    id: number;
    name: string;
  };
  images?: { id: number; url: string; order: number }[];
  bundleComponents?: {
    id: number;
    quantity: number;
    component: {
      id: number;
      name: string;
      price: number;
      imageUrl?: string | null;
    };
  }[];
}

export interface Category {
  id: number;
  name: string;
  description?: string | null;
  iconUrl?: string | null;
  isFestival?: boolean;
  parentId?: number | null;
  children?: Category[];
}

export interface Banner {
  id: number;
  title: string;
  subtitle?: string | null;
  imageUrl: string;
  actionUrl?: string | null;
  isActive: boolean;
  isCampaign?: boolean;
  products?: Product[];
}

export interface Festival {
  id: number;
  name: string;
  date: string;
  linkText: string;
  imageUrl: string;
  isActive: boolean;
}

export interface PoojaVidhiItem {
  id: number;
  quantity: number;
  product: Product;
}

export interface PoojaVidhi {
  id: number;
  title: string;
  procedure: string;
  imageUrl?: string | null;
  items?: PoojaVidhiItem[];
}

export interface PanditProfile {
  id: number;
  bio?: string | null;
  experience: number;
  city: string;
  photoUrl?: string | null;
  rating: number;
  price: number;
  languages?: string | null;
  specializations?: string | null;
  user?: {
    id: number;
    name: string;
    phone?: string;
    email?: string;
  };
}

export interface PanchangData {
  id: number;
  date: string;
  tithi: string | null;
  nakshatra: string | null;
  sunrise: string | null;
  sunset: string | null;
  details: string | null;
}

export interface HoroscopeData {
  id: number;
  sign: string;
  prediction: string;
  date: string;
}

export interface ConsultancyService {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl?: string | null;
}

// Direct Backend API Services
export const fetchBanners = async (): Promise<Banner[]> => {
  const res = await api.get('/banners');
  return Array.isArray(res.data) ? res.data : [];
};

export const fetchCategories = async (parentId?: number | null): Promise<Category[]> => {
  const url = parentId !== undefined ? `/products/categories?parentId=${parentId}` : '/products/categories';
  const res = await api.get(url);
  return Array.isArray(res.data) ? res.data : [];
};

export const fetchProducts = async (params?: {
  categoryId?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}): Promise<Product[]> => {
  const res = await api.get('/products', { params });
  return Array.isArray(res.data) ? res.data : [];
};

export const fetchProductById = async (id: number): Promise<Product> => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};

export const fetchFestivals = async (): Promise<Festival[]> => {
  const res = await api.get('/festivals');
  return Array.isArray(res.data) ? res.data : [];
};

export const fetchPandits = async (city?: string): Promise<PanditProfile[]> => {
  const url = city ? `/pandits/approved?city=${encodeURIComponent(city)}` : '/pandits/approved';
  const res = await api.get(url);
  return Array.isArray(res.data) ? res.data : [];
};

export const fetchPanditById = async (id: number): Promise<PanditProfile> => {
  const res = await api.get(`/pandits/profile/${id}`);
  return res.data;
};

export const fetchPoojaVidhis = async (): Promise<PoojaVidhi[]> => {
  const res = await api.get('/pooja-vidhis');
  return Array.isArray(res.data) ? res.data : [];
};

export const fetchPoojaVidhiById = async (id: number): Promise<PoojaVidhi> => {
  const res = await api.get(`/pooja-vidhis/${id}`);
  return res.data;
};

export const fetchPanchangs = async (date?: string): Promise<PanchangData[]> => {
  const res = await api.get('/panchangs');
  return Array.isArray(res.data) ? res.data : [];
};

export const fetchHoroscopes = async (): Promise<HoroscopeData[]> => {
  const res = await api.get('/horoscopes');
  return Array.isArray(res.data) ? res.data : [];
};

export const fetchConsultancyServices = async (): Promise<ConsultancyService[]> => {
  const res = await api.get('/consultancy-services');
  return Array.isArray(res.data) ? res.data : [];
};

export const createOrderApi = async (orderData: any) => {
  const res = await api.post('/orders', orderData);
  return res.data;
};

export const fetchOrdersApi = async () => {
  const res = await api.get('/orders');
  return Array.isArray(res.data) ? res.data : [];
};

export const loginUserApi = async (credentials: { email: string; password: string }) => {
  const res = await api.post('/auth/login', credentials);
  return res.data;
};

export const registerUserApi = async (userData: { name: string; email: string; password: string; phone?: string }) => {
  const res = await api.post('/auth/register', userData);
  return res.data;
};

export const googleLoginApi = async (token: string) => {
  const res = await api.post('/auth/google', { token });
  return res.data;
};

export const parseJwtToken = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export default api;
