import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { CustomSignUp4Component } from '../../components/custom-sign-up4/custom-sign-up4.component';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, CustomSignUp4Component]
})
export class SignupPage implements OnInit {
  returnUrl: string = 'tabs';
  login: Subscription;
  constructor(
    private userService: UserService,
    private router: Router
  ) {
    this.login = this.userService.login.subscribe((value) => {
      if (value) {
        this.router.navigate(['/profile']);
      }
    });
  }

  ngOnInit() {
    
  }

  ionViewDidEnter() {
    this.userService.keys().then(value => {
      this.userService.get('login').then(value => {
        if (value) {
          this.router.navigate(['/profile']);
        }
      });
    });
  }
}
