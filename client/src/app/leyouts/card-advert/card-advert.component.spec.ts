import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardAdvertComponent } from './card-advert.component';

describe('CardAdvertComponent', () => {
  let component: CardAdvertComponent;
  let fixture: ComponentFixture<CardAdvertComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardAdvertComponent]
    });
    fixture = TestBed.createComponent(CardAdvertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
