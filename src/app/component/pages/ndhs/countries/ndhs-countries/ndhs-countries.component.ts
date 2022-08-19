import {Component, OnInit} from '@angular/core';
import { ApiDataService } from 'src/app/services/api-data.service';

@Component({
    selector: 'app-ndhs-countries',
    templateUrl: './ndhs-countries.component.html',
    styleUrls: ['./ndhs-countries.component.css'],
})
export class NdhsCountriesComponent implements OnInit {
    data2021: any;
    data2022: any;
    countries: any;
    constructor(private apiData: ApiDataService) {
     }

     ngOnInit(): void {
        this.apiData.getCountriesData().subscribe((data) => {
            this.data2021 = data[2021];
            this.data2022 = data[2022];
            console.log(this.data2021);
        })

        setTimeout(() => {
            this.countries = this.data2021;
        }, 2000);
     }
}
