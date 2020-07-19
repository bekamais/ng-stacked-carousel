import { Component } from '@angular/core';
import { CarouselModel } from './carousel/models/CarouselModel';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  data: CarouselModel[] = [
    { title: 'Margaret Durow', url: './assets/2.jpg' },
    { title: 'Unknown', url: './assets/1.png' },
    { title: 'Tamara Lichtenstein', url: './assets/4.jpg' },
    { title: 'Louie Salto', url: './assets/5.jpg' },
  ];
}
