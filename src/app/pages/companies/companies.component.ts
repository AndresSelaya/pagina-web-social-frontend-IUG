// src/app/flash-cards/flash-cards.component.ts
import { Component, Input } from '@angular/core';
import { company } from '../../posts/models/company';
import { CommonModule } from '@angular/common';

import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-companies',
  templateUrl: 'companies.component.html',
  styleUrls: ['companies.component.scss']
})
export class CompaniesComponent {
  cards: company[] = [];
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<company[]>('/assets/data-iug/companies.json').subscribe({
      next: (data) => {
        this.cards = data;
      },
      error: (err) => {
        console.error('Error loading companies:', err);
      }
    });
  }
}