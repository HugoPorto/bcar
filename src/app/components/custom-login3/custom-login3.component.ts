import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import {LoginService} from '../../pages/login/login.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-custom-login3',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './custom-login3.component.html',
  styleUrls: ['./custom-login3.component.scss'],
})
export class CustomLogin3Component implements OnInit {
  lForm: FormGroup;
  logoList = ['logo-instagram', 'logo-facebook', 'logo-twitter'];
  animationClass = 'bounce-in-fwd';

  constructor(private formBuilder: FormBuilder) {
    this.lForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      pwd: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() { }

}
