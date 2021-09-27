import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [
    `
      #zoomrange {
        height: 100%;
        width: 100%;
      }

      .row {
        background-color: white;
        border-radius: 5px;
        bottom: 50px;
        left: 50px;
        padding: 10px;
        position: fixed;
        z-index: 9999;
        width: 400px;
      }
    `,
  ],
})
export class ZoomRangeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel: number = 10;
  center: [number, number] = [-93.06181247172965, 18.177340080073645];

  constructor() {}
  // HAY QUE DESTRUIR TODOS LOS LISTENER CUANDO SE DESTRUYE EL COMPONENTE
  ngOnDestroy(): void {
    this.mapa.off('zoom', () => {});
    this.mapa.off('zoomed', () => {});
    this.mapa.off('mousemove', () => {});
  }

  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel,
    });

    this.mapa.on('zoom', (ev) => {
      this.zoomLevel = this.mapa.getZoom();
    });

    this.mapa.on('zoomend', (ev) => {
      if (this.mapa.getZoom() > 18) this.mapa.zoomTo(18);
    });

    this.mapa.on('mousemove', (ev) => {
      const { lat, lng } = ev.lngLat;
      this.center = [lat, lng];
    });
  }

  zoomCambio(valor: string) {
    this.mapa.zoomTo(Number(valor));
  }

  zoomIn() {
    this.mapa.zoomIn();
  }

  zoomOut() {
    this.mapa.zoomOut();
  }
}
