import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FlightData, FlightDataService } from 'src/app/shared/flight-data.service';
import { formatDate } from '@angular/common';
import { SearchCriteriaService, SearchCriteria  } from 'src/app/shared2/search-criteria.service';

@Component({
  selector: 'app-search-engine',
  templateUrl: './search-engine.component.html',
  styleUrls: ['./search-engine.component.css']
})
export class SearchEngineComponent implements OnInit {
  
  constructor(private searchCriteriaService: SearchCriteriaService, private flightDataService: FlightDataService, private router: Router, private http: HttpClient) {}
  
  showPassengerPopup = false;
  multiCity = false
  multipleCity = false
  numberOfAdults = 1
  numberOfKids = 0
  numberOfPassengers = 1;
  tripType = 'return'
  whereFrom:string = ""
  whereTo:string = ""
  whereTo2:string = ""
  currentDate = new Date()
  selectDate: Date | Date[] | any = null;
  locations: any[] = [];
  flights: any[] = []


  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:8001/flights').subscribe(data => {
      this.flights = data;
    }, error => {
      console.error('Error loading flights', error);
    });

    this.http.get<any[]>("../../../assets/airportsNames/locations_airport_codes.json").subscribe(data => {
      this.locations = data
    }, error => {
      console.error("Error loading locations", error)
    })
  }

  //share the inputs data to the second search engine from results
  onSearch() {
    const criteria: SearchCriteria = {
      from: this.whereFrom,
      to: this.whereTo,
      dateRange: this.selectDate,
      passengers: this.numberOfPassengers
    };
    this.searchCriteriaService.setSearchCriteria(criteria);
    this.router.navigate(['/results']);
  }


  togglePassengerPopup() {
      this.showPassengerPopup = !this.showPassengerPopup;
  }

  changeAdultsCount(change: number) {
      this.numberOfAdults = Math.max(0, this.numberOfAdults + change);
  }

  changeKidsCount(change: number) {
    this.numberOfKids = Math.max(0, this.numberOfKids + change);
}

  updateTotalPassengers(){
    this.numberOfPassengers = this.numberOfAdults + this.numberOfKids;
    this.togglePassengerPopup()
}

  updateTripType(type: string) {
    this.tripType = type;
}

  multiCitiesOn() {
    this.multiCity = true
  }

  multiCitiesOff() {
    this.multiCity = false
  }

  swapLocations() {
    [this.whereFrom, this.whereTo] = [this.whereTo, this.whereFrom]
}
  swapLocations2() {
  [this.whereTo, this.whereTo2] = [this.whereTo2, this.whereTo]
}

parseDates(dateRange: Date[]): { startDate: string, endDate: string } {
  if (Array.isArray(dateRange) && dateRange.length === 2) {
    const startDate = formatDate(dateRange[0], 'MM/dd/yyyy', 'en-US');
    const endDate = formatDate(dateRange[1], 'MM/dd/yyyy', 'en-US');
    return { startDate, endDate };
  }
  // Handle unexpected format
  return { startDate: '', endDate: '' };
}


searchFlights() {
  if (this.whereFrom && this.whereTo && this.selectDate) {
    let startDate: string, endDate: string;

    if (this.tripType === 'oneWay') {
      // Handle single date for one-way flights
      startDate = formatDate(this.selectDate, 'yyyy-MM-dd', 'en-US');
      // Use the same date for both start and end
      endDate = startDate; 
    } else {
      // Handle date range for return flights
      const dates = this.parseDates(this.selectDate);
      startDate = dates.startDate;
      endDate = dates.endDate;
    }
    
    type CombinedTicket = {
      departureFlight: any;
      returnFlight: any;
      totalOldTicketPrice: number;
      totalNewTicketPrice: number;
    };

    const combinedTickets: CombinedTicket[] = [];

    // Filter for departure flights from whereFrom to whereTo on startDate
    const departureMatches = this.flights.filter(flight =>
      flight.fullNameDeparture.toLowerCase().includes(this.whereFrom.toLowerCase()) &&
      flight.fullNameArrival.toLowerCase().includes(this.whereTo.toLowerCase()) &&
      flight.flightDay === startDate
    );

    // Filter for return flights from whereTo to whereFrom on endDate
    const returnMatches = this.flights.filter(flight =>
      flight.fullNameDeparture.toLowerCase().includes(this.whereTo.toLowerCase()) &&
      flight.fullNameArrival.toLowerCase().includes(this.whereFrom.toLowerCase()) &&
      flight.flightDay === endDate
    );
    console.log(`[SearchEngine] Return Matches:`, returnMatches);

    // Generate all possible combinations of departure and return flights
    departureMatches.forEach(departureFlight => {
      returnMatches.forEach(returnFlight => {
        combinedTickets.push({
          departureFlight,
          returnFlight,
          totalOldTicketPrice: departureFlight.oldTicketPrice + returnFlight.oldTicketPrice,
          totalNewTicketPrice: departureFlight.newTicketPrice + returnFlight.newTicketPrice
        });
      });
    });

    console.log(`[SearchEngine] Combined Tickets:`, combinedTickets);

    const dataToPass: FlightData = {
      combinedTickets,
      numberOfAdults: this.numberOfAdults,
      numberOfKids: this.numberOfKids,
      searchCriteria: {
        from: this.whereFrom,
        to: this.whereTo,
        startDate: formatDate(this.selectDate[0], 'yyyy-MM-dd', 'en-US'),
        endDate: formatDate(this.selectDate[1], 'yyyy-MM-dd', 'en-US'),
        passengers: this.numberOfPassengers
      }
    };

    this.flightDataService.changeFlightData(dataToPass);

    this.router.navigate(['/results'], {
      queryParams: {
        from: this.whereFrom,
        to: this.whereTo,
        startDate,
        endDate,
        passengers: this.numberOfPassengers,
        isSingleFlight: this.tripType === 'oneWay'
      }
    });
  }
}


searchSingleFlight() {
  console.log("searchSingleFlight function called");
  if (this.whereFrom && this.whereTo && this.selectDate) {
    let startDate = '';
    if (Array.isArray(this.selectDate)) {
      // Handle date range (bsDaterangepicker)
      startDate = formatDate(this.selectDate[0], 'MM/dd/yyyy', 'en-US');
    } else {
      // Handle single date (bsDatePicker)
      startDate = formatDate(this.selectDate, 'MM/dd/yyyy', 'en-US');
    }

    // Filter for single flights from whereFrom to whereTo on startDate
    const singleMatches = this.flights.filter(flight =>
      flight.fullNameDeparture.toLowerCase().includes(this.whereFrom.toLowerCase()) &&
      flight.fullNameArrival.toLowerCase().includes(this.whereTo.toLowerCase()) &&
      flight.flightDay === startDate
    );
    
    // Prepare single tickets data
    const singleTickets = singleMatches.map(flight => ({
      companyName: flight.companyName,
      logoURL: flight.logoURL,
      departureAirport: flight.departureAirport,
      arrivalAirport: flight.arrivalAirport,
      departureTime: flight.departureTime,
      arrivalTime: flight.arrivalTime,
      oldTicketPrice: flight.oldTicketPrice,
      newTicketPrice: flight.newTicketPrice,
      co2Level: flight.co2Level,
      flightTime: flight.flightTime,
    }));
    
    const dataToPass: FlightData = {
      // This comes from mapping my single flight matches
      singleTickets: singleTickets, 
      numberOfAdults: this.numberOfAdults,
      numberOfKids: this.numberOfKids,
      searchCriteria: {
        from: this.whereFrom,
        to: this.whereTo,
        startDate: formatDate(this.selectDate, 'yyyy-MM-dd', 'en-US'), 
        endDate: formatDate(this.selectDate, 'yyyy-MM-dd', 'en-US'), 
        passengers: this.numberOfPassengers
      }
    };
    
    this.flightDataService.changeFlightData(dataToPass);

    // Navigate to the results page with additional query parameters
    this.router.navigate(['/results'], {
      queryParams: {
        from: this.whereFrom,
        to: this.whereTo,
        startDate: startDate,
        isSingleFlight: true,
        passengers: this.numberOfPassengers
      }
    });
  }
}



calculateTotalPrice(departureFlight: any, returnFlight: any, priceType: string) {
  const departurePrice = departureFlight ? departureFlight[priceType] : 0;
  const returnPrice = returnFlight ? returnFlight[priceType] : 0;
  const totalForAdults = Math.floor(departurePrice * this.numberOfAdults) + Math.floor(returnPrice * this.numberOfAdults);
  const totalForKids = Math.floor((departurePrice * 0.5) * this.numberOfKids) + Math.floor((returnPrice * 0.5) * this.numberOfKids);
  return totalForAdults + totalForKids;
}

filterFlights(from: string, to: string, flightDay: string): any {
  return this.flights.find(flight => {
    const departureMatches = flight.fullNameDeparture.toLowerCase().includes(from.toLowerCase());
    const arrivalMatches = flight.fullNameArrival.toLowerCase().includes(to.toLowerCase());
    return departureMatches && arrivalMatches && flight.flightDay === flightDay;
  });
}


}
