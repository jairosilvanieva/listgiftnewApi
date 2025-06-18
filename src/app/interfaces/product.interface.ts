export interface DummyProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
}

export interface DummyResponse {
  products: DummyProduct[];
  total: number;
  skip: number;
  limit: number;
}

export interface SimplifiedProduct {
  name: string;
  description: string;
  permalink: string;
  thumbnail: string; // ✅ AGREGAMOS ESTO
}
