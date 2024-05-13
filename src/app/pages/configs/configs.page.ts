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
  configUseClient?: boolean;

  constructor(
    private userService: UserService,
  ) { }

  async ngOnInit() {
    try {
      const keys = await this.userService.keys();
      console.log(keys);
      this.configUseClient = await this.userService.get('clientUse');
    } catch (error) {
      console.error(error);
    }
  }

  cleanData() {
    this.userService.removeUser('email', 'login', 'token').then(() => {
      Toast.show({
        text: 'Dados limpos!',
        duration: 'long'
      });
    });
  }

  async useClient() {
    try {
      await this.userService.setClient(!this.configUseClient);
      this.configUseClient = !this.configUseClient;
      console.log(this.configUseClient);
      const toastText = this.configUseClient ? 'Clientes selecionados!' : 'Clientes não selecionados!';
      Toast.show({
        text: toastText,
        duration: 'long'
      });
    } catch (error) {
      console.error(error);
    }
  }
}
