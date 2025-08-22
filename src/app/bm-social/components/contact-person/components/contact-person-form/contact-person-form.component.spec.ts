import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactPersonFormComponent } from './contact-person-form.component';

describe('ContactPersonFormComponent', () => {
  let component: ContactPersonFormComponent;
  let fixture: ComponentFixture<ContactPersonFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactPersonFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactPersonFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});