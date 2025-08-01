import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from './product.service';
import { ParticipantsService, Participant } from './participants.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  error: string | null = null;

  showParticipantsModal = false;
  selectedProduct: Product | null = null;
  participants: Participant[] = [];
  participantsLoading = false;
  participantsError: string | null = null;

  constructor(
    private productService: ProductService,
    private participantsService: ParticipantsService
  ) {}

  ngOnInit(): void {
    this.productService.getProductsByType(1582).subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los eventos';
        this.loading = false;
      }
    });
  }

  openParticipantsModal(product: Product) {
    console.log('Abriendo modal para producto:', product);
    this.selectedProduct = product;
    this.showParticipantsModal = true;
    this.participants = [];
    this.participantsLoading = true;
    this.participantsError = null;
    this.participantsService.getParticipantsByProduct(product.productId).subscribe({
      next: (data) => {
        this.participants = data;
        this.participantsLoading = false;
        console.log('Participantes cargados:', data);
      },
      error: (err) => {
        this.participantsError = 'Error al cargar los participantes';
        this.participantsLoading = false;
        console.error('Error al cargar participantes:', err);
      }
    });
  }

  closeParticipantsModal() {
    console.log('Cerrando modal');
    this.showParticipantsModal = false;
    this.selectedProduct = null;
    this.participants = [];
    this.participantsError = null;
    this.participantsLoading = false;
  }
}
