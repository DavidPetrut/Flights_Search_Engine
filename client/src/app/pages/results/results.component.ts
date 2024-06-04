import { Component, OnInit, OnChanges, SimpleChanges, OnDestroy, ChangeDetectorRef   } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlightDataService } from 'src/app/shared/flight-data.service';
// import * as moment from 'moment';
import moment from 'moment';
import { FilterType } from 'src/app/leyouts/ticket/ticket.component';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit, OnChanges, OnDestroy  {
  private subscriptions = new Subscription();
  displayedTickets: any[] = [];
  private currentIndex: number = 0;
  private incrementStep: number = 8;
  selectedFilter: FilterType = FilterType.BEST;
  combinedTickets: any[] = [];
  FilterType = FilterType;
  isSingleFlight: boolean = false;

  // selectedFilter: string = 'best';
  bestPrice: number = 0;
  bestDuration: string = '';

  currentDate = moment();


  constructor(private route: ActivatedRoute, private flightDataService: FlightDataService, private cdRef: ChangeDetectorRef) {}


  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      // Check if it's a single flight search
      this.isSingleFlight = params['isSingleFlight'] === 'true';
      this.updateResults(params);
      this.updateFilterDisplay();
      console.log('Query parameters:', params);
    });

    console.log(`ResultsComponent initialized. Current date set to ${this.currentDate.format('YYYY-MM-DD')}`);
    this.flightDataService.currentFlightData.subscribe(data => {
      console.log(`Received new flight data with ${data?.combinedTickets?.length || 0} combined tickets and ${data?.singleTickets?.length || 0} single tickets`);
      if (data) {
        console.log("Received flight data in ResultsComponent:", data);
        if (this.isSingleFlight) {
          // Handle single flight data
          this.displayedTickets = data.singleTickets || [];
          this.updateSingleTicketPrices();
          console.log('Single flight tickets:', this.displayedTickets);
        } else {
          // Handle combined ticket data
          this.combinedTickets = data.combinedTickets || [];
          this.resetDisplayedTickets();
        }
        // this.updateTicketPricesDynamically()
        this.cdRef.detectChanges();
      }
    });
  }


  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['combinedTickets']) {
      console.log('app-ticket: Updated combinedTickets:', this.combinedTickets.length);
    }
  }
  
  

  updateResults(params: any) {
    //This code is extracting the search criteria from the query parameters
    const from = params['from'];
    const to = params['to'];
    const startDate = params['startDate'];
    const endDate = params['endDate'];
    const passengers = params['passengers'];
  }


  setSelectedFilter(filter: string) {
    if (filter in FilterType) {
      this.selectedFilter = FilterType[filter as keyof typeof FilterType];
    } else {
      console.error('Invalid filter type:', filter);
      this.selectedFilter = FilterType.BEST; // Default value if the filter is invalid
    }
  }

// rendering some filtering tags for lowest price and best time duration ticket

  updateFilterDisplay() {
    this.flightDataService.currentFlightData.subscribe(data => {
      if (data && data.combinedTickets) {
        
        this.calculateBest(data.combinedTickets);
      }
    });
  }

  calculateBest(combinedTickets: any[]) {
    let bestScore = Infinity;
    combinedTickets.forEach(ticket => {
      const duration = this.getDurationInMinutes(ticket.departureFlight.departureTime, ticket.departureFlight.arrivalTime);
  
      //This calculate the total price for adults and kids
      const totalAdultPrice = ticket.totalNewTicketPrice * (ticket.numberOfAdults || 1);
      const totalKidPrice = ticket.totalNewTicketPrice * (ticket.numberOfKids || 0) * 0.5;
      const totalPrice = Math.floor(totalAdultPrice + totalKidPrice);
  
      const score = totalPrice + duration; 
      if (score < bestScore) {
        bestScore = score;
        this.bestPrice = totalPrice;
        this.bestDuration = this.formatDuration(duration);
      }
    });
    
  }

  
  
  

  getDurationInMinutes(departureTime: string, arrivalTime: string): number {
    const departure = moment(departureTime);
    const arrival = moment(arrivalTime);
    return moment.duration(arrival.diff(departure)).asMinutes();
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return `${hours}h ${mins}'`;
  }


  // resets the tickets and loads new ones to get 8
  resetDisplayedTickets() {
    this.currentIndex = 0; // Reset current index
    this.loadMoreTickets();
  }
  
  loadMoreTickets() {
    const nextIndex = this.currentIndex + this.incrementStep;
    this.displayedTickets = this.combinedTickets.slice(0, nextIndex);
    this.currentIndex = nextIndex;
    console.log('Loaded tickets:', this.displayedTickets.length, 'Current index:', this.currentIndex);
  }

  updateSingleTicketPrices(): void {
    // Subscribe to the observable and keep track of the subscription
    const subscription = this.flightDataService.currentFlightData.subscribe(data => {
      if (data && data.singleTickets) {
        const { numberOfAdults, numberOfKids } = data;
        this.displayedTickets = data.singleTickets.map(ticket => {
          // Calculate new prices
          const adultPrice = ticket.oldTicketPrice * numberOfAdults;
          const kidPrice = ticket.oldTicketPrice * numberOfKids * 0.5; // Assuming kids pay half price
          const totalOldPrice = adultPrice + kidPrice;

          const adultNewPrice = ticket.newTicketPrice * numberOfAdults;
          const kidNewPrice = ticket.newTicketPrice * numberOfKids * 0.5; // Assuming kids pay half price
          const totalNewPrice = Math.floor(adultNewPrice + kidNewPrice);

          return {
            ...ticket,
            oldTicketPrice: totalOldPrice,
            newTicketPrice: totalNewPrice,
          };
        });
      }
    });

    this.subscriptions.add(subscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe(); 
  }
  
}

