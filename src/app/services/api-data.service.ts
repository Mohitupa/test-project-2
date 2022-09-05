import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiDataService {

  apiUrl1 = "http://3.95.161.176:4000/";
  apiUrl = "http://localhost:3000/";

  constructor(private http: HttpClient) { }

  getCountriesData(): Observable<any> {
    return this.http.get(
      this.apiUrl1 +
      "ndhs-master/country-list?groupBy=year"
    );
  }

  public getPieChartDetails(
    governance_id: number,
    country_id: number,
    year: number
  ): Observable<any> {

    return this.http.get(
      this.apiUrl1 +
      'ndhs-master/governance-stats/' +
      governance_id +
      '/' +
      country_id +
      '/' +
      year
    );
  }


  public getViewData(
    governance_id: number,
    development_id: number,
    country_id: number
  ): Observable<any> {
    let data = { governanceId: governance_id, development_id: development_id, countries: country_id }
    return this.http.post(
      this.apiUrl1 + 'ndhs-master/overview',
      data
    );
  }

  public getdefaultCountry(data: any): Observable<any> {
    return this.http.post(this.apiUrl1 + 'ndhs-master/countries-with-year', data);
  }

  public getdefaultCountryYear(data: any): Observable<any> {
    return this.http.post(this.apiUrl1 + 'ndhs-master/countries-with-year', data);
  }

  public getComparativeResultData(data: any): Observable<any> {
    return this.http.post(this.apiUrl1 + 'ndhs-master/comparative', data);
  }


  public getComparativeOverview(data: any): Observable<any> {
    return this.http.post(
      this.apiUrl1 + 'ndhs-master/overview',
      data
    );
  }

  public getComparativeInformation(data: any): Observable<any> {
    return this.http.post(
      this.apiUrl1 + 'ndhs-master/comparative-information',
      data
    );
  }

  public getTopCountriesData(data: any): Observable<any> {
    return this.http.post(this.apiUrl1 + 'ndhs-master/top-countries', data);
  }

  public getTaxonomyTabledetails(data: any): Observable<any> {
    return this.http.post(this.apiUrl1 + 'ndhs-master/table-chart', data);
  }

  public getAllCountries(): Observable<any> {
    return this.http.get(this.apiUrl1 + 'ndhs-master/country-list' );
  }


  public getOverviewBarChart(data: any): Observable<any> {
    return this.http.post(this.apiUrl1 + 'ndhs-master/stats-graph', data);
  }


}
