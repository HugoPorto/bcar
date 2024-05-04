import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CustomSignUp4Component } from '../../components/custom-sign-up4/custom-sign-up4.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, CustomSignUp4Component]
})
export class SignupPage implements OnInit {
  returnUrl: string = 'tabs';

  constructor() {}

  ngOnInit() {}

}
