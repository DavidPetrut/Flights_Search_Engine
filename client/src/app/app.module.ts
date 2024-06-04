import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CardComponent } from './leyouts/card/card.component';
import { HeaderComponent } from './leyouts/header/header.component';
import { FooterComponent } from './leyouts/footer/footer.component';
import { BannerComponent } from './leyouts/banner/banner.component';
import { SearchEngineComponent } from './leyouts/search-engine/search-engine.component';
import { CardAdvertComponent } from './leyouts/card-advert/card-advert.component';
import { FlightsComponent } from './pages/flights/flights.component';
import { HotelsComponent } from './pages/hotels/hotels.component';
import { CarRentalComponent } from './pages/car-rental/car-rental.component';
import { TransportComponent } from './pages/transport/transport.component';
import { FaqComponent } from './pages/faq/faq.component';
import { NavigationComponent } from './leyouts/navigation/navigation.component';
import { HolidaysPageComponent } from './pages/holidays-page/holidays-page.component';
import { DealSearchComponent } from './snippets/deal-search/deal-search.component';
import { NewsletterComponent } from './leyouts/newsletter/newsletter.component';
import { ManageBookingCardComponent } from './snippets/manage-booking-card/manage-booking-card.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ResultsComponent } from './pages/results/results.component';
import { TicketComponent } from './leyouts/ticket/ticket.component';
import { SecondSearchEngineComponent } from './leyouts/second-search-engine/second-search-engine.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ShuttleComponent } from './pages/shuttle/shuttle.component';
import { ManageBookingsComponent } from './pages/manage-bookings/manage-bookings.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { SingleCardComponent } from './leyouts/single-card/single-card.component';
import { SuccessComponent } from './pages/success/success.component';
import { CancelComponent } from './pages/cancel/cancel.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TicketService } from './TicketServiceCheckout/ticket-service.service';
import { RegisterComponent } from './SignUpModule/register/register.component';
import { LoginComponent } from './SignUpModule/login/login.component';
import { EmailVerificationComponent } from './SignUpModule/email-verification/email-verification.component';
import { EmailVerificationSuccessComponent } from './SignUpModule/email-verification-success/email-verification-success.component';
import { ProfileComponent } from './SignUpModule/profile/profile.component';
import { ProfileDescriptionComponent } from './SignUpModule/profile-description/profile-description.component';
import { StudentIdCheckComponent } from './SignUpModule/student-id-check/student-id-check.component';


@NgModule({
  declarations: [
    AppComponent,
    CardComponent,
    HeaderComponent,
    FooterComponent,
    BannerComponent,
    SearchEngineComponent,
    CardAdvertComponent,
    FlightsComponent,
    HotelsComponent,
    CarRentalComponent,
    TransportComponent,
    FaqComponent,
    NavigationComponent,
    HolidaysPageComponent,
    DealSearchComponent,
    NewsletterComponent,
    ManageBookingCardComponent,
    ResultsComponent,
    TicketComponent,
    SecondSearchEngineComponent,
    ShuttleComponent,
    ManageBookingsComponent,
    SignUpComponent,
    CheckoutComponent,
    SingleCardComponent,
    SuccessComponent,
    CancelComponent,
    RegisterComponent,
    LoginComponent,
    EmailVerificationComponent,
    EmailVerificationSuccessComponent,
    ProfileComponent,
    ProfileDescriptionComponent,
    StudentIdCheckComponent,
  ],
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot()
  ],
  providers: [
    TicketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
