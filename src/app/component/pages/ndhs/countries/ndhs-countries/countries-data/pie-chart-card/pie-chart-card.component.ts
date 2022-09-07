import { AfterContentInit, AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataModalComponent } from '../data-modal/data-modal.component';

@Component({
    selector: 'pie-chart-card',
    templateUrl: './pie-chart-card.component.html',
    styleUrls: ['./pie-chart-card.component.css'],
})
export class PieChartCardComponent {
    @Input() cart: any;
    @Input() isLoading: any;
    @Input() pieData: any = [];
    taxonomy_name: any;
    development_name: any;
    radinessScore: any;
    availabilityScore: any;
    data: any;
    constructor(public dialog: MatDialog) { }

    showData() {
        let dialogRef = this.dialog.open(DataModalComponent, {
            width: '80%',
            height: '90%',
            data: this.pieData,
        });
    }
}
