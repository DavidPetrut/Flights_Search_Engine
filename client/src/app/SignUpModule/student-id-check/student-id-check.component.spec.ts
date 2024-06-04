import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentIdCheckComponent } from './student-id-check.component';

describe('StudentIdCheckComponent', () => {
  let component: StudentIdCheckComponent;
  let fixture: ComponentFixture<StudentIdCheckComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentIdCheckComponent]
    });
    fixture = TestBed.createComponent(StudentIdCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
