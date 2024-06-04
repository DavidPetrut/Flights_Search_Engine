import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondSearchEngineComponent } from './second-search-engine.component';

describe('SecondSearchEngineComponent', () => {
  let component: SecondSearchEngineComponent;
  let fixture: ComponentFixture<SecondSearchEngineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SecondSearchEngineComponent]
    });
    fixture = TestBed.createComponent(SecondSearchEngineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
