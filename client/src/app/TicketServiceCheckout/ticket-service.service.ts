import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private selectedTicket: any;
  private isSingleTicket: boolean = false;
  private combinedTicketSource = new BehaviorSubject<any>(null);
  combinedTicket$ = this.combinedTicketSource.asObservable();

  constructor() { }

  setSelectedTicket(ticket: any, isSingle: boolean) {
    console.log(`Setting selected ticket. Is single: ${isSingle}, Ticket:`, ticket);
    this.selectedTicket = ticket;
    this.isSingleTicket = isSingle;
  }

  getSelectedTicket() {
    return this.selectedTicket;
  }

  getIsSingleTicket() {
    return this.isSingleTicket;
  }

  updateSelectedTicket(updatedTicket: any) {
    this.selectedTicket = updatedTicket;
  }

  updateCombinedTicket(ticket: any) {
    console.log("Updating combined ticket in service:", ticket);
    this.combinedTicketSource.next(ticket);
  }
}
