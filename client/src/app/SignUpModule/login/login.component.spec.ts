import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

// Change "describe" to "fdescribe" to focus on these tests only
fdescribe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      declarations: [LoginComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have form controls', () => {
    expect(component.loginForm.contains('email')).toBeTruthy();
    expect(component.loginForm.contains('password')).toBeTruthy();
  });

  it('should check if the login button is initially disabled', () => {
    const btn = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(btn.nativeElement.disabled).toBeTruthy();
  });

  it('form should be valid when filled correctly', () => {
    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('123456');
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('should emit event when form is valid and submitted', () => {
    spyOn(component, 'handleLogin');
    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('123456');
    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
    expect(component.handleLogin).toHaveBeenCalled();
  });
});
