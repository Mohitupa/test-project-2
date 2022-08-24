import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ApiDataService } from 'src/app/services/api-data.service';

import { Router } from '@angular/router';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { LocalDataService } from 'src/app/services/local-data.service';

@Component({
    selector: 'app-ndhs-countries',
    templateUrl: './ndhs-countries.component.html',
    styleUrls: ['./ndhs-countries.component.css'],
})
export class NdhsCountriesComponent implements OnInit {
    data2021: any;
    data2022: any;
    countries: any;
    showFiller = false;
    pie0Loader = true;
    pie1Loader = true;
    pie2Loader = true;
    pie3Loader = true;
    pie0Data: any = [];
    pie1Data: any = [];
    pie2Data: any = [];
    pie3Data: any = [];
    ndhsPresentDevelopmentHealthIt: any = []
    ndhsProspectiveDevelopmentHealthIt: any;
    a = [1, 2, 3, 4, 5];
    b = [1, 2, 3, 4, 5, 6, 7];
    ndhsPresentDevelopmentDigital: any;
    ndhsProspectiveDevelopmentDigital: any;
    governanceId: any;
    countryData: any;
    singleCountryData: any;
    isLoading = true;
    year:any;

    constructor(private apiData: ApiDataService, private localDataService: LocalDataService) { }

    ngOnInit(): void {

        this.apiData.getCountriesData().subscribe((data) => {
            this.year = this.localDataService.selectedYear;
            let countriesYear = this.localDataService.mapSelectedCountry;
            if (this.year[0] == '2021' && this.year.length == 1) {
                this.countryData = data[2021];
            } else if (this.year[0] == '2022' && this.year.length == 1) {
                countriesYear = 'Chile';
                this.countryData = data[2022];
            } else {
                this.data2021 = data[2021];
                this.data2022 = data[2022];
                this.countryData = this.data2021.concat(this.data2022);
            }
           
            this.singleCountryData = this.countryData.find((x: { name: any; }) => x.name === countriesYear);
            this.localDataService.showHeaderMenu.next(true);

            this.localDataService.governanceTypeSource.subscribe((governanceId) => {

                this.governanceId = governanceId;

                this.apiData.getPieChartDetails(this.governanceId, this.singleCountryData.id, this.singleCountryData.year).subscribe((data: any) => {
                    if (this.governanceId == 1) {
                        this.ndhsPresentDevelopmentHealthIt = data['Present Development'];
                        this.ndhsProspectiveDevelopmentHealthIt = data['Prospective Development'];
                        this.presentHealthIt();
                        this.prospectiveHealthIt();
                    }
                    if (this.governanceId == 2) {
                        this.ndhsPresentDevelopmentDigital = data['Present Development'];
                        this.ndhsProspectiveDevelopmentDigital = data['Prospective Development'];
                        this.presentDigital();
                        this.prospectiveDigital();
                    }
                });
            });
            this.isLoading = false;
        })
    }

    selectCountry(country: any) {
        this.singleCountryData = country;
        this.localDataService.showHeaderMenu.next(true);
        this.localDataService.mapSelectedCountry = country.name;
        this.localDataService.governanceTypeSource.subscribe((governanceId) => {
            this.governanceId = governanceId;
            this.apiData.getPieChartDetails(this.governanceId, this.singleCountryData.id, this.singleCountryData.year).subscribe((data: any) => {
                if (this.governanceId == 1) {
                    this.ndhsPresentDevelopmentHealthIt = data['Present Development'];
                    this.ndhsProspectiveDevelopmentHealthIt = data['Prospective Development'];
                    this.presentHealthIt();
                    this.prospectiveHealthIt();
                }
                if (this.governanceId == 2) {
                    this.ndhsPresentDevelopmentDigital = data['Present Development'];
                    this.ndhsProspectiveDevelopmentDigital = data['Prospective Development'];
                    this.presentDigital();
                    this.prospectiveDigital();
                }
            });
        });
        this.isLoading = false;
    }


    presentHealthIt() {
        this.pie0Loader = true;
        am4core.useTheme(am4themes_animated);
        for (let i = 0; i < Object.keys(this.ndhsPresentDevelopmentHealthIt[0]).length; i++) {
            this.pie0Data.push(this.ndhsPresentDevelopmentHealthIt[0][i + 1]);
            let firstScore = Math.round(this.ndhsPresentDevelopmentHealthIt[0][i + 1][0].score / 2);
            let secondScore = Math.round(this.ndhsPresentDevelopmentHealthIt[0][i + 1][1].score / 2);
            let totalScore: any = firstScore + secondScore;
            let chart = am4core.create("peiChart0" + i, am4charts.PieChart3D);

            if (chart.logo) {
                chart.logo.disabled = true;
            }
            chart.hiddenState.properties.opacity = 0;
            chart.data = [
                {
                    country: "Readiness",
                    litres: firstScore
                },
                {
                    country: "Avaliability",
                    litres: secondScore
                },
                {
                    litres: (100 - totalScore)
                }
            ];

            chart.innerRadius = 40;
            chart.depth = 10;

            let series = chart.series.push(new am4charts.PieSeries3D());
            series.dataFields.value = "litres";
            series.dataFields.category = "country";

            series.colors.list = ["#3880B1", "#58D6AA", "#E2E2E4"].map(function (color) {
                return new (am4core.color as any)(color);
            });

            var label = series.createChild(am4core.Label);
            label.text = totalScore.toString() + "%";
            label.horizontalCenter = 'middle';
            label.verticalCenter = 'middle';
            label.fontSize = 26;

            series.ticks.template.events.on("ready", hideSmall);
            series.ticks.template.events.on("visibilitychanged", hideSmall);

            function hideSmall(ev: any) {
                if (ev.target.dataItem.hasProperties == false || ev.target.dataItem.dataContext.percentage == 0) {
                    ev.target.hide();
                }
                else {
                    ev.target.show();
                }
            }

            series.labels.template.text = "{country}";
            series.labels.template.maxWidth = 70;
            series.labels.template.fontSize = 9.4;
            series.labels.template.wrap = true;
            series.slices.template.tooltipText = "{category}";
        }
        this.pie0Loader = false;

    }

    prospectiveHealthIt() {
        this.pie1Loader = true;
        am4core.useTheme(am4themes_animated);
        for (let i = 0; i < Object.keys(this.ndhsProspectiveDevelopmentHealthIt[0]).length; i++) {
            let chart = am4core.create("peiChart1" + i, am4charts.PieChart3D);

            this.pie1Data.push(this.ndhsProspectiveDevelopmentHealthIt[0][i + 1]);

            let firstScore = Math.round(this.ndhsProspectiveDevelopmentHealthIt[0][i + 1][0].score / 2);
            let secondScore = Math.round(this.ndhsProspectiveDevelopmentHealthIt[0][i + 1][1].score / 2);
            let totalScore: any = firstScore + secondScore;

            if (chart.logo) {
                chart.logo.disabled = true;
            }

            chart.hiddenState.properties.opacity = 0;
            chart.data = [
                {
                    country: "Development Strategy",
                    litres: firstScore
                },
                {
                    country: "Capacity Building",
                    litres: secondScore
                },
                {
                    litres: (100 - totalScore)
                }
            ];

            chart.innerRadius = 40;
            chart.depth = 10;

            let series = chart.series.push(new am4charts.PieSeries3D());
            series.dataFields.value = "litres";
            series.dataFields.category = "country";

            series.colors.list = ["#3A5FFE", "#2F4770", "#E2E2E4"].map(function (color) {
                return new (am4core.color as any)(color);
            });

            var label = series.createChild(am4core.Label);
            label.text = totalScore.toString() + "%";
            label.horizontalCenter = 'middle';
            label.verticalCenter = 'middle';
            label.fontSize = 26;

            series.ticks.template.events.on("ready", hideSmall);
            series.ticks.template.events.on("visibilitychanged", hideSmall);
            series.labels.template.events.on("ready", hideSmall);
            series.labels.template.events.on("visibilitychanged", hideSmall);

            function hideSmall(ev: any) {
                if (ev.target.dataItem.hasProperties == false || ev.target.dataItem.dataContext.percentage == 0) {
                    ev.target.hide();
                }
                else {
                    ev.target.show();
                }
            }

            series.labels.template.text = "{country}";
            series.labels.template.maxWidth = 70;
            series.labels.template.fontSize = 9.4;
            series.labels.template.wrap = true;
            series.slices.template.tooltipText = "{category}";
        }
        this.pie1Loader = false;

    }

    presentDigital() {
        this.pie2Loader = true;
        am4core.useTheme(am4themes_animated);
        for (let i = 0; i < Object.keys(this.ndhsPresentDevelopmentDigital[0]).length; i++) {

            let y: any = Object.values(this.ndhsPresentDevelopmentDigital[0])

            this.pie2Data.push(y[i]);

            let firstScore = Math.round(y[i][0].score / 2);
            let secondScore = Math.round(y[i][1].score / 2);

            let totalScore: any = firstScore + secondScore;

            let chart = am4core.create("peiChart2" + i, am4charts.PieChart3D);

            if (chart.logo) {
                chart.logo.disabled = true;
            }
            chart.hiddenState.properties.opacity = 0;
            chart.data = [
                {
                    country: "Readiness",
                    litres: firstScore
                },
                {
                    country: "Avaliability",
                    litres: secondScore
                },
                {
                    litres: (100 - totalScore)
                }
            ];

            chart.innerRadius = 40;
            chart.depth = 10;

            let series = chart.series.push(new am4charts.PieSeries3D());
            series.dataFields.value = "litres";
            series.dataFields.category = "country";

            series.colors.list = ["#71ADB5", "#38914F", "#E2E2E4"].map(function (color) {
                return new (am4core.color as any)(color);
            });

            var label = series.createChild(am4core.Label);
            label.text = totalScore.toString() + "%";
            label.horizontalCenter = 'middle';
            label.verticalCenter = 'middle';
            label.fontSize = 26;

            series.ticks.template.events.on("ready", hideSmall);
            series.ticks.template.events.on("visibilitychanged", hideSmall);
            series.labels.template.events.on("ready", hideSmall);
            series.labels.template.events.on("visibilitychanged", hideSmall);

            function hideSmall(ev: any) {
                if (ev.target.dataItem.hasProperties == false || ev.target.dataItem.dataContext.percentage == 0) {
                    ev.target.hide();
                }
                else {
                    ev.target.show();
                }
            }

            series.labels.template.text = "{country}";
            series.labels.template.maxWidth = 70;
            series.labels.template.fontSize = 9.4;
            series.labels.template.wrap = true;
            series.slices.template.tooltipText = "{category}";
        }
        this.pie2Loader = false;
    }

    prospectiveDigital() {
        this.pie3Loader = true;
        am4core.useTheme(am4themes_animated);
        for (let i = 0; i < Object.keys(this.ndhsProspectiveDevelopmentDigital[0]).length; i++) {

            let y: any = Object.values(this.ndhsProspectiveDevelopmentDigital[0])

            this.pie3Data.push(y[i]);
            let firstScore = Math.round(y[i][0].score / 2);
            let secondScore = Math.round(y[i][1].score / 2);

            let totalScore: any = firstScore + secondScore;


            let chart = am4core.create("peiChart3" + i, am4charts.PieChart3D);

            if (chart.logo) {
                chart.logo.disabled = true;
            }
            chart.hiddenState.properties.opacity = 0;
            chart.data = [
                {
                    country: "Development Strategy",
                    litres: firstScore
                },
                {
                    country: "Capacity Building",
                    litres: secondScore
                },
                {
                    litres: (100 - totalScore)
                }
            ];

            chart.innerRadius = 40;
            chart.depth = 10;

            let series = chart.series.push(new am4charts.PieSeries3D());
            series.dataFields.value = "litres";
            series.dataFields.category = "country";

            series.colors.list = ["#55CDAA", "#41565A", "#E2E2E4"].map(function (color) {
                return new (am4core.color as any)(color);
            });

            var label = series.createChild(am4core.Label);
            label.text = totalScore.toString() + '%';
            label.horizontalCenter = 'middle';
            label.verticalCenter = 'middle';
            label.fontSize = 26;

            series.ticks.template.events.on("ready", hideSmall);
            series.ticks.template.events.on("visibilitychanged", hideSmall);
            series.labels.template.events.on("ready", hideSmall);
            series.labels.template.events.on("visibilitychanged", hideSmall);

            function hideSmall(ev: any) {
                if (ev.target.dataItem.hasProperties == false || ev.target.dataItem.dataContext.percentage == 0) {
                    ev.target.hide();
                }
                else {
                    ev.target.show();
                }
            }

            series.labels.template.text = "{country}";
            series.labels.template.maxWidth = 70;
            series.labels.template.fontSize = 9.4;
            series.labels.template.wrap = true;
            series.slices.template.tooltipText = "{category}";
        }
        this.pie3Loader = false;
    }

    ngOnDestroy(): void {
        this.localDataService.showHeaderMenu.next(false);
        this.localDataService.governanceTypeSource.unsubscribe;
    }
}

