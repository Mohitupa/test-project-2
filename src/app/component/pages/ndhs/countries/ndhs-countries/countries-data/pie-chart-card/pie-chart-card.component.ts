import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataModalComponent } from '../data-modal/data-modal.component';
import * as am4core from '@amcharts/amcharts4/core';

@Component({
    selector: 'pie-chart-card',
    templateUrl: './pie-chart-card.component.html',
    styleUrls: ['./pie-chart-card.component.css'],
})
export class PieChartCardComponent implements OnInit {
    @Input() cart:any;
    @Input() isLoading:any;
    @Input() pieData:any = [];
    taxonomy_name:any;
    development_name:any;
    radinessScore:any;
    availabilityScore:any;
    data:any;
    constructor(public dialog: MatDialog) {}

    ngOnInit(): void {
        setTimeout(() => {
            this.taxonomy_name = this.pieData[0].taxonomy_name;
            this.development_name = this.pieData[0].development_name;
            this.radinessScore = this.pieData[0].score;
            this.availabilityScore = this.pieData[1].score;
            this.data = this.pieData;
        },2100);
    }

    showData() {

        let dialogRef = this.dialog.open(DataModalComponent, {
            width: '80%',
            height: '90%',
            data: this.data,
        });
    }
}
