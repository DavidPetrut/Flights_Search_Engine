import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface SearchCriteria {
  from: string;
  to: string;
  dateRange: Date | Date[]; 
  passengers: number;
}


@Injectable({
  providedIn: 'root'
})
export class SearchCriteriaService {

  private searchCriteria = new BehaviorSubject<SearchCriteria | null>(null);

  setSearchCriteria(criteria: SearchCriteria) {
    this.searchCriteria.next(criteria);
  }

  getSearchCriteria() {
    return this.searchCriteria.asObservable();
  }
}