import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiDataService {

  apiUrl = "http://3.95.161.176:4000/";
<<<<<<< HEAD

  constructor(private http: HttpClient) { }

  getCountriesData(): Observable<any> {
    return this.http.get(
      this.apiUrl +
      "ndhs-master/countryList"
    );
  }

  public getPieChartDetails(
    governance_id: number,
    country_id: number,
    year: number
  ): Observable<any> {

    return this.http.get(
      this.apiUrl +
      'ndhs-master/details/' +
      governance_id +
      '/' +
      country_id +
      '/' +
      year
    );
=======
  
  constructor(private http: HttpClient) { }

  getCountriesData() : Observable<any> {   
    return this.http.get(this.apiUrl+"ndhs-master/countryList");
>>>>>>> 0ca5405dbc4c9f4306910749aa895cef5e264246
  }
}
