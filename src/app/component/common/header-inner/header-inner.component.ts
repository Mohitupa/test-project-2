import { Component, OnInit } from '@angular/core';
import { LocalDataService } from 'src/app/services/local-data.service';

@Component({
    selector: 'app-header-inner',
    templateUrl: './header-inner.component.html',
    styleUrls: ['./header-inner.component.css'],
})
export class HeaderInnerComponent implements OnInit {
    routeSubscription: any;
    currentRoute: any;
    showHeaderMenu: boolean = false;

    governance_id:any;

    constructor(private _utilities: LocalDataService) {}

    ngOnInit(): void {
        if(localStorage.getItem('governance_id') == null) {
            localStorage.setItem('governance_id', JSON.stringify(1));
        }

        this.governance_id = localStorage.getItem('governance_id');

        this._utilities.showHeaderMenu.subscribe((result) => {
            this.showHeaderMenu = result;
        });
        this._utilities.governanceTypeSource.subscribe((result) => {
            this.governance_id = result;
        });
    }

    dropDown2() {
        $('.toggleSubmenu2').next('ul').toggleClass('show');
    }
    dropDown1() {
        $('.toggleSubmenu1').next('ul').toggleClass('show');
    }
    isValue: number = 0;

    toggle(num: number) {
        this.isValue = num;
        this.governance_id = num;
        localStorage.setItem('governance_id', JSON.stringify(num));
        this._utilities.governanceTypeSource.next(num);

    }
}
