import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as echarts from 'echarts';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

import { ApiDataService } from 'src/app/services/api-data.service';
import { LocalDataService } from 'src/app/services/local-data.service';
import { FormControl, FormGroup } from '@angular/forms';

import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-comparative-result-detail',
  templateUrl: './comparative-result-detail.component.html',
  styleUrls: ['./comparative-result-detail.component.css'],
})
export class ComparativeResultDetailComponent implements OnInit {

  objectKeys = Object.keys;
  data2021: any;
  data2022: any;
  countryData: any;
  toppings: any = new FormControl();
  year: any;
  root: any;
  mapCountryData: any = [];
  dash_array: any = [1, 2, 3, 4, 5];
  math = Math.round;
  development_name:any;
  ultimate_name:any;

  @ViewChild('mySelect') mySelect: ElementRef | any;

  country_ids: any;
  development_type: any = [];
  viewDataAvalability: any = [];

  toggleProspective(ev: any) {
    $('#prospective_development li:first').addClass('active');
    $('#prospective_development ul li:first').addClass('activelink');
    this.comaprativeResultMain(ev)
  }

  togglePresent(ev: any) {
    $('#present_development li:first').addClass('active');
    $('#present_development ul li:first').addClass('activelink');
    this.comaprativeResultMain(ev)
  }

  isValue: number = 0;

  toggle(num: number) {
    this.isValue = num;
  }

  ultimateSelection(v: any) {
    this.comaprativeResultMain(v);
  }

  constructor(
    private _formBuilder: FormBuilder,
    private router: Router,
    private apiDataService: ApiDataService,
    private localDataService: LocalDataService
  ) { }

  ngOnInit(): void {
    $(document).ready(function () {
      $('.vertical-tab-area').toggleClass('open');
      $('.main-li li:first').addClass('active');
      $('.main-li ul li:first').addClass('activelink');
      $('.toggle-tab-button > button').on('click', function () {
          $('.vertical-tab-area').toggleClass('open');
      });
      $('.sub-category li, .parent-li').click(function () {
          $('.sub-category li, .parent-li').removeClass('activelink');
          $(this).addClass('activelink');
      });
  });


    this.apiDataService.getCountriesData().subscribe((data) => {

      this.year = this.localDataService.selectedYear;
      if (this.year[0] == '2021' && this.year.length == 1) {
        this.country_ids = environment.default_country_2021;
        this.countryData = data[2021];
      } else if (this.year[0] == '2022' && this.year.length == 1) {
        this.country_ids = environment.default_country_2022;
        this.countryData = data[2022];
      } else {
        this.country_ids = environment.default_country_2021;
        this.data2021 = data[2021];
        this.data2022 = data[2022];
        this.countryData = this.data2021.concat(this.data2022);
      }
      let default_contry = {
        countries: this.country_ids
      }

      this.apiDataService.getdefaultCountry(default_contry).subscribe((data: any) => {
        for (let i = 0; i < 2; i++) {
          data[i]['id'] = data[i]['country_id']
          data[i]['name'] = data[i]['country_name']
          delete data[i]['country_name'];
        }
        if (data) {
          if (this.localDataService.mapData2CountryData.length == 2) {
            this.mapCountryData = this.localDataService.mapData2CountryData;
          } else {
            this.mapCountryData = data;
          }
        }
      })
    });
    this.informationReport()
    this.topcountriesChart()
    this.comaprativeResultMain(1)
  }


  selectedCountryArray(ev: any) {

    if (ev['value'].length < 3 || ev['value'].length < 2) {
      this.mapCountryData = ev['value'];
      this.mySelect.close();
    } else {
      if (ev['value'].length > 2) {
        ev['value'].splice(0, 1)
        console.log(ev['value']);
        this.toppings.setValue(ev['value']);
        this.mapCountryData = ev['value'];
      }
      this.mySelect.close();
    }
  }

  comparativeResultSelectedMapData(countryData: any, selected: any) {
    console.log(this.mapCountryData);
  }

  taxonomy: any = [];
  taxonomy1: any = [];
  ulitimate1 : any = [];
  ulitimate2 : any = [];

  comaprativeResultMain(val: any) {
    this.development_name = [];
    this.ultimate_name = [];
    this.viewDataAvalability = [];

    let data = {
      countries: "74,228",
      governances: "1",
      year: "2021"
    };
    this.apiDataService.getComparativeOverview(data).subscribe((result: any) => {
      console.log(result);
      var v: any = [];
      for (const [key, val] of Object.entries(result)) {
        this.development_type.push(key);
        v.push(val);
      }
      for (const [key1, val1] of Object.entries(v[0])) {
        this.ulitimate1.push(key1);
        this.taxonomy.push(val1)
      }
      for (const [key1, val1] of Object.entries(v[1])) {
        this.ulitimate2.push(key1);
        this.taxonomy1.push(val1)
      }      

      if (val == 1) {
        this.development_name = this.development_type[0];
        this.ultimate_name = this.ulitimate1[1];
        this.viewDataAvalability = this.taxonomy[1];
      }
      if (val == 2) {
        this.development_name = this.development_type[0];
        this.ultimate_name = this.ulitimate1[0];
        this.viewDataAvalability = this.taxonomy[0];
      }
      if (val == 3) {
        this.development_name = this.development_type[1];
        this.ultimate_name = this.ulitimate2[1];
        this.viewDataAvalability = this.taxonomy1[1];
      }
      if (val == 4) {
        this.development_name = this.development_type[1];
        this.ultimate_name = this.ulitimate2[0];
        this.viewDataAvalability = this.taxonomy1[0];
      }
    })
  }
  viewInfo(viewInfo: any) {
    throw new Error('Method not implemented.');
  }




  reportData: any;
  informationReport() {
    let data = {
      countries: "74,228",
      developmentId: 1,
      governanceId: "1",
      ultimateId: 2,
      year: "2021",
    };
    this.apiDataService.getComparativeInformation(data).subscribe((data: any) => {
      this.reportData = data;
    })
  }

  topcountriesChart() {
    let data = {
      developmentId: 1,
      governances: "1",
      taxonomyId: 1,
      ultimateId: 2,
      year: "2021"
    };
    this.apiDataService.getTopCountriesData(data).subscribe((result: any) => {

      let chartValue: any = [];
      for (let i = 0; i < result.length; i++) {
        chartValue.push([[result[i].country_name], [result[i].score]]);
      }

      var chartDom: any = document.getElementById('resultDetailBarChart');
      var myChart = echarts.init(chartDom);
      var option;

      option = {
        title: {
          text: "taxonomy_name",
          textStyle: {
            fontSize: 12
          }
        },
        legend: {
          orient: 'vertical',
          right: 0,
          top: 0,
          textStyle: {
            fontSize: 11
          }
        },
        tooltip: {},
        dataset: [
          {
            dimensions: ['country_name', result[0].ultimate_field],
            source: chartValue
          },
          {
            transform: {
              type: 'sort',
              config: { dimension: 'score', order: 'desc' }
            }
          }
        ],

        xAxis: {
          type: "category",
          axisLabel: {
            interval: 0,
            rotate: 30,
            textStyle: {
              fontSize: 10
            }
          },
        },
        yAxis: {},
        series: [
          {
            type: 'bar',
            itemStyle: {
              borderRadius: [6, 6, 0, 0],
              color: '#5200FF'
            },
          },
        ],
        grid: { containLabel: true },
      };
      option && myChart.setOption(option);
    })
  }


}
