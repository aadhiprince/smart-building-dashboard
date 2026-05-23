import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { DashboardService, OrganizationOverview } from '../../services/dashboard.service';

@Component({
  selector: 'app-organization-overview',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule
  ],
  templateUrl: './organization-overview.component.html',
  styleUrl: './organization-overview.component.scss'
})
export class OrganizationOverviewComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);

  readonly data = signal<OrganizationOverview | null>(null);
  readonly isLoading = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);

  readonly radius = 70;
  readonly circumference = 2 * Math.PI * this.radius;

  readonly strokeDashoffset = computed(() => {
    const stats = this.data();
    if (!stats) return this.circumference;
    const score = stats.healthScore;
    return this.circumference - (score / 100) * this.circumference;
  });

  readonly healthColor = computed(() => {
    const stats = this.data();
    if (!stats) return '#e0e0e0';
    const score = stats.healthScore;
    if (score >= 80) return '#4caf50';
    if (score >= 60) return '#ff9800';
    return '#f44336';
  });

  readonly healthStatusText = computed(() => {
    const stats = this.data();
    if (!stats) return 'Unknown';
    const score = stats.healthScore;
    if (score >= 80) return 'Optimal Operation';
    if (score >= 60) return 'Sub-optimal (Action Required)';
    return 'Critical Maintenance Alert';
  });

  ngOnInit(): void {
    this.loadOverviewData();
  }

  async loadOverviewData(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const stats = await this.dashboardService.getOrganizationOverview();
      this.data.set(stats);
    } catch (err) {
      if (err instanceof Error) {
        this.errorMessage.set(err.message);
      } else {
        this.errorMessage.set('Failed to connect to the smart-building server. Please try again.');
      }
      this.data.set(null);
    } finally {
      this.isLoading.set(false);
    }
  }

  formatNumber(value: number | undefined): string {
    if (value === undefined) return '0';
    return value.toLocaleString();
  }
}