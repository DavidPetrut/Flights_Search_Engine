import { Component, OnInit, OnDestroy  } from '@angular/core';
import { CountryCodeService } from 'src/app/shared3/country-code.service';
import { TicketService } from 'src/app/TicketServiceCheckout/ticket-service.service';
import { HttpClient } from '@angular/common/http'; //this is for stripe
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/SignUpModule/ServicesSignUp/Auth/auth.service';



@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, OnDestroy  {
  selectedTicket: any;
  countryCodes: any[] = [];
  baseOldPrice: any;
  baseNewPrice: any;
  additionalPrice: number = 0
  defaultIncrease: number = 20;
  selectedPlanIndex: number | null = 0; 
  selectedBagIndex: number | null = 0; 
  additionalBagPrice: number = 0; 
  checkoutForm!: FormGroup
  submitAttempted = false;
  isSingleTicket: boolean = false;
  private subscriptions = new Subscription();
  isStudentVerified: boolean = false;
  studentOfferUsed: boolean = false;


  
  constructor(
    private authService: AuthService,
    private ticketService: TicketService,
    private countryCodeService: CountryCodeService,
    private http: HttpClient, 
  ) { }



ngOnInit() {
  this.authService.isUserAStudentAndOfferUsed().subscribe(({isStudent, offerUsed}) => {
    this.isStudentVerified = isStudent;
    this.studentOfferUsed = offerUsed;
  });
  
  // Subscribe to combined ticket updates
  this.subscriptions.add(this.ticketService.combinedTicket$.subscribe(ticket => {
    console.log("Received combined ticket update:", ticket);
    if (ticket) {
      this.selectedTicket = ticket;
      // Update combined ticket specific logic
      this.isSingleTicket = false;
      // Ensure total prices are calculated correctly
      this.baseOldPrice = ticket.totalOldTicketPrice;
      this.baseNewPrice = ticket.totalNewTicketPrice;
      // Apply any default increases or additional logic here
      this.updateFinalPrices(); 
    }
  }));

  // Retrieve and handle the single ticket scenario
  this.selectedTicket = this.ticketService.getSelectedTicket();
  this.isSingleTicket = this.ticketService.getIsSingleTicket();
  if (this.isSingleTicket && this.selectedTicket) {
    // Handle single ticket specific initialization
    this.baseOldPrice = this.selectedTicket.oldTicketPrice;
    this.baseNewPrice = this.selectedTicket.newTicketPrice;
    this.updateFinalPrices(); 
  }

  // Common initialization logic for both single and combined tickets
  this.countryCodes = this.countryCodeService.getCountryCodes();
  this.initializeForm();
  console.log("Checkout initialized. Selected ticket:", this.selectedTicket);
  this.updateFinalPrices();
}

ngOnDestroy() {
  this.subscriptions.unsubscribe(); 
}


calculateTotalPriceForCombinedTicket(ticket: any, priceType: 'oldTicketPrice' | 'newTicketPrice'): number {
  let total = 0;
  if (ticket.departureFlight && ticket[priceType]) {
    total += ticket.departureFlight[priceType];
  }
  if (ticket.returnFlight && ticket[priceType]) {
    total += ticket.returnFlight[priceType];
  }
  return total;
}


initializeForm() {
  this.checkoutForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      confirmEmail: new FormControl('', [Validators.required, Validators.email]),
      prefixPhoneNumber: new FormControl('', Validators.required),
      phoneNumber: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      postcode: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required),
  });
}



  selectPaymentPlan(priceString: string, index: number) {
    this.selectedPlanIndex = index;
    this.additionalPrice = parseFloat(priceString.replace(/[^\d.-]/g, ''));
    this.selectedTicket.totalOldTicketPrice = this.baseOldPrice + this.additionalPrice;
    this.selectedTicket.totalNewTicketPrice = this.baseNewPrice + this.additionalPrice;
  }




  selectBag(priceString: string, index: number) {
    this.selectedBagIndex = index;
    if (priceString === 'free') {
      this.additionalBagPrice = 0;
    } else {
      this.additionalBagPrice = parseFloat(priceString.replace(/[^\d.-]/g, ''));
    }
    this.updateFinalPrices();
  }
  

  updateFinalPrices() {
    this.selectedTicket.totalOldTicketPrice = parseFloat((this.baseOldPrice + this.additionalPrice + this.additionalBagPrice).toFixed(2));
    this.selectedTicket.totalNewTicketPrice = parseFloat((this.baseNewPrice + this.additionalPrice + this.additionalBagPrice).toFixed(2));
    console.log("Updated final prices. Old price:", this.selectedTicket.totalOldTicketPrice, "New price:", this.selectedTicket.totalNewTicketPrice);
}



  // stripe function to handle payments for my app
  handlePayment() {
     // Convert to cents
    const totalPriceInCents = this.selectedTicket.totalNewTicketPrice * 100;
    this.http.post<{ url: string }>('http://localhost:8001/create-checkout-session', {
      // Send total price as a single item
      items: [{ id: 1, quantity: 1, priceInCents: totalPriceInCents }] 
    })
    .subscribe({
      next: (response) => {
        // Redirect to Stripe Checkout
        window.location.href = response.url; 
      },
      error: (error) => {
        console.error('Error during payment:', error);
      }
    });
  }


  // this is if the people wants to submit without completing contact
  handleCheckout() {
    if (this.checkoutForm.valid) {
      this.handlePayment();
    } else {
      this.submitAttempted = true;
    }
  }



  applyStudentDiscount(): void {
    // First, check if the student offer has not already been used and if the user is verified as a student
    const offerUsed = localStorage.getItem('studentOfferUsed') === 'true';
  
    if (!offerUsed && this.isStudentVerified) {
      // Apply a 50% discount to the new price
      this.selectedTicket.totalNewTicketPrice *= 0.5;
      
      // Format to two decimal places
      this.selectedTicket.totalNewTicketPrice = Math.floor(parseFloat(this.selectedTicket.totalNewTicketPrice.toFixed(2)));
      
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const email = user.email;
  
      if(email) {
        this.http.patch('http://localhost:8001/api/users/useStudentOffer', { email: email })
          .subscribe({
            next: (response) => {
              // Once the offer is successfully marked as used in the backend, update the front end
              console.log('Offer marked as used for', email);
              this.studentOfferUsed = true;
              localStorage.setItem('studentOfferUsed', 'true');
            },
            error: (error) => {
              console.error('Failed to mark offer as used', error);
            }
          });
      } else {
        console.error('No user email found');
      }
    }
  }
  


}



