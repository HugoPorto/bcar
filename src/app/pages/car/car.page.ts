import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-car',
  templateUrl: './car.page.html',
  styleUrls: ['./car.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CarPage implements OnInit {
  car?: any;
  constructor(
    private modalController: ModalController,
    private navParams: NavParams
  ) { 
    
  }

  ngOnInit() {
    this.car = this.navParams.get('car');
    console.log(this.car.carro);
  }

  dismissModal() {
    this.modalController.dismiss();
  }
}
