import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DashboardService, ProductUpdate } from '../../services/dashboard.service';

@Component({
  selector: 'app-product-updates',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './product-updates.component.html',
  styleUrl: './product-updates.component.scss'
})
export class ProductUpdatesComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);

  readonly updates = signal<ProductUpdate[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadUpdates();
  }

  async loadUpdates(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const list = await this.dashboardService.getProductUpdates();
      this.updates.set(list.sort((a, b) => b.releaseDate - a.releaseDate));
    } catch (err) {
      if (err instanceof Error) {
        this.errorMessage.set(err.message);
      } else {
        this.errorMessage.set('Failed to connect to the updates channel. Please try again.');
      }
      this.updates.set([]);
    } finally {
      this.isLoading.set(false);
    }
  }
}