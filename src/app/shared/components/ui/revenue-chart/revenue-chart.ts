import { Component, Input, OnChanges, SimpleChanges, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';

export interface RevenueDataPoint {
  label: string;
  revenue: number;
  orderCount: number;
}

@Component({
  selector: 'app-revenue-chart',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="revenue-chart">
      <div class="chart-header">
        <div class="chart-header__left">
          <h3 class="chart-title">
            <app-icon name="pie-chart" size="20"></app-icon>
            Biểu đồ doanh thu
          </h3>
          <p class="chart-subtitle">Doanh thu & số đơn hàng đã giao theo thời gian</p>
        </div>
        <div class="chart-header__right">
          <div class="date-range">
            <div class="date-field">
              <label>Từ ngày</label>
              <input type="date" [value]="startDate()" (change)="onStartDateChange($event)" />
            </div>
            <div class="date-field">
              <label>Đến ngày</label>
              <input type="date" [value]="endDate()" (change)="onEndDateChange($event)" />
            </div>
          </div>
          <div class="period-selector">
            @for (p of periods; track p.value) {
              <button 
                class="period-btn" 
                [class.active]="period() === p.value"
                (click)="onPeriodChange(p.value)">
                {{ p.label }}
              </button>
            }
          </div>
        </div>
      </div>

      <div class="chart-summary">
        <div class="summary-item">
          <span class="summary-label">Tổng doanh thu kỳ</span>
          <strong class="summary-value text-revenue">{{ formatPrice(totalRevenue()) }}</strong>
        </div>
        <div class="summary-item">
          <span class="summary-label">Tổng đơn giao</span>
          <strong class="summary-value text-orders">{{ totalOrders() }}</strong>
        </div>
        <div class="summary-item">
          <span class="summary-label">Trung bình/kỳ</span>
          <strong class="summary-value text-avg">{{ formatPrice(avgRevenue()) }}</strong>
        </div>
      </div>

      @if (chartData().length > 0) {
        <div class="chart-container" (mouseleave)="hoveredIndex.set(-1)">
          <!-- Y-axis labels -->
          <div class="y-axis">
            @for (tick of yTicks(); track tick) {
              <span class="y-tick">{{ formatShort(tick) }}</span>
            }
          </div>

          <!-- Chart area -->
          <div class="chart-area">
            <!-- Grid lines -->
            <div class="grid-lines">
              @for (tick of yTicks(); track tick; let i = $index) {
                <div class="grid-line" [style.bottom.%]="(i / (yTicks().length - 1)) * 100"></div>
              }
            </div>

            <!-- Bars -->
            <div class="bars-container" [class.bars-scrollable]="chartData().length > 31">
              @for (d of chartData(); track d.label; let i = $index) {
                <div 
                  class="bar-group"
                  [class.hovered]="hoveredIndex() === i"
                  (mouseenter)="hoveredIndex.set(i)"
                  (mouseleave)="hoveredIndex.set(-1)">
                  <div class="bar-wrapper">
                    <div 
                      class="bar" 
                      [style.height.%]="getBarHeight(d.revenue)"
                      [style.animation-delay]="i * 60 + 'ms'">
                      <div class="bar-glow"></div>
                    </div>
                  </div>
                  <span class="bar-label">{{ d.label }}</span>

                  <!-- Tooltip -->
                  @if (hoveredIndex() === i) {
                    <div class="bar-tooltip">
                      <div class="tooltip-row">
                        <span class="tooltip-label">Doanh thu</span>
                        <strong class="tooltip-value">{{ formatPrice(d.revenue) }}</strong>
                      </div>
                      <div class="tooltip-row">
                        <span class="tooltip-label">Đơn hàng</span>
                        <strong class="tooltip-value">{{ d.orderCount }}</strong>
                      </div>
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        </div>
      } @else {
        <div class="chart-empty">
          <app-icon name="pie-chart" size="48"></app-icon>
          <p>Không có dữ liệu trong khoảng thời gian đã chọn</p>
        </div>
      }
    </div>
  `,
  styleUrl: './revenue-chart.scss'
})
export class RevenueChartComponent implements OnChanges {
  @Input() orders: { orderDate: string; totalPrice?: number; status: string }[] = [];

  readonly periods = [
    { label: 'Ngày', value: 'day' as const },
    { label: 'Tuần', value: 'week' as const },
    { label: 'Tháng', value: 'month' as const }
  ];

  readonly period = signal<'day' | 'week' | 'month'>('month');
  readonly startDate = signal('');
  readonly endDate = signal('');
  readonly hoveredIndex = signal(-1);

  private readonly rawOrders = signal<{ orderDate: string; totalPrice?: number; status: string }[]>([]);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['orders']) {
      this.rawOrders.set(this.orders || []);
      // Set default date range: last 6 months
      if (!this.startDate()) {
        const now = new Date();
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        this.startDate.set(this.toDateStr(sixMonthsAgo));
        this.endDate.set(this.toDateStr(now));
      }
    }
  }

  readonly filteredOrders = computed(() => {
    const orders = this.rawOrders();
    const start = this.startDate();
    const end = this.endDate();

    return orders.filter(o => {
      if (o.status !== 'DELIVERED') return false;
      const d = o.orderDate?.substring(0, 10);
      if (!d) return false;
      if (start && d < start) return false;
      if (end && d > end) return false;
      return true;
    });
  });

  readonly chartData = computed((): RevenueDataPoint[] => {
    const orders = this.filteredOrders();
    const p = this.period();
    const map = new Map<string, { revenue: number; count: number }>();

    for (const o of orders) {
      const key = this.getGroupKey(o.orderDate, p);
      const existing = map.get(key) || { revenue: 0, count: 0 };
      existing.revenue += o.totalPrice ?? 0;
      existing.count += 1;
      map.set(key, existing);
    }

    // Fill gaps
    const start = this.startDate();
    const end = this.endDate();
    if (start && end) {
      const allKeys = this.generateAllKeys(start, end, p);
      for (const key of allKeys) {
        if (!map.has(key)) {
          map.set(key, { revenue: 0, count: 0 });
        }
      }
    }

    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, val]) => ({
        label: this.formatLabel(key, p),
        revenue: val.revenue,
        orderCount: val.count
      }));
  });

  readonly maxRevenue = computed(() => {
    const data = this.chartData();
    if (!data.length) return 1;
    return Math.max(...data.map(d => d.revenue), 1);
  });

  readonly yTicks = computed(() => {
    const max = this.maxRevenue();
    const step = this.niceStep(max);
    const ticks: number[] = [];
    for (let i = 0; i <= max; i += step) {
      ticks.push(i);
    }
    if (ticks[ticks.length - 1] < max) {
      ticks.push(ticks[ticks.length - 1] + step);
    }
    return ticks;
  });

  readonly totalRevenue = computed(() => this.chartData().reduce((s, d) => s + d.revenue, 0));
  readonly totalOrders = computed(() => this.chartData().reduce((s, d) => s + d.orderCount, 0));
  readonly avgRevenue = computed(() => {
    const data = this.chartData().filter(d => d.revenue > 0);
    return data.length ? this.totalRevenue() / data.length : 0;
  });

  getBarHeight(revenue: number): number {
    const max = this.yTicks()[this.yTicks().length - 1] || 1;
    return (revenue / max) * 100;
  }

  onStartDateChange(event: Event) {
    this.startDate.set((event.target as HTMLInputElement).value);
  }

  onEndDateChange(event: Event) {
    this.endDate.set((event.target as HTMLInputElement).value);
  }

  onPeriodChange(newPeriod: 'day' | 'week' | 'month') {
    const now = new Date();
    this.period.set(newPeriod);

    // Auto-adjust date range to avoid too many bars
    if (newPeriod === 'day') {
      const thirtyDaysAgo = new Date(now);
      thirtyDaysAgo.setDate(now.getDate() - 29);
      this.startDate.set(this.toDateStr(thirtyDaysAgo));
      this.endDate.set(this.toDateStr(now));
    } else if (newPeriod === 'week') {
      const twelveWeeksAgo = new Date(now);
      twelveWeeksAgo.setDate(now.getDate() - 83); // ~12 weeks
      this.startDate.set(this.toDateStr(twelveWeeksAgo));
      this.endDate.set(this.toDateStr(now));
    } else {
      const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
      this.startDate.set(this.toDateStr(sixMonthsAgo));
      this.endDate.set(this.toDateStr(now));
    }
  }

  formatPrice(price: number): string {
    if (price >= 1_000_000_000) return (price / 1_000_000_000).toFixed(1) + ' tỷ';
    if (price >= 1_000_000) return (price / 1_000_000).toFixed(1) + ' tr';
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  }

  formatShort(value: number): string {
    if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(0) + 'B';
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(0) + 'M';
    if (value >= 1_000) return (value / 1_000).toFixed(0) + 'K';
    return value.toString();
  }

  private getGroupKey(dateStr: string, period: 'day' | 'week' | 'month'): string {
    const d = new Date(dateStr);
    if (period === 'day') return dateStr.substring(0, 10);
    if (period === 'week') {
      const dayOfWeek = d.getDay();
      const monday = new Date(d);
      monday.setDate(d.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
      return this.toDateStr(monday);
    }
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }

  private formatLabel(key: string, period: 'day' | 'week' | 'month'): string {
    if (period === 'month') {
      const [y, m] = key.split('-');
      return `T${parseInt(m)}/${y.substring(2)}`;
    }
    if (period === 'week') {
      const d = new Date(key);
      return `${d.getDate()}/${d.getMonth() + 1}`;
    }
    const d = new Date(key);
    return `${d.getDate()}/${d.getMonth() + 1}`;
  }

  private generateAllKeys(start: string, end: string, period: 'day' | 'week' | 'month'): string[] {
    const keys: string[] = [];
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (period === 'month') {
      const cursor = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
      while (cursor <= endDate) {
        keys.push(`${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}`);
        cursor.setMonth(cursor.getMonth() + 1);
      }
    } else if (period === 'week') {
      const cursor = new Date(startDate);
      const dayOfWeek = cursor.getDay();
      cursor.setDate(cursor.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
      while (cursor <= endDate) {
        keys.push(this.toDateStr(cursor));
        cursor.setDate(cursor.getDate() + 7);
      }
    } else {
      const cursor = new Date(startDate);
      while (cursor <= endDate) {
        keys.push(this.toDateStr(cursor));
        cursor.setDate(cursor.getDate() + 1);
      }
    }

    return keys;
  }

  private toDateStr(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  private niceStep(max: number): number {
    const raw = max / 5;
    const magnitude = Math.pow(10, Math.floor(Math.log10(raw)));
    const residual = raw / magnitude;
    if (residual <= 1.5) return magnitude;
    if (residual <= 3) return 2 * magnitude;
    if (residual <= 7) return 5 * magnitude;
    return 10 * magnitude;
  }
}
