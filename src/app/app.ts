import { Component, signal, inject, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { OrganizationOverviewComponent } from './components/organization-overview/organization-overview.component';
import { ProductUpdatesComponent } from './components/product-updates/product-updates.component';
import { AssetHealthComponent } from './components/asset-health/asset-health.component';
import { BuildingMapComponent } from './components/building-map/building-map.component';
import { DeviceAnalyticsComponent } from './components/device-analytics/device-analytics.component';
import { DashboardService } from './services/dashboard.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    OrganizationOverviewComponent,
    ProductUpdatesComponent,
    AssetHealthComponent,
    BuildingMapComponent,
    DeviceAnalyticsComponent,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  // Start closed on mobile so content is immediately visible
  protected readonly sidebarOpen = signal<boolean>(window.innerWidth > 768);
  readonly activeTab = signal<'overview' | 'updates' | 'assets' | 'map' | 'analytics'>('overview');
  protected readonly dashboardService = inject(DashboardService);

  @ViewChild(OrganizationOverviewComponent) overviewComponent?: OrganizationOverviewComponent;
  @ViewChild(ProductUpdatesComponent) updatesComponent?: ProductUpdatesComponent;
  @ViewChild(AssetHealthComponent) assetsComponent?: AssetHealthComponent;
  @ViewChild(BuildingMapComponent) mapComponent?: BuildingMapComponent;
  @ViewChild(DeviceAnalyticsComponent) analyticsComponent?: DeviceAnalyticsComponent;

  setActiveTab(tab: 'overview' | 'updates' | 'assets' | 'map' | 'analytics'): void {
    this.activeTab.set(tab);
    // Auto-close the sidebar drawer when a nav item is tapped on mobile
    if (window.innerWidth <= 768) {
      this.sidebarOpen.set(false);
    }
  }

  toggleSidebar(): void {
    this.sidebarOpen.update((open) => !open);
  }

  onLatencyChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.dashboardService.setLatency(Number(select.value));
    this.reloadActiveWidget();
  }

  onToggleError(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.dashboardService.setForceError(input.checked);
    this.reloadActiveWidget();
  }

  reloadActiveWidget(): void {
    const tab = this.activeTab();
    if (tab === 'overview' && this.overviewComponent) {
      this.overviewComponent.loadOverviewData();
    } else if (tab === 'updates' && this.updatesComponent) {
      this.updatesComponent.loadUpdates();
    } else if (tab === 'assets' && this.assetsComponent) {
      this.assetsComponent.loadAssetHealth();
    } else if (tab === 'map' && this.mapComponent) {
      this.mapComponent.loadMapBuildings();
    } else if (tab === 'analytics' && this.analyticsComponent) {
      this.analyticsComponent.loadAnalytics();
    }
  }
}