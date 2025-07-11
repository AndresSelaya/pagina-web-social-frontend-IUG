import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonTypesComponent } from './person-types.component';

describe('PersonTypesComponent', () => {
  let component: PersonTypesComponent;
  let fixture: ComponentFixture<PersonTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonTypesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersonTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
