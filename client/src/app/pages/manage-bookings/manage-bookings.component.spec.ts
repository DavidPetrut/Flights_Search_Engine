import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageBookingsComponent } from './manage-bookings.component';

describe('ManageBookingsComponent', () => {
  let component: ManageBookingsComponent;
  let fixture: ComponentFixture<ManageBookingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageBookingsComponent]
    });
    fixture = TestBed.createComponent(ManageBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
