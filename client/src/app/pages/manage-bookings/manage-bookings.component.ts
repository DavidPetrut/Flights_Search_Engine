import { Component, OnInit } from '@angular/core';
import { AmadeusService } from '../../shared4Amadeus/amadeus.service';

@Component({
  selector: 'app-manage-bookings',
  templateUrl: './manage-bookings.component.html',
  styleUrls: ['./manage-bookings.component.css']
})
export class ManageBookingsComponent implements OnInit {

  flightOffers: any[] = [];
  searchTerm: string = 'CDG';

  constructor(private amadeusService: AmadeusService) { }

  ngOnInit(): void {
    this.searchAirports();
  }

  searchAirports() {
    if (this.searchTerm) { // Ensure searchTerm is not empty
      this.amadeusService.getOriginAirports(this.searchTerm).subscribe({
        next: (response) => {
          console.log(response);
          this.flightOffers = response; // Assuming the response is the array you want
          // Further processing and display of data
        },
        error: (error) => console.error(error)
      });
    } else {
      console.error('Search term is empty');
    }
  }
}