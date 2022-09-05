import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as echarts from 'echarts';
import * as $ from "jquery";


// amCharts imports
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";

import * as am4core from "@amcharts/amcharts4/core";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as am4plugins_forceDirected from "@amcharts/amcharts4/plugins/forceDirected";
import { ApiDataService } from 'src/app/services/api-data.service';
import { LocalDataService } from 'src/app/services/local-data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-comparative-overview',
  templateUrl: './comparative-overview.component.html',
  styleUrls: ['./comparative-overview.component.css'],
})
export class ComparativeOverviewComponent implements OnInit {

  chartTitle: any = 'Bubble Chart';
  chartOptionRadar: any;
  taxonomy_id: any = [];
  year: any;
  country_ids: any = [];

  governace_Id: any;
  ultimateId: any;
  developmentId: any = [];
  mapCountryData: any = [];
  dash_array: any = [];
  indicator_val: any = [];
  question_val: any = [];
  math = Math.round;
  test = true;
  radarData: any = [];
  radarCountry1: any = [];
  radarCountry2: any = [];
  rangeB30: any = [];
  rangeB60: any = [];
  rangeB80: any = [];
  rangeB100: any = [];
  taxonomy_result: any = [];
  rangeBr30: any = [];
  rangeBr60: any = [];
  rangeBr80: any = [];
  rangeBr100: any = [];
  barData: any = [];
  p30: any = [];
  p60: any = [];
  p80: any = [];
  p100: any = [];

  constructor(
    private apiDataService: ApiDataService,
    private localDataService: LocalDataService
  ) { }

  ngOnInit(): void {
    this.dash_array = [1, 2, 3, 4, 5];
    this.ultimateId = environment.default_ultimate_id;
    this.developmentId = environment.default_development_id;
    $(document).ready(function () {
      $('.toggle-tab-button > button').on('click', function () {
        $('.vertical-tab-area').toggleClass('open');
      });
      $('.sub-category li, .parent-li').click(function () {
        $('.sub-category li, .parent-li').removeClass('activelink');
        $(this).addClass('activelink');
        var tagid = $(this).data('tag');
        $('.list').removeClass('active').addClass('hide');
        $('#' + tagid)
          .addClass('active')
          .removeClass('hide');
      });
    });


    this.apiDataService.getCountriesData().subscribe((data) => {

      this.year = this.localDataService.selectedYear;
      if (this.year[0] == '2021' && this.year.length == 1) {
        this.country_ids = environment.default_country_2021;
      } else if (this.year[0] == '2022' && this.year.length == 1) {
        this.country_ids = environment.default_country_2022;
      } else {
        this.country_ids = environment.default_country_2021;
      }
      let default_contry = {
        countries: this.country_ids
      }
      this.localDataService.showHeaderMenu.next(false);
      this.localDataService.governanceTypeSource.subscribe((governanceId) => {

        this.governace_Id = governanceId;
        this.ultimateId = environment.default_ultimate_id;
        this.developmentId = environment.default_development_id;
        if (this.governace_Id == 1) {
          this.taxonomy_id = environment.default_taxonomy_general;
        } else {
          this.taxonomy_id = environment.default_taxonomy_digital;
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

          this.comparativeResultNetworkChart();
          this.taxonomyTableDetails();
          this.overviewRadarChart();
          this.overviewBarChart();
          this.overviewBubbleChart()
        })
      })
    });
  }



  hide() {
    if (this.chartTitle == 'Bubble Chart') {
      this.chartTitle = 'Bar Chart'
    } else {
      this.chartTitle = 'Bubble Chart'
    }
    this.test = !this.test
  }

  comparativeResultNetworkChart() {
    type EChartsOption = echarts.EChartsOption;

    var chartDom = document.getElementById('comparativeNetworkChart')!;
    var myChart = echarts.init(chartDom);
    var option: EChartsOption;

    interface GraphNode {
      symbolSize: number;
      label?: {
        show?: boolean;
      };
    }

    myChart.showLoading();
    $.getJSON('../../assets/data/network.json', (graph: any) => {

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
        legend: [{}],
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

      myChart.on('click', (params) => {
        if (params.borderColor == undefined) {
          let test = JSON.stringify(params.data);
          let d_info = JSON.parse(test);
          this.developmentId = d_info.d_id;
          this.governace_Id = d_info.g_id;
          this.ultimateId = d_info.u_id;
          this.taxonomy_id = d_info.t_id;
          this.taxonomyTableDetails();
          this.overviewRadarChart();
          this.overviewBarChart();
          this.overviewBubbleChart();
        }
      });
    });
  }

  score1: any = [];
  score2: any = [];

  taxonomyTableDetails() {
    this.score1 = [];
    this.score2 = [];
    let data = {
      countries: this.mapCountryData[0].id + "," + this.mapCountryData[1].id,
      developmentId: this.developmentId,
      governanceId: this.governace_Id.toString(),
      taxonomyId: this.taxonomy_id,
      ultimateId: this.ultimateId
    };

    this.apiDataService.getTaxonomyTabledetails(data).subscribe((result: any) => {

      let mk: any = []
      let pl: any = [];
      let yu: any = [];
      let mk2: any = []

      this.taxonomy_result = result;
      const indicator = [...new Set(result.map((item: any) => item.indicator_name))];
      this.indicator_val = indicator;

      const ques = [...new Set(result.map((item: any) => item.question))];
      this.question_val = unique(result, ['indicator_name', 'question']);

      for (let u = 0; u < ques.length; u++) {
        let filteredArr = result.filter((item: any) => item.question === ques[u]);
        mk.push(filteredArr)
      }

      for (let u = 0; u < indicator.length; u++) {
        let filteredArr = mk.filter((item: any) => item[0].indicator_name === indicator[u]);
        mk2.push(filteredArr)
      }

      for (let u = 0; u < mk2.length; u++) {
        yu = [];
        for (let l = 0; l < mk2[u].length; l++) {
          let country1: any = mk2[u][l][0].c_name;
          let country2: any = mk2[u][l][1].c_name;
          yu.push([{ [country1]: Math.round(mk2[u][l][0].actual_score / mk2[u][l][0].indicator_score * 100) },
          { [country2]: Math.round(mk2[u][l][1].actual_score / mk2[u][l][1].indicator_score * 100) }])
        }
        pl.push(yu);
      }

      for (let u = 0; u < pl.length; u++) {
        var total = 0;
        var total1 = 0;

        for (let y = 0; y < pl[u].length; y++) {
          let vr: any = +Object.values(pl[u][y][0])
          total += vr;
          let vr2: any = +Object.values(pl[u][y][1])
          total1 += vr2;
        }
        this.score1.push(Math.round(total / 20));
        this.score2.push(Math.round(total1 / 20));
      }

      function unique(arr: any[], keyProps: any[]) {
        const kvArray: any = arr.map((entry: any) => {
          const key = keyProps.map((k: any) => entry[k]).join('|');
          return [key, entry];
        });
        const map = new Map(kvArray);
        return Array.from(map.values());
      }
    });
  }

  overviewRadarChart() {
    this.radarCountry1 = [];
    this.radarCountry2 = [];
    let data = {
      countries: this.mapCountryData[0].id + "," + this.mapCountryData[1].id,
      developmentId: "1,2",
      governanceId: this.governace_Id,
      taxonomyId: this.taxonomy_id,
      year: "2021,2022",
      ultimateId: ""
    };

    this.apiDataService.getOverviewBarChart(data).subscribe((result) => {

      this.radarData = unique(result, ['country_name']);

      for (let v = 0; v < result.length; v++) {
        if (this.radarData[0].country_name == result[v].country_name) {
          let key = result[v].ultimate_field;
          this.radarCountry1.push({ [key]: result[v].percentage })
        } else {
          let key = result[v].ultimate_field;
          this.radarCountry2.push({ [key]: result[v].percentage })
        }
      }
      function unique(arr: any[], keyProps: any[]) {
        const kvArray: any = arr.map((entry: any) => {
          const key = keyProps.map((k: any) => entry[k]).join('|');
          return [key, entry];
        });
        const map = new Map(kvArray);
        return Array.from(map.values());
      }
      this.RadarChart();
    });
  }

  overviewBarChart() {
    this.barData = []
    let data = {
      countries: this.mapCountryData[0].id + "," + this.mapCountryData[1].id,
      developmentId: this.developmentId,
      governanceId: this.governace_Id,
      ultimateId: this.ultimateId,
      taxonomyId: this.taxonomy_id
    };
    this.apiDataService.getOverviewBarChart(data).subscribe((result) => {
      this.barData = result;
      this.barChart();
    });
  }


  overviewBubbleChart() {
    this.rangeB30 = [];
    this.rangeB60 = [];
    this.rangeB80 = [];
    this.rangeB100 = [];
    let data = {
      developmentId: environment.default_developments,
      governanceId: this.governace_Id,
      ultimateId: this.ultimateId,
      taxonomyId: this.taxonomy_id,
      year: "2021,2022",
    };
    this.apiDataService.getOverviewBarChart(data).subscribe((result) => {
      for (let c = 0; c < result.length; c++) {
        if (result[c].percentage <= 30) {
          this.rangeB30.push({ name: result[c].iso_code, value: 1, c_name: result[c].country_name, development_type: result[c].development_type, ultimate_field: result[c].ultimate_field, governance_name: result[c].governance_name, taxonomy_name: result[c].taxonomy_name })
        }
        if (result[c].percentage <= 60 && result[c].percentage > 30) {
          this.rangeB60.push({ name: result[c].iso_code, value: 1, c_name: result[c].country_name })
        }
        if (result[c].percentage <= 80 && result[c].percentage > 60) {
          this.rangeB80.push({ name: result[c].iso_code, value: 1, c_name: result[c].country_name })
        }
        if (result[c].percentage <= 100 && result[c].percentage > 80) {
          this.rangeB100.push({ name: result[c].iso_code, value: 1, c_name: result[c].country_name })
        }
      }
      this.bubbleChart();
    });
  }


  barChart() {
    am5.array.each(am5.registry.rootElements, function (root) {
      if (root && root.dom && root.dom.id == 'chartdiv2') {
        root.dispose();
      }
    });
    let root: any = am5.Root.new("chartdiv2");
    root._logo.dispose();
    root.setThemes([
      am5themes_Animated.new(root)
    ]);

    let chart: any = root.container.children.push(am5xy.XYChart.new(root, {
      panX: false,
      panY: false,
      wheelX: "none",
      wheelY: "none",
    }));

    let data = [{
      "year": "1",
      "income": 100,
      "columnConfig": {
        fill: am5.color(0x220055),
      },
    }, {
      "year": "2",
      "income": 80,
      "columnConfig": {
        fill: am5.color(0x3678B5),
      }
    }, {
      "year": "3",
      "income": 60,
      "columnConfig": {
        fill: am5.color(0x60E7B1),
      }
    }, {
      "year": "4",
      "income": 30,
      "columnConfig": {
        fill: am5.color(0xF18E15),
      }
    }];

    for (let n = 0; n < this.barData.length; n++) {
      let o = {
        "compText": this.barData[n].country_name,
        "comIncome": Math.round(this.barData[n].percentage) + "%",
        "img": "./assets/images/line.png"
      };

      let o1 = {
        "compText": this.barData[0].country_name + ',' + this.barData[1].country_name,
        "comIncome": Math.round(this.barData[0].percentage) + '% ,' + Math.round(this.barData[1].percentage) + '%',
        "img": "./assets/images/line.png"
      };

      if (this.barData[n].percentage <= 30) {
        if (this.p30.length == 0) {
          this.p30.push(n);
          data[3] = { ...data[3], ...o }
        } else {
          data[3] = { ...data[3], ...o1 }
        }
      } else if (this.barData[n].percentage > 30 && this.barData[n].percentage <= 60) {
        if (this.p60.length == 0) {
          this.p60.push(n);
          data[2] = { ...data[2], ...o }
        } else {
          data[2] = { ...data[2], ...o1 }
        }
      } else if (this.barData[n].percentage > 60 && this.barData[n].percentage <= 80) {
        if (this.p80.length == 0) {
          this.p80.push(n);
          data[1] = { ...data[1], ...o }
        } else {
          data[1] = { ...data[1], ...o1 }
        }
      } else if (this.barData[n].percentage > 80 && this.barData[n].percentage <= 100) {
        if (this.p100.length == 0) {
          this.p100.push(n);
          data[0] = { ...data[0], ...o }
        } else {
          data[0] = { ...data[0], ...o1 }
        }
      }
    }

    this.p30 = [];
    this.p60 = [];
    this.p80 = [];
    this.p100 = [];

    let yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "year",
        renderer: am5xy.AxisRendererY.new(root, {
          cellStartLocation: 0.2,
          cellEndLocation: 0.9,
          strokeOpacity: 1,
          strokeWidth: 1,

        }),
      }),
    );

    const myTheme = am5.Theme.new(root);

    myTheme.rule("Grid").setAll({
      visible: false
    });

    root.setThemes([
      myTheme
    ]);

    let yRenderer = yAxis.get("renderer");
    yRenderer.labels.template.setAll({
      visible: false
    });

    yAxis.data.setAll(data);

    let xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {

        min: 0,
        numberFormat: "''",
        renderer: am5xy.AxisRendererX.new(root, {
          strokeOpacity: 1,
          strokeWidth: 1,
          minGridDistance: 20,
        }),
      }),
    );

    let myRange = [{
      x: 20
    },
    {
      x: 40
    },
    {
      x: 60
    },
    {
      x: 80
    },
    {
      x: 100
    }]

    for (var i = 0; i < data.length + 1; i++) {
      let value = myRange[i].x;

      let rangeDataItem = xAxis.makeDataItem({
        value: value
      });

      let range = xAxis.createAxisRange(rangeDataItem);

      rangeDataItem.get("label").setAll({
        forceHidden: false,
        text: value + "%"
      });
    }

    if (this.barData.length > 0) {

      yAxis.children.moveValue(
        am5.Label.new(root, {
          html:
            `
            <div style="background: #000;
                color: #fff;
                width: 50px;
                height: 200px;
                padding: 10px;
                text-align: center;
                border-radius: 15px 0px 0 15px;">
                <div style="transform: rotate(-90deg);
                position: absolute;
                left: -50px;
                top: 38%;">
                <label style="font-size: 12px;
                width: 150px;
                position: relative;
                top: 48%;">`+ this.barData[0].development_type + `</label>
            <span style="font-size: 12px;"><b>`+ this.barData[0].ultimate_field + `</b><span>
            <div>
            </div>
            `,
        }),
        0
      );
    }

    let series1 = chart.series.push(am5xy.ColumnSeries.new(root, {
      name: "income",
      xAxis: xAxis,
      yAxis: yAxis,
      valueXField: "income",
      categoryYField: "year",
      sequencedInterpolation: true
    }));

    series1.columns.template.setAll({
      height: am5.percent(70),
      templateField: 'columnConfig',
      strokeOpacity: 0
    });

    series1.bullets.push(function () {
      return am5.Bullet.new(root, {
        locationX: 0.8,
        locationY: -0.5,
        sprite: am5.Label.new(root, {
          centerY: am5.p50,
          html: `<div style="text-align:center;">
                   {comIncome} <br> {compText}<br>
                   <img src="{img}" width="120" style="margin-top:-17px;margin-left:-17px;">
              </div>`,
        })
      });
    });

    let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
      behavior: "none"
    }));
    cursor.lineX.set("visible", false);
    cursor.lineY.set("visible", false);

    series1.data.setAll(data);

    series1.appear();
    chart.appear(1000, 100);
    if (this.barData.length > 0) {
      chart.children.unshift(am5.Label.new(root, {
        text: this.barData[0].taxonomy_name,
        fontSize: 15,
        fontWeight: '500',
        textAlign: 'center',
        x: am5.percent(75),
        y: -10,
        centerX: am5.percent(50),
      }));
    }

  }


  bubbleChart() {

    am4core.useTheme(am4themes_animated);
    var chart = am4core.create("chartdiv1", am4plugins_forceDirected.ForceDirectedTree);
    if (chart.logo) {
      chart.logo.disabled = true;
    }

    var networkSeries = chart.series.push(new am4plugins_forceDirected.ForceDirectedSeries())

    networkSeries.data = [{
      id: '1',
      name: '30%',
      value: 1,
      fixed: true,
      color: ("#F18E15"),
      x: am4core.percent(40),
      y: am4core.percent(40),
      children: this.rangeB30
    }, {
      id: '2',
      name: '100%',
      color: ("#220055"),
      fixed: true,
      value: 1,
      x: am4core.percent(50),
      y: am4core.percent(25),
      children: this.rangeB100
    }, {
      id: '3',
      name: '80%',
      color: ("#3678B5"),
      fixed: true,
      value: 1,
      x: am4core.percent(50),
      y: am4core.percent(50),
      children: this.rangeB80
    }, {
      id: '4',
      name: '60%',
      color: ("#60E7B1"),
      fixed: true,
      value: 1,
      x: am4core.percent(60),
      y: am4core.percent(40),
      children: this.rangeB60

    }, {
      name: '',
      fixed: true,
      value: 1,
      x: am4core.percent(150),
      y: am4core.percent(40),
      children: [{
        name: '', value: 2.5
      }]

    }];

    networkSeries.dataFields.linkWith = "linkWith";
    networkSeries.dataFields.name = "name";
    networkSeries.dataFields.id = "id";
    networkSeries.dataFields.value = "value";
    networkSeries.dataFields.children = "children";
    networkSeries.dataFields.fixed = "fixed";
    networkSeries.dataFields.color = "color";

    networkSeries.nodes.template.propertyFields.x = "x";
    networkSeries.nodes.template.propertyFields.y = "y";

    networkSeries.nodes.template.tooltipText = "{c_name}";
    networkSeries.nodes.template.fillOpacity = 1;

    networkSeries.nodes.template.label.text = "{name}"
    networkSeries.fontSize = 8;
    networkSeries.nodes.template.label.hideOversized = true;
    networkSeries.nodes.template.label.truncate = true;
    networkSeries.links.template.distance = 0;
    networkSeries.links.template.disabled = true;

    networkSeries.nodes.template.strokeWidth = 0;
    networkSeries.links.template.strokeOpacity = 0;
    networkSeries.nodes.template.label.fill = am4core.color("#fff");

    networkSeries.nodes.template.outerCircle.strokeOpacity = 0;
    networkSeries.nodes.template.outerCircle.fillOpacity = 0;


    var title2 = chart.titles.create();

    title2.html =
      `<div style="background: #000;
          color: #fff;
          width: 50px;
          height: 200px;
          text-align: center;
          border-radius: 15px 0px 0 15px;">
          <div style="transform: rotate(-90deg);
          position: absolute;
          left: -50px;
          top: 38%;">
          <label style="font-size: 12px;
          width: 150px;
          position: relative;
          top: 48%;
          height: 100%;
      display: inherit;">`+
      this.rangeB30[0].development_type + `
              </label>
          <span style="font-size: 12px;"><b> `+
      this.rangeB30[0].ultimate_field + `</b><span>
          <div>
          </div>`;
    title2.align = 'left';
    title2.rotation = 0;
    title2.marginBottom = -180;

    var title = chart.titles.create();
    title.text = this.rangeB30[0].taxonomy_name;
    title.marginTop = 0;
    title.marginBottom = 30;
    title.marginLeft = 60;
    title.fontSize = 15;
    title.fontWeight = 'bold';
    title.align = 'center';

  }


  RadarChart() {
    this.chartOptionRadar = {
      color: ['#338A14', 'rgba(92,221,189,1)', '#56A3F1', '#FF917C'],
      title: {
        text: this.radarData[0].taxonomy_name,
      },
      legend: {
        top: 'top',
        left: 'right',
        orient: 'vertical'
      },
      radar: [
        {
          indicator: [
            { text: 'Availability', max: 100 },
            { text: 'Capacity Building', max: 100 },
            { text: 'Development Strategy', max: 100 },
            { text: 'Readiness', max: 100 },
          ],
          center: ['55%', '55%'],
          radius: 110,
          startAngle: 90,
          splitNumber: 4,
          shape: 'circle',
          axisName: {
            color: '#707070',
            fontSize: '10',
          },
          splitArea: {
            areaStyle: {
              color: ['#E3E3E3', '#F2F2F2', '#E3E3E3', '#F2F2F2'],
              shadowColor: 'rgba(0, 0, 0, 0.2)',
              shadowBlur: 10,
            },
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(154,165,162,1)',
            },
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(154,165,162,1)',
            },
          },
        },
      ],
      series: [
        {
          type: 'radar',
          emphasis: {
            lineStyle: {
              width: 4,
            },
          },
          data: [
            {
              value: [
                this.radarCountry1[1]['Availability'],
                this.radarCountry1[3]['Capacity Building'],
                this.radarCountry1[2]['Development Strategy'],
                this.radarCountry1[0]['Readiness'],
              ],
              name: this.radarData[0].country_name,
              areaStyle: {
                color: 'rgba(51, 138, 20, 0.6)',
              },
            },
            {
              value: [
                this.radarCountry2[1]['Availability'],
                this.radarCountry2[3]['Capacity Building'],
                this.radarCountry2[2]['Development Strategy'],
                this.radarCountry2[0]['Readiness'],
              ],
              name: this.radarData[1].country_name,
              areaStyle: {
                color: 'rgba(92,221,189,0.6)',
              },
            },
          ],
        },
      ],
    };
  }
}
