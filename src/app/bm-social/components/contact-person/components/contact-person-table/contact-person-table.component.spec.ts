import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactPersonTableComponent } from './contact-person-table.component';

describe('ContactPersonTableComponent', () => {
  let component: ContactPersonTableComponent;
  let fixture: ComponentFixture<ContactPersonTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactPersonTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactPersonTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});