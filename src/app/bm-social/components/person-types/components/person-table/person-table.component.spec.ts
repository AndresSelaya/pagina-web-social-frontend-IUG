import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonTableComponent } from './person-table.component';

describe('PersonTableComponent', () => {
  let component: PersonTableComponent;
  let fixture: ComponentFixture<PersonTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersonTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
