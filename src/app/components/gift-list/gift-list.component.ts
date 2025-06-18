import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GiftsService } from '../../services/gifts.service';
import { MercadoLibreService } from '../../services/mercadolibre.service';
import { Gift } from '../../interfaces/gift.interface';
import { SimplifiedProduct } from '../../interfaces/product.interface';

@Component({
  selector: 'app-gift-list',
  templateUrl: './gift-list.component.html',
  styleUrls: ['./gift-list.component.css']
})
export class GiftListComponent implements OnInit {
  eventId!: string;
  gifts: Gift[] = [];
  searchQuery = '';
  allResults: SimplifiedProduct[] = [];
  visibleResults: SimplifiedProduct[] = [];
  loading = false;

  currentPage = 1;
  itemsPerPage = 5;

  constructor(
    private route: ActivatedRoute,
    private giftsService: GiftsService,
    private mercadoLibreService: MercadoLibreService
  ) {}

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('eventId')!;
    this.loadGifts();
  }

  loadGifts(): void {
    this.giftsService.getGiftsByEvent(this.eventId).subscribe((gifts) => {
      this.gifts = gifts;
    });
  }

  search(): void {
    if (!this.searchQuery.trim()) return;

    this.loading = true;
    this.currentPage = 1;

    this.mercadoLibreService.searchProducts(this.searchQuery, 30, 0).subscribe({
      next: (products) => {
        this.allResults = products;
        this.updateVisibleResults();
        this.loading = false;
      },
      error: () => {
        this.allResults = [];
        this.visibleResults = [];
        this.loading = false;
      }
    });
  }

  updateVisibleResults(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.visibleResults = this.allResults.slice(start, end);
  }

  nextPage(): void {
    if (this.currentPage * this.itemsPerPage < this.allResults.length) {
      this.currentPage++;
      this.updateVisibleResults();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateVisibleResults();
    }
  }

  addGift(product: SimplifiedProduct): void {
    const newGift: Gift = {
      id: crypto.randomUUID(),
      name: product.name,
      description: product.description,
      permalink: product.permalink,
      isSelected: false,
      eventId: this.eventId
    };

    this.giftsService.addGift(newGift).subscribe(() => {
      this.loadGifts();
      this.searchQuery = '';
      this.allResults = [];
      this.visibleResults = [];
    });
  }
}
