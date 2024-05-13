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
import { Router } from '@angular/router';

import { CustomSideMenuComponent } from './components/custom-side-menu/custom-side-menu.component';
import { UserService } from './services/user.service';
import { SideMenuHelper } from 'src/helpers/side-menu';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, CustomSideMenuComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent {
  @ViewChild(IonRouterOutlet, { static: true }) routerOutlet!: IonRouterOutlet;
  public environmentInjector = inject(EnvironmentInjector);
  public pageList = SideMenuHelper.getSideMenu();
  public name?: string;

  constructor(
    private platform: Platform,
    private alertController: AlertController,
    private location: Location,
    private router: Router,
    private userService: UserService,
  ) {
    this.initializeApp();
    this.userService.login.subscribe((value) => {
      if (!value) {
        this.pageList = SideMenuHelper.getSideMenu();
      } else {
        if (this.pageList[1] && this.pageList[1].subOptions) {
          console.log(this.pageList[1].subOptions[1]);
          this.removeRegister();
        }
      }
    });
  }

  async ngAfterViewInit() {
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      const loginValue = await this.userService.get('login');
      console.log(loginValue);
      if (loginValue) {
        const emailValue = await this.userService.get('email');
        console.log(emailValue);
        this.name = emailValue;
        this.removeRegister();
      }
    } catch (error) {
      console.error(error);
    }
  }

  private removeRegister() {
    if (this.pageList[1] && this.pageList[1].subOptions) {
      this.pageList[1].subOptions.splice(1, 1);
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.backButtonEvent();
    });
  }

  getCurrentUrl() {
    return this.router.url;
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
