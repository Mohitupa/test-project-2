import { Component, OnInit } from '@angular/core';
import { ApiDataService } from 'src/app/services/api-data.service';
import { LocalDataService } from 'src/app/services/local-data.service';


@Component({
    selector: 'app-present-development',
    templateUrl: './present-development.component.html',
    styleUrls: ['./present-development.component.css'],
})
export class PresentDevelopmentComponent implements OnInit {
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
    presentDevelopmentData: any = [];

    constructor(private localDataService: LocalDataService, private apiDataService: ApiDataService) { }

    ngOnInit(): void {
        this.apiDataService.getCountriesData().subscribe((data) => {
            this.data2021 = data[2021];
            this.data2022 = data[2022];
            this.countryData = this.data2021.concat(this.data2022);
            this.country = this.localDataService.mapSelectedCountry;
            this.localDataService.showHeaderMenu.next(true);
            this.localDataService.governanceTypeSource.subscribe((governanceId) => {
                this.presentDevelopmentData = [];
                this.isLoading = true;
                this.singleCountryData = this.countryData.find((x: { name: any; }) => x.name === this.country);
                this.governance_id = governanceId;
                this.apiDataService.getViewData(this.governance_id, 1, this.singleCountryData.id).subscribe((responseData: any) => {
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
        this.presentDevelopmentData = v;
        this.isLoading = false;
    }

    ngOnDestroy(): void {
        this.localDataService.showHeaderMenu.next(false);
        this.localDataService.governanceTypeSource.unsubscribe;
    }
}
