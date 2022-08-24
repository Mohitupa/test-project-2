import { Component } from '@angular/core';
import { Router } from '@angular/router';

import * as am5 from '@amcharts/amcharts5';
import * as am5map from '@amcharts/amcharts5/map';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldLow';
import * as echarts from 'echarts';
import * as $ from "jquery";
import { ApiDataService } from 'src/app/services/api-data.service';
import { LocalDataService } from 'src/app/services/local-data.service';
import { FormControl } from '@angular/forms';
import { valueToRelative } from '@amcharts/amcharts4/.internal/core/utils/Utils';

@Component({
  selector: 'app-comparative-result',
  templateUrl: './comparative-result.component.html',
  styleUrls: ['./comparative-result.component.css'],
})
export class ComparativeResultComponent {
  data2021: any;
  data2022: any;
  countryData: any;
  toppings: any = new FormControl();
  year: any;
  root: any;
  mapCountryData: any = [];

  constructor(private router: Router, private apiDataService: ApiDataService, private localDataService: LocalDataService) { }

  ngOnInit(): void {
    this.apiDataService.getCountriesData().subscribe((data) => {
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
      this.comparativeResultMap();
      this.comparativeResultNetworkChart();
    });
  }

  ngAfterViewInit() {

  }

  comparativeResultSelectedMapData(countryData: any, selected: any) {
    console.log(countryData);
    console.log(selected._selected);
    if (selected._selected) {
      this.mapCountryData.push(countryData);
    } else {
      this.mapCountryData.splice(this.mapCountryData.indexOf(countryData), 1);
    }
    console.log(this.mapCountryData);
    this.comparativeResultMap();
  }

  comparativeResultMap() {
    am5.array.each(am5.registry.rootElements, function (root) {
      if (root && root.dom && root.dom.id == 'chartdiv10') {
        root.dispose();
      }
    });

    let cities = [
      {
        flag: "in.png",
        id: 103,
        iso_code: "IN",
        lat: "20.593684",
        lng: "78.96288",
        name: "India",
        year: 2021,
      },
      {
        flag: "us.png",
        id: 228,
        iso_code: "US",
        lat: "37.09024",
        lng: "-95.712891",
        name: "USA",
        year: 2021,
      }
    ];

    if (this.mapCountryData != "") {
      cities = this.mapCountryData;
    }

    this.root = am5.Root.new("chartdiv10");
    this.root._logo.dispose();

    this.root.setThemes([
      am5themes_Animated.new(this.root)
    ]);

    let chart = this.root.container.children.push(
      am5map.MapChart.new(this.root, {
        panX: "none",
        panY: "none",
        wheelX: 'none',
        wheelY: 'none',
        projection: am5map.geoMercator()
      })
    );

    let backgroundSeries = chart.series.push(am5map.MapPolygonSeries.new(this.root, {}));
    backgroundSeries.mapPolygons.template.setAll({
      fill: this.root.interfaceColors.get("alternativeBackground"),
      fillOpacity: 0,
      strokeOpacity: 0
    });


    let lineSeries = chart.series.push(am5map.MapLineSeries.new(this.root, {}));
    lineSeries.mapLines.template.setAll({
      stroke: this.root.interfaceColors.get("alternativeBackground"),
      strokeOpacity: 0.3
    });

    //create background series
    let colors = am5.ColorSet.new(this.root, {});
    let worldSeries = chart.series.push(am5map.MapPolygonSeries.new(this.root, {
      geoJSON: am5geodata_worldLow,
      exclude: ["AQ"]
    }));

    worldSeries.mapPolygons.template.setAll({
      interactive: true,
      fill: am5.color(0xDDDDDD),
      tooltipText: "{name}",
      templateField: "polygonSettings"
    });

    am5.array.each(cities, (c: any) => {

      let country_iso_codes = [];
      country_iso_codes.push(c.iso_code);
      worldSeries = chart.series.push(
        am5map.MapPolygonSeries.new(this.root, {
          geoJSON: am5geodata_worldLow,
          include: country_iso_codes,
          name: c.name,
          fill: am5.color(0x84abbd),
          flag: '/assets/flags/' + c.flag,
        })
      );

      worldSeries.mapPolygons.template.setAll({
        interactive: true,
        fill: am5.color(0xe6e6e6),
        tooltip: am5.Tooltip.new(this.root, {
          getFillFromSprite: false,
          paddingBottom: 0,
          paddingRight: 0,
          paddingLeft: 0,
          paddingTop: 0,
        }),
        tooltipHTML: `
        <div style="width:130px;text-align:center; background:#fff; padding:10px; box-shadow: 0px 5px 10px rgba(111, 111, 111, 0.2); border-radius:4px; border-radius:1px;">
            <img src="{flag}" width="20px" height="20px" style="border-radius:50%"><br>
            <span style="color:rgba(0, 0, 0, 0.32);font-size:12px;">{name}</span><div style="text-align:center;width:100%;display: flex;justify-content: center;"></div>
        </div>
        `,
        showTooltipOn: "always",
      });

      worldSeries.mapPolygons.template.states.create("hover", {
        showTooltipOn: "false",
      });
    });

    let pointSeries = chart.series.push(am5map.MapPointSeries.new(this.root, {}));

    pointSeries.bullets.push(() => {
      let container = am5.Container.new(this.root, {});

      let circle2 = container.children.push(
        am5.Circle.new(this.root, {
          radius: 3,
          tooltipY: 0,
          fill: am5.color(0xED322C),
          strokeOpacity: 0,
          // tooltip: am5.Tooltip.new(this.root, {
          //   paddingBottom: 0,
          //   paddingRight: 0,
          //   paddingLeft: 0,
          //   paddingTop: 0
          // }),
          // tooltipHTML: `
          // <div style="width:130px;text-align:center; background:#fff; padding:10px; box-shadow: 0px 5px 10px rgba(111, 111, 111, 0.2); border-radius:4px; border-radius:1px;">
          //     <img src="{flag}" width="20px" height="20px" style="border-radius:50%"><br>
          //     <span style="color:rgba(0, 0, 0, 0.32);font-size:12px;">{title}</span><div style="text-align:center;width:100%;display: flex;justify-content: center;"></div>
          // </div>
          //     `
        })
      );

      circle2.states.create("hover", {
        radius: 3,
        scale: 2,
        strokeWidth: 3,
        strokeOpacity: 5,
        stroke: am5.color(0xff7b7b),
      });

      return am5.Bullet.new(this.root, {
        sprite: container
      });
    });

    for (var i = 0; i < cities.length; i++) {
      let city: any = cities[i];
      addCity(city.lng, city.lat, city.name, city.flag);
    }

    function addCity(longitude: number, latitude: number, title: string, flag: string) {
      pointSeries.data.push({
        geometry: { type: "Point", coordinates: [longitude, latitude] },
        title: title,
        flag: "../../assets/flags/" + flag
      });
    }

    chart.appear(1000, 100);
  }

  public toDiffrentPage() {
    this.router.navigate(['/home']);
  }

  comparativeResultNetworkChart() {
    type EChartsOption = echarts.EChartsOption;

    var chartDom = document.getElementById('main12')!;
    var myChart = echarts.init(chartDom);
    var option: EChartsOption;

    interface GraphNode {
      symbolSize: number;
      label?: {
        show?: boolean;
      };
    }

    myChart.showLoading();
    $.getJSON('../../assets/data/network2.json', function (graph: any) {

      myChart.hideLoading();

      graph.nodes.forEach(function (node: GraphNode) {
        node.label = {
          show: node.symbolSize > 30
        };
      });
      option = {
        title: {
          text: '',
          subtext: '',
          top: 'bottom',
          left: 'right'
        },
        tooltip: {
          trigger: 'item',
          formatter: function (params: any) {
            if (params.data.name) {
              return params.name;
            }
            return;
          },
        },
        series: [
          {
            name: '',
            type: 'graph',
            layout: 'none',
            data: graph.nodes,
            links: graph.links,
            categories: graph.categories,
            roam: true,
            label: {
              color: '#fff',
              position: 'inside',
              align: 'center',
              formatter: '{b}',
              verticalAlign: 'middle',
              fontSize: '10'
            },
            lineStyle: {
              color: 'source',
              curveness: 0.3
            },
          }
        ]
      };
      myChart.setOption(option);
    });
  }

  selectedCountryArray(ev: any) {
    // console.log(ev);
    // console.log(this.toppings.value);
    console.log(ev['value']);

    // if(ev['value'].length < 3) {
    //   this.r = (ev['value'])
    //   console.log(ev['value']);
    // } else {
    //   this.toppings.value = this.r
    // console.log(this.toppings.value);

    // }
  }

}

