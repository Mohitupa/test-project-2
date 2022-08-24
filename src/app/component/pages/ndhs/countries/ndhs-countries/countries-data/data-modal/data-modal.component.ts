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
    ndhs_details:any=[];
    entries:any;
    constructor(
        private apiDataService: ApiDataService,
        public dialogRef: MatDialogRef<DataModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _utilities: LocalDataService
    ) {}

    ngOnInit(): void {
        console.log(this.data);        
    }
    // objectKeys = Object.keys;
    // governance_id: any;
    // viewData: any;
    // country: any;
    // data2021: any;
    // data2022: any;
    // countryData: any;
    // singleCountryData: any;
    // isLoading = true;
    // ultimate_name: any;
    // presentDevelopmentData: any = [];

    // ngOnInit(): void {
    //     this.apiDataService.getCountriesData().subscribe((data) => {
    //         this.data2021 = data[2021];
    //         this.data2022 = data[2022];
    //         this.countryData = this.data2021.concat(this.data2022);
    //         this.country = this._utilities.mapSelectedCountry;
    //         this._utilities.showHeaderMenu.next(true);
    //         this._utilities.governanceTypeSource.subscribe((governanceId) => {
    //             this.presentDevelopmentData = [];
    //             this.isLoading = true;
    //             this.singleCountryData = this.countryData.find((x: { name: any; }) => x.name === this.country);
    //             this.governance_id = governanceId;
    //             this.apiDataService.getViewData(this.governance_id, 1, this.singleCountryData.id, this.singleCountryData.year).subscribe((responseData: any) => {
    //                 this.viewData = responseData;
    //                 this.getViewInfo();
    //             })
    //         });
    //     })
    // }

    // getViewInfo() {
    //     var v: any;
    //     for (const [key, val] of Object.entries(this.viewData)) {
    //         v = val;
    //     }
    //     this.ultimate_name = Object.keys(v);
    //     this.presentDevelopmentData = v;
    //     this.isLoading = false;
    // }

    // ngOnDestroy(): void {
    //     this._utilities.showHeaderMenu.next(false);
    //     this._utilities.governanceTypeSource.unsubscribe;
    // }
  
}
