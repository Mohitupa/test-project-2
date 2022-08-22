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
    @Input() card:any;
    @Input() isLoading:any;
    @Input() pieData:any = [];
    taxonomy_name:any = [];
    development_name:any;
    constructor(public dialog: MatDialog) {}

    ngOnInit(): void {
        setTimeout(() => {
            console.log(this.pieData);
            this.taxonomy_name = this.pieData.taxonomy_name;
            this.development_name = this.pieData.development_name;
        },2100);
    }
}
