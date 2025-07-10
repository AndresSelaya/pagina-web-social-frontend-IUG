import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Title } from '../../../interfaces/title';

@Injectable({ providedIn: 'root' })
export class TitleStateService {
  private readonly editTitleSource = new BehaviorSubject<Title | null>(null);
  currentTitle$ = this.editTitleSource.asObservable();

  setTitleToEdit(title: Title | null): void {
    this.editTitleSource.next(title);
  }

  clearTitle() {
    this.editTitleSource.next(null);
  }
}