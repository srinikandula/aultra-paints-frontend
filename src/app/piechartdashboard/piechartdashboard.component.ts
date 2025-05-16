import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { CommonModule } from '@angular/common';
import { ApiRequestService } from "../services/api-request.service";
import { ApiUrlsService } from "../services/api-urls.service";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-piechartdashboard',
  standalone: true,
  imports: [CommonModule, HighchartsChartModule],
  templateUrl: './piechartdashboard.component.html',
  styleUrls: ['./piechartdashboard.component.css']
})
export class PiechartdashboardComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptionsColumn: Highcharts.Options = {};
  drilldownChartOptions: Highcharts.Options = {};
  chartPixelWidth = 800;
  currentUser: any = {};

  // To store selected product's drilldown data
  selectedProductName = '';
  issuedPoints = 0;
  issuedValue = 0;

  constructor(
    private apiRequestService: ApiRequestService,
    public apiUrls: ApiUrlsService,
    private AuthService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.currentUser = this.AuthService.currentUserValue;
  }

  ngOnInit(): void {
    this.loadMainChart();
  }

  loadMainChart(): void {
    this.apiRequestService.getBatchStatistics().subscribe({
      next: (res: any) => {
        const products = res.products || [];
        const metrics = res.metrics || [];

        if (!products.length || !metrics.length) {
          return;
        }

        const categories = products.map((p: any) => p.name);

        // Use Highcharts default colors or fallback
        const defaultColors = Highcharts.getOptions().colors || ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c'];

        const seriesData = metrics.map((metric: any, index: number) => ({
          name: metric.name,
          type: 'column',
          data: metric.data.slice(0, categories.length),
          color: defaultColors[index % defaultColors.length]
        }));

        const estimatedWidth = categories.length * 80;
        this.chartPixelWidth = Math.max(estimatedWidth, 800);

        this.chartOptionsColumn = {
          chart: { type: 'column' },
          title: { text: '' },
          xAxis: { categories, crosshair: true },
          yAxis: { min: 0, title: { text: 'Values' } },
          tooltip: { shared: true },
          legend: { enabled: false }, // disable built-in legend
          plotOptions: {
            column: {
              cursor: 'pointer',
              point: {
                events: {
                  click: (event) => this.onProductClick(event.point.index, products[event.point.index].id, products[event.point.index].name)
                }
              },
              pointPadding: 0.2,
              borderWidth: 0,
              pointWidth: 20
            }
          },
          series: seriesData as Highcharts.SeriesColumnOptions[]
        };

        // Reset drilldown chart on new main chart load
        this.selectedProductName = '';
        this.drilldownChartOptions = {};
        this.issuedPoints = 0;
        this.issuedValue = 0;

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('API Error:', err);
      }
    });
  }

  onProductClick(index: number, productId: string, productName: string): void {
    // Save selected product name
    this.selectedProductName = productName;

    // Call API to get drilldown data for clicked product
    this.apiRequestService.getBatchTimeline(productId).subscribe({
      next: (res: any) => {
        const months = res.months || [];
        const metrics = res.metrics || [];

        this.issuedPoints = res.issuedPoints || 0;
        this.issuedValue = res.issuedValue || 0;

        // Use specific colors for drilldown chart
        const drilldownColors = ['#00e272', '#fe6a35'];

        const seriesData = metrics.map((metric: any, idx: number) => ({
          name: metric.name,
          type: 'column',
          data: metric.data,
          color: drilldownColors[idx] || '#000000'  // fallback to black if more than 2 series
        }));

        this.drilldownChartOptions = {
          chart: { type: 'column' },
          title: { text: '' },
          xAxis: { categories: months, crosshair: true },
          yAxis: { min: 0, title: { text: 'Values' } },
          tooltip: { shared: true },
          legend: { enabled: false },
          plotOptions: {
            column: {
              pointPadding: 0.2,
              borderWidth: 0,
              pointWidth: 20
            }
          },
          series: seriesData as Highcharts.SeriesColumnOptions[]
        };

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Drilldown API error:', err);
      }
    });
  }

  // Helper method to get color of a series safely
  getSeriesColor(series: Highcharts.SeriesOptionsType): string {
    const color = (series as Highcharts.SeriesColumnOptions).color;
    if (typeof color === 'string') {
      return color;
    }
    return '#000000';
  }
}
