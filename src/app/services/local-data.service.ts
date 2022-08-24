import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalDataService {
  
  showHeaderMenu = new Subject<boolean>();

  yearSource = new BehaviorSubject<string>('2021');
  currentYear = this.yearSource.asObservable();

  governanceTypeSource = new BehaviorSubject<any>('1');
  currentGovernanceType = this.governanceTypeSource.asObservable();

  countrySource = new BehaviorSubject<string>('44');
  currentCountry = this.countrySource.asObservable();

  selectedYear:any = ['2021'];

  mapSelectedCountry:any = "Australia";


  changeYear(message: string) {
      this.yearSource.next(message);
  }

  changeGovernanceType(message:any) {
      this.governanceTypeSource.next(message);
  }

  changeCountryType(message:any) {
      this.countrySource.next(message);
  }
}
