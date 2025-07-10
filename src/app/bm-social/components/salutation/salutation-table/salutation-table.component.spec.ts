import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalutationTableComponent } from './salutation-table.component';

describe('SalutationTableComponent', () => {
  let component: SalutationTableComponent;
  let fixture: ComponentFixture<SalutationTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SalutationTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalutationTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
