import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface Marcadores {
  color: string;
  marker?: mapboxgl.Marker;
  lngLat?: [number, number];
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [
    `
      .mapa-container {
        height: 100%;
        width: 100%;
      }

      .list-group {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 999;
      }

      .marker {
        width: 120px;
        height: 5px;
        background-color: red;
      }

      li {
        cursor: pointer;
      }
    `,
  ],
})
export class MarcadoresComponent implements AfterViewInit {
  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel: number = 10;
  center: [number, number] = [-93.06181247172965, 18.177340080073645];
  marcadores: Marcadores[] = [];

  constructor() {}
  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel,
    });

    this.leerLocalStorage();
  }

  agregarMarker() {
    // Metodo para generar codigo de color hexadecimal de manera aleatoria para los marcadores.
    const colorHex = '#xxxxxx'.replace(/x/g, (y) =>
      ((Math.random() * 16) | 0).toString(16)
    );

    // Generando un nuevo marcador
    const nuevoMarker = new mapboxgl.Marker({
      draggable: true,
      color: colorHex,
    })
      .setLngLat(this.center)
      .addTo(this.mapa);

    // Agregando el nuevo marcador al arreglo de marcadores que se muestran como lista en el mapa
    this.marcadores.push({ marker: nuevoMarker, color: colorHex });

    // Guardando en localStorage cada vez que se genere un marcador nuevo.
    this.guardarLocalStorage();

    nuevoMarker.on('dragend', () => {
      this.guardarLocalStorage();
    });
  }

  moverAlMarcador(lngLat: mapboxgl.Marker) {
    this.mapa.flyTo({ center: lngLat.getLngLat() });
  }

  guardarLocalStorage() {
    const marcadoresArr: Marcadores[] = [];
    this.marcadores.forEach((m) => {
      const { lng, lat } = m.marker?.getLngLat()!;

      marcadoresArr.push({ color: m.color, lngLat: [lng, lat] });
    });

    localStorage.setItem('marcadores', JSON.stringify(marcadoresArr));
  }

  leerLocalStorage() {
    if (!localStorage.getItem('marcadores')) return;

    const marcadoresArr: Marcadores[] = JSON.parse(
      localStorage.getItem('marcadores')!
    );

    marcadoresArr.forEach((m) => {
      const newMarker = new mapboxgl.Marker({
        draggable: true,
        color: m.color,
      })
        .setLngLat(m.lngLat!)
        .addTo(this.mapa);

      this.marcadores.push({ color: m.color, marker: newMarker });

      newMarker.on('dragend', () => {
        this.guardarLocalStorage();
      });
    });
  }

  borrarMarcador(index: number) {
    this.marcadores[index].marker?.remove();
    this.marcadores.splice(index, 1);
    this.guardarLocalStorage();
  }
}
