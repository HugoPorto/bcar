import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  Component,
  EnvironmentInjector,
  inject,
  ViewChild,
} from '@angular/core';
import {
  IonicModule,
  Platform,
  AlertController,
  IonRouterOutlet,
} from '@ionic/angular';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent {
  @ViewChild(IonRouterOutlet, { static: true }) routerOutlet!: IonRouterOutlet;
  public environmentInjector = inject(EnvironmentInjector);
  constructor(
    private platform: Platform,
    private alertController: AlertController,
    private location: Location
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.backButtonEvent();
    });
  }

  backButtonEvent() {
    this.platform.backButton.subscribeWithPriority(10, async () => {
      if (this.location.isCurrentPathEqualTo('/tabs/tab1')) {
        this.backButtonAlert();
      } else {
        this.location.back();
      }
    });
  }

  async backButtonAlert() {
    const alert = await this.alertController.create({
      message: 'Você deseja sair do aplicativo?	',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Sair',
          handler: () => {
            (navigator as any)['app'].exitApp();
          },
        },
      ],
    });

    await alert.present();
  }
}
