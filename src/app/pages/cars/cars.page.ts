import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { CarsHelper } from 'src/helpers/cars';
import { CarPage } from '../car/car.page';

@Component({
  selector: 'app-cars',
  templateUrl: './cars.page.html',
  styleUrls: ['./cars.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CarsPage implements OnInit {
  public cars = CarsHelper.getCars();
  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {}

  async viewCar(car: any) {

    const modal = await this.modalController.create({ component: CarPage, componentProps: { car: car }});
    await modal.present();
  }
}
