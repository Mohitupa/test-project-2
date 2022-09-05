import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiDataService } from 'src/app/services/api-data.service';
import { LocalDataService } from 'src/app/services/local-data.service';

@Component({
    selector: 'app-data-modal',
    templateUrl: './data-modal.component.html',
    styleUrls: ['./data-modal.component.css'],
})
export class DataModalComponent implements OnInit {
    ndhs_details: any = [];
    entries: any;

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
    modelData: any = [];

    constructor(
        private apiDataService: ApiDataService,
        public dialogRef: MatDialogRef<DataModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private localDataService: LocalDataService
    ) { }

    ngOnInit(): void {
        this.apiDataService.getCountriesData().subscribe((data) => {
            this.data2021 = data[2021];
            this.data2022 = data[2022];
            this.countryData = this.data2021.concat(this.data2022);
            this.country = this.localDataService.mapSelectedCountry;
            this.singleCountryData = this.countryData.find((x: { name: any; }) => x.name === this.country);
            this.apiDataService.getViewData(this.data[0].governance_id, this.data[0].development_id, this.singleCountryData.id).subscribe((responseData) => {
                this.modelData = [];
                this.viewData = responseData;
                this.getViewInfo();
            })
        })
    }

    getViewInfo() {
        var v: any;
        for (const [key, val] of Object.entries(this.viewData)) {
            v = val;
        }
        this.ultimate_name = Object.keys(v);
        this.modelData = v;
    }

}
