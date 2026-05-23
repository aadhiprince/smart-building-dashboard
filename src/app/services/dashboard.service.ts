import { Injectable, signal } from '@angular/core';

export interface OrganizationOverview {
  campuses: number;
  buildings: number;
  floors: number;
  rooms: number;
  users: number;
  assets: number;
  workOrders: number;
  workRequests: number;
  alarms: number;
  gateways: number;
  wiredDevices: number;
  wirelessDevices: number;
  healthScore: number;
  areaSqFt: number;
}

export interface ProductUpdate {
  id: number;
  title: string;
  version: string;
  releaseDate: number;
}

export interface FloorEnergy {
  consumption: number;
  unit: string;
}

export interface FloorAssetHealth {
  healthy: number;
  warning: number;
  critical: number;
}

export interface FloorDetails {
  name: string;
  assets: FloorAssetHealth;
  energy: FloorEnergy;
}

export interface BuildingAssetData {
  building: string;
  floors: FloorDetails[];
}

export interface MapBuilding {
  id: number;
  name: string;
  city: string;
  area: number;
  totalFloors: number;
  healthScore: number;
  geoLocation: [number, number];
}

export interface DeviceAnalytics {
  month: string;
  healthy: number;
  warning: number;
  critical: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  readonly latencyMs = signal<number>(1500);
  readonly forceError = signal<boolean>(false);

  setLatency(ms: number): void {
    this.latencyMs.set(ms);
  }

  setForceError(shouldFail: boolean): void {
    this.forceError.set(shouldFail);
  }

  async getOrganizationOverview(): Promise<OrganizationOverview> {
    const delay = this.latencyMs();
    const shouldFail = this.forceError();

    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    if (shouldFail) {
      throw new Error(
        'Server Connection Timeout: The smart-building API gateway failed to respond in time. Please check your simulation configurations.'
      );
    }

    try {
      const response = await fetch('/data/overview.json');
      if (!response.ok) {
        throw new Error(`HTTP Error: Failed to fetch overview data (Status: ${response.status})`);
      }
      return (await response.json()) as OrganizationOverview;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unknown network error occurred while fetching building overview.');
    }
  }

  async getProductUpdates(): Promise<ProductUpdate[]> {
    const delay = this.latencyMs();
    const shouldFail = this.forceError();

    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    if (shouldFail) {
      throw new Error(
        'Gateway Timeout: The update-services node failed to respond. Please review your simulation toggles.'
      );
    }

    try {
      const response = await fetch('/data/updates.json');
      if (!response.ok) {
        throw new Error(`HTTP Error: Failed to fetch updates data (Status: ${response.status})`);
      }
      return (await response.json()) as ProductUpdate[];
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unknown network error occurred while fetching product release notes.');
    }
  }

  async getAssetHealthSummary(): Promise<BuildingAssetData[]> {
    const delay = this.latencyMs();
    const shouldFail = this.forceError();

    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    if (shouldFail) {
      throw new Error(
        'Gateway Error: The asset registry gateway timed out. Please review your simulation settings.'
      );
    }

    try {
      const response = await fetch('/data/assets.json');
      if (!response.ok) {
        throw new Error(`HTTP Error: Failed to fetch assets data (Status: ${response.status})`);
      }
      return (await response.json()) as BuildingAssetData[];
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unknown network error occurred while fetching asset health indices.');
    }
  }

  async getMapBuildings(): Promise<MapBuilding[]> {
    const delay = this.latencyMs();
    const shouldFail = this.forceError();

    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    if (shouldFail) {
      throw new Error(
        'Map Gateway Error: The mapping server did not respond. Please review your simulation settings.'
      );
    }

    try {
      const response = await fetch('/data/map.json');
      if (!response.ok) {
        throw new Error(`HTTP Error: Failed to fetch building coordinates (Status: ${response.status})`);
      }
      return (await response.json()) as MapBuilding[];
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unknown network error occurred while resolving building coordinates.');
    }
  }

  async getDeviceAnalytics(): Promise<DeviceAnalytics[]> {
    const delay = this.latencyMs();
    const shouldFail = this.forceError();

    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    if (shouldFail) {
      throw new Error(
        'Telemetry Gateway Error: The analytics dashboard node timed out. Please check the network connection and retry.'
      );
    }

    try {
      const response = await fetch('/data/analytics.json');
      if (!response.ok) {
        throw new Error(`HTTP Error: Failed to fetch device analytics trends (Status: ${response.status})`);
      }
      return (await response.json()) as DeviceAnalytics[];
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unknown network error occurred while compiling active telemetry logs.');
    }
  }
}