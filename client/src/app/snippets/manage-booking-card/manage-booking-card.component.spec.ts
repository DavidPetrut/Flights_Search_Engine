import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageBookingCardComponent } from './manage-booking-card.component';

describe('ManageBookingCardComponent', () => {
  let component: ManageBookingCardComponent;
  let fixture: ComponentFixture<ManageBookingCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageBookingCardComponent]
    });
    fixture = TestBed.createComponent(ManageBookingCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
