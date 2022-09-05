import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as echarts from 'echarts';
import { environment } from 'src/environments/environment';

import { ApiDataService } from 'src/app/services/api-data.service';
import { LocalDataService } from 'src/app/services/local-data.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-comparative-result-detail',
  templateUrl: './comparative-result-detail.component.html',
  styleUrls: ['./comparative-result-detail.component.css'],
})

export class ComparativeResultDetailComponent implements OnInit {

  @ViewChild('mySelect') mySelect: ElementRef | any;
  
  mySelections: any = []
  resultDetailBarChart: any;
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
  development_name: any;
  ultimate_name: any;
  governace_Id: any;
  isLoading = true;
  showChanger = true;
  country_ids: any;
  development_type: any = [];
  viewDataAvalability: any = [];
  taxonomy_id: any;
  taxonomy_name: any;
  ultimateId: any = [];
  developmentId: any = [];
  isValue: number = 0;
  taxonomy: any = [];
  taxonomy1: any = [];
  ulitimate1: any = [];
  ulitimate2: any = [];
  reportData: any;
  option: any = [];

  constructor(
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
      this.localDataService.showHeaderMenu.next(true);
      this.localDataService.governanceTypeSource.subscribe((governanceId) => {
        this.governace_Id = governanceId;
        this.ultimateId = environment.default_ultimate_id;
        this.developmentId = environment.default_development_id;
       

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
          this.mySelections = [this.mapCountryData[0].id, this.mapCountryData[1].id];
          this.comaprativeResultMain(1)
        })
      })
    });
    this.toppings.setValue(this.mySelections);
  }

  hideChanger() {
    this.showChanger = !this.showChanger
  }

  toggleProspective(ev: any, development_id: number, ultimate_id: number) {
    $('#prospective_development li:first').addClass('active');
    $('#prospective_development ul li:first').addClass('activelink');
    this.developmentId = development_id;
    this.ultimateId = ultimate_id;
    this.comaprativeResultMain(ev)
  }

  togglePresent(ev: any, development_id: number, ultimate_id: number) {
    $('#present_development li:first').addClass('active');
    $('#present_development ul li:first').addClass('activelink');
    this.developmentId = development_id;
    this.ultimateId = ultimate_id;
    this.comaprativeResultMain(ev)
  }

  toggle(num: number) {
    this.isValue = num;
  }

  ultimateSelection(v: any, development_id: number, ultimate_id: number) {
    this.developmentId = development_id;
    this.ultimateId = ultimate_id;
    this.comaprativeResultMain(v);
  }

  

  selectedCountryArray(ev: any) {
    this.localDataService.governanceTypeSource.subscribe((governanceId) => {

     let tamp = [];
      for(let i=0;i<ev['value'].length; i++) {
        tamp.push(this.countryData.find((x:any) => x.id === ev['value'][i]))
      }
      ev['value'] = [];
      ev['value'] = tamp;

      if (ev['value'].length < 3 || ev['value'].length < 2) {
        this.mapCountryData = ev['value'];
        this.mySelect.close();
      } else {
        if (ev['value'].length > 2) {
          ev['value'].splice(0, 1)
          this.toppings.setValue(ev['value']);
          this.mapCountryData = ev['value'];
        }
        this.mySelect.close();
      }
      if (this.mapCountryData.length == 2) {
        this.comaprativeResultMain(1)
      }
      
    });
  }

  comaprativeResultMain(val: any) {
    this.isLoading = true;
    this.development_name = [];
    this.ultimate_name = [];
    this.viewDataAvalability = [];
    this.taxonomy = [];
    this.taxonomy1 = [];
    this.ulitimate1 = [];
    this.ulitimate2 = [];
    let data: any = [];
    data = {
      countries: this.mapCountryData[0].id + "," + this.mapCountryData[1].id,
      governanceId: this.governace_Id.toString()
    };

    this.apiDataService.getComparativeOverview(data).subscribe((result: any) => {

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

      // console.log(this.taxonomy)
      // console.log(this.taxonomy1)
      // console.log(this.ulitimate1)
      // console.log(this.ulitimate2)
      // let av:any = [];
      // for (const [key1, val1] of Object.entries(this.taxonomy[1])) {
      //   let y:any = val1
      //   for (const [key, val] of Object.entries(y)) {
      //     let t:any = val;  
      //     for (const [key4, val4] of Object.entries(t)) {
         
      //         av.push(val4)
      //         console.log(val4)
            
      //     }
      //   }
      // } 
      // console.log(av)
      
     

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

      this.informationReport()
    })
  }

  topCountries(data: any) {
    this.taxonomy_id = data.taxonomy_id;
    this.taxonomy_name = data.taxonomy;
    this.topcountriesChart();
  }

  informationReport() {

    this.reportData = [];
    let data: any = [];
    data = {
      countries: this.mapCountryData[0].id + "," + this.mapCountryData[1].id,
      developmentId: this.developmentId,
      ultimateId: this.ultimateId,
      governanceId: this.governace_Id,
    };
    this.apiDataService.getComparativeInformation(data).subscribe((data: any) => {
      this.reportData = data;
      this.taxonomy_id = data[0].taxonomy_id;
      this.taxonomy_name = data[0].taxonomy;
      this.topcountriesChart()
    })
  }

  topcountriesChart() {
    let taxonomy: any;
    if (this.taxonomy_id == 0) {
      taxonomy = (this.governace_Id == 1) ? environment.default_taxonomy_general : environment.default_taxonomy_digital;
    } else {
      taxonomy = this.taxonomy_id;
    }
    let data = {
      developmentId: this.developmentId,
      governanceId: this.governace_Id,
      taxonomyId: taxonomy,
      ultimateId: this.ultimateId,
      year: "2021,2022"
    };

    this.apiDataService.getTopCountriesData(data).subscribe((result: any) => {

      let chartValue: any = [];
      for (let i = 0; i < result.length; i++) {
        chartValue.push([[result[i].country_name], [result[i].score]]);
      }

      var chartDom: any;
      chartDom = document.getElementById('resultDetailBarChart');

      this.option = {
        title: {
          text: this.taxonomy_name,
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
        dataset: [
          {
            dimensions: ['country_name', "Availability"],
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
      this.isLoading = false;
      this.resultDetailBarChart = this.option;
    })
  }
  ngOnDestroy(): void {
    this.localDataService.showHeaderMenu.next(false);
    this.localDataService.governanceTypeSource.unsubscribe;
  }
}
