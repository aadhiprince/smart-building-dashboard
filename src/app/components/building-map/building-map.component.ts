import { Component, OnInit, signal, computed, inject, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DashboardService, MapBuilding } from '../../services/dashboard.service';

declare const L: any;

@Component({
  selector: 'app-building-map',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './building-map.component.html',
  styleUrl: './building-map.component.scss'
})
export class BuildingMapComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly dashboardService = inject(DashboardService);

  readonly buildings = signal<MapBuilding[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);
  readonly searchQuery = signal<string>('');

  private map: any = null;
  private readonly markersMap = new Map<number, any>();

  readonly filteredBuildings = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const list = this.buildings();
    if (!query) return list;
    return list.filter(
      (b) =>
        b.name.toLowerCase().includes(query) ||
        b.city.toLowerCase().includes(query)
    );
  });

  ngOnInit(): void {
    this.loadMapBuildings();
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
    this.markersMap.clear();
  }

  async loadMapBuildings(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    if (this.map) {
      this.map.remove();
      this.map = null;
      this.markersMap.clear();
    }

    try {
      const list = await this.dashboardService.getMapBuildings();
      this.buildings.set(list);

      setTimeout(() => {
        this.initializeMap(list);
      }, 50);
    } catch (err) {
      if (err instanceof Error) {
        this.errorMessage.set(err.message);
      } else {
        this.errorMessage.set('Failed to connect to the mapping system. Please try again.');
      }
      this.buildings.set([]);
    } finally {
      this.isLoading.set(false);
    }
  }

  private initializeMap(list: MapBuilding[]): void {
    const mapElement = document.getElementById('building-map');
    if (!mapElement || typeof L === 'undefined') return;

    try {
      this.map = L.map('building-map', {
        zoomControl: false
      }).setView([12.9152, 77.608], 14);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(this.map);

      L.control.zoom({
        position: 'topright'
      }).addTo(this.map);

      for (const b of list) {
        const isHealthy = b.healthScore >= 70;
        
        const customIcon = L.divIcon({
          className: 'custom-map-marker',
          html: `
            <div class="marker-pin ${isHealthy ? 'healthy' : 'warning'}">
              <div class="marker-pulse"></div>
              <div class="marker-core"></div>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
          popupAnchor: [0, -12]
        });

        const popupHTML = `
          <div class="map-popup-card">
            <h4 class="popup-title">${b.name}</h4>
            <span class="popup-city"><i class="material-icons">place</i> ${b.city}</span>
            
            <div class="popup-stats">
              <div class="pop-stat"><span>Managed Area:</span> <strong>${b.area.toLocaleString()} Sq Ft</strong></div>
              <div class="pop-stat"><span>Floors:</span> <strong>${b.totalFloors}</strong></div>
              <div class="pop-stat"><span>Health Index:</span> <strong class="health-val ${isHealthy ? 'high' : 'medium'}">${b.healthScore}%</strong></div>
            </div>
          </div>
        `;

        const marker = L.marker(b.geoLocation, { icon: customIcon })
          .addTo(this.map)
          .bindPopup(popupHTML, {
            maxWidth: 280,
            className: 'custom-leaflet-popup'
          });

        this.markersMap.set(b.id, marker);
      }
    } catch (e) {
      console.error('Leaflet initialization failed', e);
      this.errorMessage.set('Leaflet failed to initialize. Please check your web connection and reload.');
    }
  }

  focusBuilding(building: MapBuilding): void {
    if (!this.map) return;
    
    this.map.setView(building.geoLocation, 16, {
      animate: true,
      duration: 1.0
    });

    const marker = this.markersMap.get(building.id);
    if (marker) {
      marker.openPopup();
    }
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }
}