import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalDataService {
  showHeaderMenu = new Subject<boolean>();
  governanceTypeSource = new BehaviorSubject<any>('1');
  currentGovernanceType = this.governanceTypeSource.asObservable();
  selectedYear:any = ['2021'];
  mapSelectedCountry:any = "Australia";
  mapData2CountryData:any = []
}
