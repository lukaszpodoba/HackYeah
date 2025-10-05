import { AfterViewInit, Component, effect, inject, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { Map as MapLibreMap, Marker, NavigationControl, Popup } from 'maplibre-gl';
import { FeedStateService } from '../../service/feed-state-service';
import { TReport } from '../../model/feed.model';
import { FeedCardComponent } from '../../dumb-components/feed-card-component/feed-card-component';
import { markerClassByType } from '../../../../core/models/util.model';
import { FeedUiService } from '../../service/feed-ui-service';

@Component({
  selector: 'app-feed-container',
  imports: [MatSidenavModule, MatButtonModule, FeedCardComponent, MatDividerModule, MatIconModule],
  templateUrl: './feed-container.html',
})
export class FeedContainer implements AfterViewInit, OnDestroy {
  private map?: MapLibreMap;
  private markers = new Map<string, Marker>();
  readonly state = inject(FeedStateService);
  private ui = inject(FeedUiService);

  constructor() {
    effect(() => {
      const items = this.state.reports();
      this.refreshMarkers(items);
    });
  }

  ngAfterViewInit(): void {
    const style = {
      version: 8,
      sources: {
        osm: {
          type: 'raster',
          tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution: '© OpenStreetMap contributors',
        },
      },
      layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
    } as any;

    this.map = new MapLibreMap({
      container: 'map',
      style,
      center: [19.94498, 50.06465],
      zoom: 11,
    });

    this.map.addControl(new NavigationControl({ visualizePitch: true }), 'top-right');

    this.state.load([19.94498, 50.06465]);
  }

  ngOnDestroy(): void {
    this.clearMarkers();
    this.map?.remove();
  }

  focusReport(name: string) {
    const item = this.state.reports().find((x) => x.id === name);
    if (!item || !this.map) return;

    this.map.flyTo({
      center: [item.stop.longitude, item.stop.latitude],
      zoom: Math.max(this.map.getZoom(), 14),
    });

    const m = this.markers.get(name);
    m?.togglePopup();
  }

  onCardClicked(report: TReport) {
    this.ui.openReport(report);
    this.map?.flyTo({
      center: [report.stop.longitude, report.stop.latitude],
      zoom: Math.max(this.map.getZoom() ?? 0, 14),
    });
  }

  onVote(e: { reportId: string; value: 1 | -1 }) {
    this.state.vote(e.reportId as any, e.value);
  }

  private refreshMarkers(items: TReport[]) {
    if (!this.map) return;

    this.clearMarkers();

    for (const report of items) {
      const el = document.createElement('div');
      el.className = `marker-base ${markerClassByType[report.category]} text-white`;
      el.innerHTML = `
        <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      `;

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        this.ui.openReport(report);
      });

      const marker = new Marker({ element: el, anchor: 'bottom' })
        .setLngLat([report.stop.longitude, report.stop.latitude])
        .addTo(this.map);

      this.markers.set(report.id ?? '', marker);
    }
  }

  private clearMarkers() {
    this.markers.forEach((m) => m.remove());
    this.markers.clear();
  }
}
