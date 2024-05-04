import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder, 
  FormGroup, 
  FormsModule, 
  ReactiveFormsModule, 
  Validators} from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';

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
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService
  ) { 
    this.rForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      name: ['', [Validators.required, Validators.minLength(3)]],
  });
  }

  ngOnInit() {}

  onSubmit() {
    console.log(this.rForm.value);
    this.userService.addUser(this.rForm.value).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
