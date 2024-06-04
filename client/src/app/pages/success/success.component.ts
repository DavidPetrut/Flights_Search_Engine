import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit {
  paymentIntentId: string = '';
  paymentDetails: any;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      console.log("Received query parameters:", params); // Debugging line
      this.paymentIntentId = params['payment_intent_id'];
      if (this.paymentIntentId) {
        this.fetchPaymentDetails();
      } else {
        console.error("No payment_intent_id found in query parameters.");
      }
    });
  }


  fetchPaymentDetails() {
    this.http.get<any>(`http://localhost:8001/api/users/payment-details/${this.paymentIntentId}`)
      .subscribe({
        next: (response) => {
          if (response.paymentIntent && response.productDescription && response.productImages) {
            this.paymentDetails = response.paymentIntent; // Payment details
            this.paymentDetails.description = response.productDescription; // Product description
            this.paymentDetails.images = response.productImages; // Product images
            console.log("Payment details received:", this.paymentDetails);
          } else {
            console.error("Payment details or product information is missing.");
          }
        },
        error: (error) => {
          console.error("Error fetching payment details:", error);
        }
      });
  }
  

  // fetchPaymentDetails() {
  //   this.http.get<any>(`http://localhost:8001/api/users/payment-details/${this.paymentIntentId}`)
  //     .subscribe({
  //       next: (data) => {
  //         if (data) {
  //           this.paymentDetails = data;
  //           console.log("Payment details received:", this.paymentDetails);
  //         } else {
  //           console.error("Payment details object is undefined.");
  //           // Optionally, handle the undefined data case, e.g., by showing a message to the user.
  //         }
  //       },
  //       error: (error) => {
  //         console.error("Error fetching payment details:", error);
  //       }
  //     });
  // }
  
  
  

}
  
