import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import moment from 'moment';
import { FlightDataService } from 'src/app/shared/flight-data.service';
import { Router } from '@angular/router';
import { TicketService } from 'src/app/TicketServiceCheckout/ticket-service.service';



export enum FilterType {
  BEST = 'BEST',
  LOWEST_PRICE = 'LOWEST_PRICE',
  TIME_SAVING = 'TIME_SAVING'
}




@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent implements OnInit, OnChanges {
  @Input() filter: FilterType = FilterType.BEST;
  @Input() combinedTickets: any[] = [];
  @Input() isSingleFlight: boolean = false;
  @Input() displayedTickets: any[] = [];
  @Input() singleTickets: any[] = []; 


  totalOldPrice: number = 0;
  totalNewPrice: number = 0;
  flights: any[] = [];
  numberOfAdults: number = 1;
  numberOfKids: number = 0;
  showCo2Popup = false
  showDepartureDetails = false;
  showReturnDetails = false;
  departureFlights: any[] = [];
  returnFlights: any[] = [];
  isReturnFlight: boolean = false;
  selectedTicket: any;
  currentDate = moment();

  constructor(private flightDataService: FlightDataService, private router: Router, private ticketService: TicketService) { }

  ngOnInit() {

    this.flightDataService.currentFlightData.subscribe(data => {
      if (data && data.combinedTickets) {
        // Store the number of adults and kids
        this.numberOfAdults = data.numberOfAdults;
        this.numberOfKids = data.numberOfKids;
        

        this.combinedTickets = data.combinedTickets.map(ticket => ({
          ...ticket,
          showDepartureDetails: false, 
          showReturnDetails: false,
          showCo2Popup: false,
          // Initialize price fields to ensure they exist
          totalOldTicketPrice: 0,
          totalNewTicketPrice: 0,
        }));
  
        // New code to calculate and set total prices
        this.combinedTickets.forEach(ticket => {
          ticket.totalOldTicketPrice = Math.floor(this.calculateTotalPrice(ticket.departureFlight, ticket.returnFlight, 'oldTicketPrice'));
          ticket.totalNewTicketPrice = Math.floor(this.calculateTotalPrice(ticket.departureFlight, ticket.returnFlight, 'newTicketPrice'));
          
          // If this ticket is currently selected, update it in the service
          if (ticket === this.selectedTicket) {
            this.ticketService.updateSelectedTicket(ticket);
          }
        });
        
        if (this.combinedTickets.length > 0) {
          this.selectedTicket = this.combinedTickets[0];
        }
      }
    
    });

    this.applyFilter();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filter']) {
      this.applyFilter();
    }
  }




  //this functions are from the loop, to render information for each tickets, rather than on 1 ticket only
  toggleDepartureDetails(ticketIndex: number) {
    this.combinedTickets[ticketIndex].showDepartureDetails = !this.combinedTickets[ticketIndex].showDepartureDetails;
  }
  toggleReturnDetails(ticketIndex: number) {
    this.combinedTickets[ticketIndex].showReturnDetails = !this.combinedTickets[ticketIndex].showReturnDetails;
  }
  toggleCo2Popup(index: number) {
    this.combinedTickets[index].showCo2Popup = !this.combinedTickets[index].showCo2Popup;
  }
  onMouseEnter(index: number) {
    this.combinedTickets[index].showCo2Popup = true;
  }
  
  onMouseLeave(index: number) {
    this.combinedTickets[index].showCo2Popup = false;
  }

  floorValue(value:number) {
    return Math.floor(value)
  }



calculateTotalPrice(departureFlight: any, returnFlight: any, priceType: 'oldTicketPrice' | 'newTicketPrice'): number {


  // Ensure the price type is properly defined for calculation
  const adultPriceDeparture = departureFlight ? departureFlight[priceType] : 0;
  const adultPriceReturn = returnFlight ? returnFlight[priceType] : 0;
  
  // Calculate total price for adults for departure and return flights
  const totalAdultPrice = (adultPriceDeparture + adultPriceReturn) * this.numberOfAdults;
  
  const kidPriceDeparture = departureFlight ? departureFlight[priceType] * 0.5 : 0;
  const kidPriceReturn = returnFlight ? returnFlight[priceType] * 0.5 : 0;
  
  // Calculate total price for kids for departure and return flights
  const totalKidPrice = (kidPriceDeparture + kidPriceReturn) * this.numberOfKids;


  const totalPrice = totalAdultPrice + totalKidPrice;
  
  return totalPrice
}



  calculateFlightDuration(departureTime: string, arrivalTime: string): string {
  
    const departure = moment(departureTime);
    const arrival = moment(arrivalTime);
  
    if (!departure.isValid() || !arrival.isValid()) {
      console.error("Invalid date format:", departureTime, arrivalTime);
      return "N/A";
    }
  
    const duration = moment.duration(arrival.diff(departure));
    const hours = duration.hours();
    const minutes = duration.minutes();
  
    return `${hours}h ${minutes}'`;
  }
  



  getTotalPrices() {
    let totalOldPrice = 0;
    let totalNewPrice = 0;
    if (this.departureFlights.length > 0) {
      totalOldPrice += Math.floor(this.departureFlights[0].totalOldTicketPrice);
      totalNewPrice += Math.floor(this.departureFlights[0].totalNewTicketPrice);
    }
    if (this.returnFlights.length > 0) {
      totalOldPrice += Math.floor(this.returnFlights[0].totalOldTicketPrice);
      totalNewPrice += Math.floor(this.returnFlights[0].totalNewTicketPrice);
    }
    return { totalOldPrice, totalNewPrice };
  }



  getAverageCo2Level() {
    if (this.combinedTickets.length === 0) return 0;
    const totalCo2Level = this.combinedTickets.reduce((sum, ticket) => {
      return sum + (ticket.departureFlight?.co2Level || 0) + (ticket.returnFlight?.co2Level || 0);
    }, 0);
    return Math.round(totalCo2Level / (this.combinedTickets.length * 2));
  }


// filtering functions for my filters that will be binding within the results component
  applyFilter() {
    switch (this.filter) {
      case FilterType.BEST:
        // Sort by a combination of price and duration
        this.combinedTickets.sort((a, b) => {
          const scoreA = a.totalNewTicketPrice + this.getDurationInMinutes(a.departureFlight.departureTime, a.departureFlight.arrivalTime);
          const scoreB = b.totalNewTicketPrice + this.getDurationInMinutes(b.departureFlight.departureTime, b.departureFlight.arrivalTime);
          return scoreA - scoreB;
        });
        break;
  
      case FilterType.LOWEST_PRICE:
        // Sort by price
        this.combinedTickets.sort((a, b) => a.totalNewTicketPrice - b.totalNewTicketPrice);
        break;
  
      case FilterType.TIME_SAVING:
        // Sort by travel duration
        this.combinedTickets.sort((a, b) => {
          const durationA = this.getDurationInMinutes(a.departureFlight.departureTime, a.departureFlight.arrivalTime);
          const durationB = this.getDurationInMinutes(b.departureFlight.departureTime, b.departureFlight.arrivalTime);
          return durationA - durationB;
        });
        break;
    }
  }
  
  // Helper method to calculate flight duration in minutes
  getDurationInMinutes(departureTime: string, arrivalTime: string): number {
    const departure = moment(departureTime);
    const arrival = moment(arrivalTime);
    const duration = moment.duration(arrival.diff(departure));
    return duration.asMinutes();
  }

  

 
  

  selectTicket(ticket: any, isCombined: boolean = false) {
    if (isCombined) {
        // Explicitly checking for combined ticket structure
        if (ticket.departureFlight && ticket.returnFlight) {
            const combinedTicket = {
                departureFlight: ticket.departureFlight,
                returnFlight: ticket.returnFlight,
            };
            this.ticketService.setSelectedTicket(combinedTicket, false); // false for combined ticket
        } else {
            console.log("Handling as single ticket:", ticket);
            console.error("Invalid combined ticket structure", ticket);
        }
        this.ticketService.updateCombinedTicket(ticket);
    } else {
        this.ticketService.setSelectedTicket(ticket, true); 
    }
    this.router.navigate(['/checkout']);
  }
  



}

