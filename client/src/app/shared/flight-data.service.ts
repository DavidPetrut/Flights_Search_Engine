import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import moment from 'moment';

export interface FlightData {
  combinedTickets?: {
    departureFlight: any; 
    returnFlight: any;   
    totalOldTicketPrice: number;
    totalNewTicketPrice: number;
  }[];
  singleTickets?: any[]; 
  numberOfAdults: number;
  numberOfKids: number;
  searchCriteria?: {
    from: string;
    to: string;
    startDate: string;
    endDate: string;
    passengers: number;
  };
  dynamicPricingApplied?: boolean; 
}


@Injectable({
  providedIn: 'root'
})
export class FlightDataService {
  private flightData = new BehaviorSubject<FlightData | null>(null);
  currentFlightData = this.flightData.asObservable();
  // test for the currentDate to check
  private currentDate = moment("2024-01-01");
  private lastSearchCriteria: FlightData['searchCriteria'] | undefined = undefined;

  constructor() {}



  changeFlightData(data: FlightData) {
    if (this.criteriaChanged(data.searchCriteria)) {
      // Ensure dynamic pricing logic is applied first
      if (data.combinedTickets) {
        data.combinedTickets = this.applyDynamicPricing(data.combinedTickets, this.currentDate);
        // After dynamic pricing, apply seasonal pricing adjustments
        data.combinedTickets = this.applySeasonalPricing(data.combinedTickets);
      }
      data.dynamicPricingApplied = true; 
      this.lastSearchCriteria = data.searchCriteria;
    }
    this.flightData.next(data);
  }


  private criteriaChanged(newCriteria: FlightData['searchCriteria']): boolean {
    return JSON.stringify(newCriteria) !== JSON.stringify(this.lastSearchCriteria);
  }

  calculateDynamicPriceAdjustment(flight: any, currentDate: moment.Moment): { newOldPrice: number, newNewPrice: number } {
    if (flight.priceAdjusted) {
        return { newOldPrice: flight.oldTicketPrice, newNewPrice: flight.newTicketPrice };
    }

    // Preserving the original base prices if not already done
    flight.originalOldPrice = flight.originalOldPrice || flight.oldTicketPrice;
    flight.originalNewPrice = flight.originalNewPrice || flight.newTicketPrice;

    const flightDate = moment(flight.flightDay, "MM/DD/YYYY");
    const daysUntilFlight = flightDate.diff(currentDate, 'days');
    const daysPassed = Math.max(90 - daysUntilFlight, 0);
    const dailyIncreasePercentage = 0.005 * daysPassed;
    const cappedIncreasePercentage = Math.min(dailyIncreasePercentage, 0.3);

    // Log original prices before adjustment

    const newOldPrice = Math.round(flight.originalOldPrice * (1 + cappedIncreasePercentage));
    const newNewPrice = Math.round(flight.originalNewPrice * (1 + cappedIncreasePercentage));
    flight.priceAdjusted = true;
    return { newOldPrice, newNewPrice };
  }


  applyDynamicPricing(combinedTickets: any[], currentDate: moment.Moment): any[] {
    return combinedTickets.map(ticket => {
      [ticket.departureFlight, ticket.returnFlight].forEach(flight => {
        if (flight && !flight.priceAdjusted) {
          const { newOldPrice, newNewPrice } = this.calculateDynamicPriceAdjustment(flight, currentDate);
          flight.oldTicketPrice = newOldPrice;
          flight.newTicketPrice = newNewPrice;
          flight.priceAdjusted = true; 
        }
      });
      // After dynamic price adjustments, update the total prices
      ticket.totalOldTicketPrice = ticket.departureFlight.oldTicketPrice + (ticket.returnFlight ? ticket.returnFlight.oldTicketPrice : 0);
      ticket.totalNewTicketPrice = ticket.departureFlight.newTicketPrice + (ticket.returnFlight ? ticket.returnFlight.newTicketPrice : 0);
      return ticket;
    });
  }


  applySeasonalPricing(combinedTickets: any[]): any[] {
    return combinedTickets.map(ticket => {
      [ticket.departureFlight, ticket.returnFlight].forEach(flight => {
        if (flight && !flight.seasonalPriceAdjusted) {
          const month = moment(flight.flightDay, "MM/DD/YYYY").month() + 1;
          const day = moment(flight.flightDay, "MM/DD/YYYY").date();
          const adjustment = this.getSeasonalAdjustment(month, day);
          // This will apply the seasonal adjustment on top of the dynamically adjusted prices
          flight.oldTicketPrice *= (1 + adjustment);
          flight.newTicketPrice *= (1 + adjustment);
          flight.seasonalPriceAdjusted = true; 
        }
      });
      // After seasonal adjustments, total prices is updated
      ticket.totalOldTicketPrice = ticket.departureFlight.oldTicketPrice + (ticket.returnFlight ? ticket.returnFlight.oldTicketPrice : 0);
      ticket.totalNewTicketPrice = ticket.departureFlight.newTicketPrice + (ticket.returnFlight ? ticket.returnFlight.newTicketPrice : 0);
      return ticket;
    });
  }


  getSeasonalAdjustment(month: number, day: number): number {
    switch (month) {
        case 1: // January
            return day <= 4 ? 0.15 : -0.30;
        case 2: // February
            return day <= 14 ? -0.35 : -0.50;
        case 3: // March
            return day <= 10 ? -0.10 : 0.10;
        case 4: // April
            return day <= 15 ? 0 : -0.20;
        case 5: // May
            return day < 10 ? 0 : 0.10;
        case 6: // June
            return 0.20;
        case 7: // July
            return 0.25;
        case 8: // August
            return day <= 20 ? 0.17 : 0.10;
        case 9: // September
            return day <= 10 ? -0.25 : -0.35;
        case 10: // October
            return day <= 15 ? -0.15 : 0;
        case 11: // November
            return day <= 22 ? -0.20 : 0.25;
        case 12: // December
            return day <= 18 ? 0 : 0.30;
        default:
            return 0;
    }
  }

}

