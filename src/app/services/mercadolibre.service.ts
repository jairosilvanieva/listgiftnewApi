import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { DummyResponse, DummyProduct, SimplifiedProduct } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root',
})
export class MercadoLibreService {
  private apiUrl = 'https://dummyjson.com/products/search?q=';

  constructor(private http: HttpClient) {}

 searchProducts(query: string, limit: number = 30, offset: number = 0): Observable<SimplifiedProduct[]> {
  return this.http.get<DummyResponse>(`${this.apiUrl}${query}&limit=${limit}&skip=${offset}`).pipe(
    map((response: DummyResponse) => {
      return response.products.map((product: DummyProduct) => ({
        name: product.title,
        description: `Producto ficticio - Precio: ${product.price}`,
        permalink: `https://dummyjson.com/products/${product.id}`,
        thumbnail: product.thumbnail
      }));
    })
  );
}
}
