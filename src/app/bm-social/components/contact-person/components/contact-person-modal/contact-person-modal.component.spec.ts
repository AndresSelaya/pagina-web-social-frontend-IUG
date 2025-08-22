import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactPersonModalComponent } from './contact-person-modal.component';

describe('ContactPersonModalComponent', () => {
  let component: ContactPersonModalComponent;
  let fixture: ComponentFixture<ContactPersonModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactPersonModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactPersonModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});