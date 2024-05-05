import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { Toast } from '@capacitor/toast';

@Component({
  selector: 'app-configs',
  templateUrl: './configs.page.html',
  styleUrls: ['./configs.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ConfigsPage implements OnInit {

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
  }

  cleanData() {
    this.userService.clear().then(() => {
      Toast.show({
        text: 'Dados limpos com sucesso!',
        duration: 'long'
      });
    });
  }
}
