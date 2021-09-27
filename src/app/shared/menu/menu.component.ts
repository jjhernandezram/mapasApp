import { Component, OnInit } from '@angular/core';

interface MenuItem {
  name: string;
  route: string;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styles: [
    `
      li {
        cursor: pointer;
      }
    `,
  ],
})
export class MenuComponent implements OnInit {
  menu: MenuItem[] = [
    {
      name: 'Fullscreen',
      route: './mapas/fullscreen',
    },
    {
      name: 'Zoom Range',
      route: './mapas/zoom-range',
    },
    {
      name: 'Marcadores',
      route: './mapas/marcadores',
    },
    {
      name: 'Propiedades',
      route: './mapas/propiedades',
    },
  ];
  constructor() {}

  ngOnInit(): void {}
}
