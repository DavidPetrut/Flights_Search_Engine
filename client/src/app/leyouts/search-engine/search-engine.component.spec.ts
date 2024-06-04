import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchEngineComponent } from './search-engine.component';

describe('SearchEngineComponent', () => {
  let component: SearchEngineComponent;
  let fixture: ComponentFixture<SearchEngineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchEngineComponent]
    });
    fixture = TestBed.createComponent(SearchEngineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
