import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidaysPageComponent } from './holidays-page.component';

describe('HolidaysPageComponent', () => {
  let component: HolidaysPageComponent;
  let fixture: ComponentFixture<HolidaysPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HolidaysPageComponent]
    });
    fixture = TestBed.createComponent(HolidaysPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
