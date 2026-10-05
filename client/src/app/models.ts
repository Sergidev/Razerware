export interface Category {
  id: number;
  name: string;
  slug: string;
  product_count: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  brand: string;
  price: string;
  stock: number;
  image: string;
  featured: boolean;
  category: string;
  category_name: string;
}

export interface ProductDetail extends Product {
  description: string;
  specs: Record<string, string | number>;
}

export interface Page<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface AdvisorProduct extends Product {
  reason: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  products?: AdvisorProduct[];
}