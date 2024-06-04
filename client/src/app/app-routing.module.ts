import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlightsComponent } from './pages/flights/flights.component';
import { HotelsComponent } from './pages/hotels/hotels.component';
import { CarRentalComponent } from './pages/car-rental/car-rental.component';
import { HolidaysPageComponent } from './pages/holidays-page/holidays-page.component';
import { SearchEngineComponent } from './leyouts/search-engine/search-engine.component';
import { ResultsComponent } from './pages/results/results.component';
import { ShuttleComponent } from './pages/shuttle/shuttle.component';
import { ManageBookingsComponent } from './pages/manage-bookings/manage-bookings.component';
import { FaqComponent } from './pages/faq/faq.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { SuccessComponent } from './pages/success/success.component';
import { CancelComponent } from './pages/cancel/cancel.component';


// sign up routing
import { AuthGuard } from './ServicesSignUp/Auth/auth.guard';
import { EmailVerificationSuccessComponent } from './SignUpModule/email-verification-success/email-verification-success.component';
import { EmailVerificationComponent } from './SignUpModule/email-verification/email-verification.component';
import { LoginComponent } from './SignUpModule/login/login.component';
import { ProfileDescriptionComponent } from './SignUpModule/profile-description/profile-description.component';
import { ProfileComponent } from './SignUpModule/profile/profile.component';
import { RegisterComponent } from './SignUpModule/register/register.component';



const routes: Routes = [
  { path: "", component: FlightsComponent},
  { path: "hotels", component: HotelsComponent},
  { path: "rental", component: CarRentalComponent},
  { path: "shuttle", component: ShuttleComponent},
  { path: "holiday", component: HolidaysPageComponent},
  { path: "testSearch", component: SearchEngineComponent},
  { path: "results", component: ResultsComponent},
  { path: "manageBookings", component: ManageBookingsComponent},
  { path: "signUp", component: SignUpComponent},
  { path: "faq", component: FaqComponent},
  { path: "checkout", component: CheckoutComponent},
  { path: 'success', component: SuccessComponent },
  { path: 'cancel', component: CancelComponent },


  // sign up routing
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'verify-email', component: EmailVerificationComponent },
  { path: 'email-verification-success', component: EmailVerificationSuccessComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'profile-description', component: ProfileDescriptionComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
