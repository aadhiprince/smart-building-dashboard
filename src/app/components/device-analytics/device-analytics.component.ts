import { Component, OnInit, signal, computed, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DashboardService, DeviceAnalytics } from '../../services/dashboard.service';

declare const Chart: any;

@Component({
  selector: 'app-device-analytics',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './device-analytics.component.html',
  styleUrl: './device-analytics.component.scss'
})
export class DeviceAnalyticsComponent implements OnInit, OnDestroy {
  private readonly dashboardService = inject(DashboardService);

  readonly analyticsData = signal<DeviceAnalytics[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);

  private chart: any = null;

  readonly latestStats = computed(() => {
    const list = this.analyticsData();
    if (list.length === 0) return null;
    const last = list[list.length - 1];
    const total = last.healthy + last.warning + last.critical;
    const healthyPct = (last.healthy / total) * 100;
    return {
      ...last,
      total,
      healthyPct
    };
  });

  ngOnInit(): void {
    this.loadAnalytics();
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  async loadAnalytics(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }

    try {
      const data = await this.dashboardService.getDeviceAnalytics();
      this.analyticsData.set(data);

      setTimeout(() => {
        this.initializeChart(data);
      }, 50);
    } catch (err) {
      if (err instanceof Error) {
        this.errorMessage.set(err.message);
      } else {
        this.errorMessage.set('Failed to connect to the active telemetry gateway. Please try again.');
      }
      this.analyticsData.set([]);
    } finally {
      this.isLoading.set(false);
    }
  }

  private initializeChart(data: DeviceAnalytics[]): void {
    const canvas = document.getElementById('device-analytics-chart') as HTMLCanvasElement;
    if (!canvas || typeof Chart === 'undefined') return;

    try {
      const months = data.map((d) => d.month);
      const healthyData = data.map((d) => d.healthy);
      const warningData = data.map((d) => d.warning);
      const criticalData = data.map((d) => d.critical);

      this.chart = new Chart(canvas, {
        type: 'line',
        data: {
          labels: months,
          datasets: [
            {
              label: 'Healthy Devices',
              data: healthyData,
              borderColor: '#10b981',
              borderWidth: 3,
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              fill: true,
              tension: 0.4,
              pointBackgroundColor: '#10b981',
              pointHoverRadius: 6,
              pointRadius: 3
            },
            {
              label: 'Warning Nodes',
              data: warningData,
              borderColor: '#f59e0b',
              borderWidth: 3,
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              fill: true,
              tension: 0.4,
              pointBackgroundColor: '#f59e0b',
              pointHoverRadius: 6,
              pointRadius: 3
            },
            {
              label: 'Critical Failures',
              data: criticalData,
              borderColor: '#ef4444',
              borderWidth: 3,
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              fill: true,
              tension: 0.4,
              pointBackgroundColor: '#ef4444',
              pointHoverRadius: 6,
              pointRadius: 3
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              align: 'end',
              labels: {
                color: 'rgba(255, 255, 255, 0.65)',
                font: {
                  family: "'Inter', sans-serif",
                  weight: '500',
                  size: 11
                },
                boxWidth: 10,
                padding: 15,
                usePointStyle: true,
                pointStyle: 'circle'
              }
            },
            tooltip: {
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              titleColor: '#ffffff',
              titleFont: { family: "'Inter', sans-serif", weight: '700', size: 12 },
              bodyColor: 'rgba(255, 255, 255, 0.8)',
              bodyFont: { family: "'Inter', sans-serif", size: 11 },
              borderColor: 'rgba(255, 255, 255, 0.08)',
              borderWidth: 1,
              padding: 10,
              boxPadding: 6,
              usePointStyle: true
            }
          },
          scales: {
            x: {
              grid: {
                color: 'rgba(255, 255, 255, 0.03)',
                drawTicks: false
              },
              ticks: {
                color: 'rgba(255, 255, 255, 0.4)',
                font: { family: "'Inter', sans-serif", size: 11 }
              }
            },
            y: {
              stacked: true,
              grid: {
                color: 'rgba(255, 255, 255, 0.04)',
                drawTicks: false
              },
              ticks: {
                color: 'rgba(255, 255, 255, 0.4)',
                font: { family: "'Inter', sans-serif", size: 11 }
              }
            }
          }
        }
      });
    } catch (e) {
      console.error('Chart.js initialization failed', e);
      this.errorMessage.set('Chart.js engine failed to initialize. Please check your web connection and reload.');
    }
  }
}