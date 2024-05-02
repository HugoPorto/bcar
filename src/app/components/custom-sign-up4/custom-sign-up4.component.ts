import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomLogin3Component } from '../custom-login3/custom-login3.component';
import { CustomSignUp1Component } from '../custom-sign-up1/custom-sign-up1.component';

@Component({
  selector: 'app-custom-sign-up4',
  standalone: true,
  imports: [
    IonicModule, 
    CommonModule, 
    RouterModule, 
    FormsModule, 
    ReactiveFormsModule, 
    CustomLogin3Component,
    CustomSignUp1Component
  ],
  templateUrl: './custom-sign-up4.component.html',
  styleUrls: ['./custom-sign-up4.component.scss'],
})
export class CustomSignUp4Component implements OnInit {
  selectType = 'signup';
  constructor() { }

  ngOnInit() { }

}
