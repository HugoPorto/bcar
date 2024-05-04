import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';

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

  constructor(private formBuilder: FormBuilder, private userService: UserService) {
    this.lForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit() {
    this.userService.get('token').then(value => {
      console.log('Token:', value);
    });
  }

  onSubmit() {
    this.userService.getToken(this.lForm.value).subscribe({
      next: (response) => {
        this.userService.set('token', response.token);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
