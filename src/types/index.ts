export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  sizes: string[];
  colors: string[];
  rating: number;
  reviews: number;
  badge?: string;
  isNew?: boolean;
  isBestseller?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}

export interface Testimonial {
  id: string;
  name: string;
  city: string;
  state: string;
  rating: number;
  text: string;
  avatar?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export type Category = 'all' | 'camisetas' | 'bone' | 'moletom' | 'polo' | 'infantil' | 'acessorios';
export type Size = 'P' | 'M' | 'G' | 'GG' | 'XG';
export type Color = 'preto' | 'branco' | 'verde' | 'azul' | 'cinza' | 'amarelo';
export type SortOption = 'bestsellers' | 'price-asc' | 'price-desc' | 'newest';
