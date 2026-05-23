import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { DashboardService, BuildingAssetData, FloorDetails } from '../../services/dashboard.service';

export interface BuildingTotals {
  healthy: number;
  warning: number;
  critical: number;
  totalAssets: number;
  energy: number;
  energyUnit: string;
}

export interface Proportions {
  healthyPct: number;
  warningPct: number;
  criticalPct: number;
}

@Component({
  selector: 'app-asset-health',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule
  ],
  templateUrl: './asset-health.component.html',
  styleUrl: './asset-health.component.scss'
})
export class AssetHealthComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);

  readonly buildings = signal<BuildingAssetData[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadAssetHealth();
  }

  async loadAssetHealth(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const data = await this.dashboardService.getAssetHealthSummary();
      this.buildings.set(data);
    } catch (err) {
      if (err instanceof Error) {
        this.errorMessage.set(err.message);
      } else {
        this.errorMessage.set('Failed to connect to the asset health gateway. Please try again.');
      }
      this.buildings.set([]);
    } finally {
      this.isLoading.set(false);
    }
  }

  getBuildingTotals(building: BuildingAssetData): BuildingTotals {
    let healthy = 0;
    let warning = 0;
    let critical = 0;
    let energy = 0;

    for (const floor of building.floors) {
      healthy += floor.assets.healthy;
      warning += floor.assets.warning;
      critical += floor.assets.critical;
      energy += floor.energy.consumption;
    }

    const totalAssets = healthy + warning + critical;
    const energyUnit = building.floors[0]?.energy.unit || 'kWh';

    return {
      healthy,
      warning,
      critical,
      totalAssets,
      energy,
      energyUnit
    };
  }

  getProportions(floor: FloorDetails): Proportions {
    const h = floor.assets.healthy;
    const w = floor.assets.warning;
    const c = floor.assets.critical;
    const total = h + w + c;

    if (total === 0) {
      return { healthyPct: 0, warningPct: 0, criticalPct: 0 };
    }

    return {
      healthyPct: (h / total) * 100,
      warningPct: (w / total) * 100,
      criticalPct: (c / total) * 100
    };
  }
}