import { Injectable } from '@angular/core';
import countryCodes from '../../assets/phoneCountryCode/countryCodes.json';

@Injectable({
  providedIn: 'root',
})
export class CountryCodeService {
  constructor() {}

  getCountryCodes() {
    return countryCodes;
  }
}
