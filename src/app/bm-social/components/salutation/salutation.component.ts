import { Component } from '@angular/core';
import { SalutationStateService } from './utils/salutation-state.service';

@Component({
  selector: 'app-salutation',
  templateUrl: './salutation.component.html',
  styleUrl: './salutation.component.scss'
})
export class SalutationComponent {
  constructor(private readonly salutationStateService: SalutationStateService) { }

  ngOnInit(): void {
    // Limpiar cualquier salutation en edición al entrar al componente
    this.salutationStateService.clearCurrentSalutation();
  }
}
