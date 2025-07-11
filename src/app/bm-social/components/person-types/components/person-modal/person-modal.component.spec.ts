import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonModalComponent } from './person-modal.component';

describe('PersonModalComponent', () => {
  let component: PersonModalComponent;
  let fixture: ComponentFixture<PersonModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersonModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
