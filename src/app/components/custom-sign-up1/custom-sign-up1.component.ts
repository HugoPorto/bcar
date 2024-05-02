import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-custom-sign-up1',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './custom-sign-up1.component.html',
  styleUrls: ['./custom-sign-up1.component.scss'],
})
export class CustomSignUp1Component  implements OnInit {
  rForm: FormGroup;
  constructor(private formBuilder: FormBuilder,) { 
    this.rForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      pwd: ['', [Validators.required, Validators.minLength(6)]],
  });
  }

  ngOnInit() {}

}
