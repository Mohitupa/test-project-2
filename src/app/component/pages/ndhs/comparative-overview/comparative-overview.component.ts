import {AfterViewInit, Component, OnInit} from '@angular/core';
import * as echarts from 'echarts';
import * as $ from "jquery";

@Component({
    selector: 'app-comparative-overview',
    templateUrl: './comparative-overview.component.html',
    styleUrls: ['./comparative-overview.component.css'],
})
export class ComparativeOverviewComponent implements OnInit,AfterViewInit {
    
    ngOnInit() {
    }

    ngAfterViewInit(): void {
        this.comparativeResultNetworkChart()
    }

    comparativeResultNetworkChart() {
        type EChartsOption = echarts.EChartsOption;
    
        var chartDom = document.getElementById('main15')!;
        var myChart = echarts.init(chartDom);
        var option: EChartsOption;
    
        interface GraphNode {
          symbolSize: number;
          label?: {
            show?: boolean;
          };
        }
    
        myChart.showLoading();
        $.getJSON('../../assets/data/network.json', function (graph: any) {
    
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
}
