import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealSearchComponent } from './deal-search.component';

describe('DealSearchComponent', () => {
  let component: DealSearchComponent;
  let fixture: ComponentFixture<DealSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DealSearchComponent]
    });
    fixture = TestBed.createComponent(DealSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
