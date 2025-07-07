import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalutationFormComponent } from './salutation-form.component';

describe('SalutationFormComponent', () => {
  let component: SalutationFormComponent;
  let fixture: ComponentFixture<SalutationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SalutationFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalutationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
