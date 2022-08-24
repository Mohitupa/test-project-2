import { Component, OnInit } from '@angular/core';
import { ApiDataService } from 'src/app/services/api-data.service';
import { LocalDataService } from 'src/app/services/local-data.service';

@Component({
    selector: 'app-prospective-development',
    templateUrl: './prospective-development.component.html',
    styleUrls: ['./prospective-development.component.css'],
})
export class ProspectiveDevelopmentComponent implements OnInit {
    objectKeys = Object.keys;

    governance_id: any;
    viewData: any;
    country: any;
    data2021: any;
    data2022: any;
    countryData: any;
    singleCountryData: any;
    isLoading = true;
    ultimate_name: any;
    prospectiveDevelopmentData: any = [];

    constructor(private _utilities: LocalDataService, private apiDataService: ApiDataService) { }

    ngOnInit(): void {

        this.apiDataService.getCountriesData().subscribe((data) => {
            this.data2021 = data[2021];
            this.data2022 = data[2022];
            this.countryData = this.data2021.concat(this.data2022);
            this.country = this._utilities.mapSelectedCountry;
            this._utilities.showHeaderMenu.next(true);
            this._utilities.governanceTypeSource.subscribe((governanceId) => {
                this.prospectiveDevelopmentData = [];
                this.isLoading = true;
                this.singleCountryData = this.countryData.find((x: { name: any; }) => x.name === this.country);
                this.governance_id = governanceId;

                this.apiDataService.getViewData(this.governance_id, 2, this.singleCountryData.id, this.singleCountryData.year).subscribe((responseData: any) => {
                    this.viewData = responseData;
                    this.getViewInfo();
                })
            });
        })
    }

    getViewInfo() {
        var v: any;
        for (const [key, val] of Object.entries(this.viewData)) {
            v = val;
        }
        this.ultimate_name = Object.keys(v);
        this.prospectiveDevelopmentData = v;
        this.isLoading = false;
    }

    ngOnDestroy(): void {
        this._utilities.showHeaderMenu.next(false);
        this._utilities.governanceTypeSource.unsubscribe;
    }
}
