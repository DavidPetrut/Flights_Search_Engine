import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TicketComponent } from './ticket.component';
import { FlightDataService } from 'src/app/shared/flight-data.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

// Mock FlightDataService
class MockFlightDataService {
  // Mock the methods and properties used by TicketComponent
  currentFlightData = of({
    combinedTickets: [],
    numberOfAdults: 1,
    numberOfKids: 0,
  });
}

describe('TicketComponent', () => {
  let component: TicketComponent;
  let fixture: ComponentFixture<TicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TicketComponent],
      imports: [RouterTestingModule], // Import RouterTestingModule if your component uses routing
      providers: [
        { provide: FlightDataService, useClass: MockFlightDataService }, // Use the mock instead of the real service
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger initial data binding
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Add more tests here to test specific functionalities of TicketComponent
});
