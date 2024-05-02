import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import {SideMenuOption} from './models/side-menu-option';

@Component({
  selector: 'app-custom-side-menu',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
  templateUrl: './custom-side-menu.component.html',
  styleUrls: ['./custom-side-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CustomSideMenuComponent implements OnInit{
  optionHeight = 45;
  paddingLeft = 16;
  @Input()menuList!: Array<SideMenuOption>;

  constructor() { }

  toggle(item: any) {
    item.expanded = !item.expanded;
  }

  ngOnInit(): void {
    console.log('CustomSideMenuComponent initialized!');
  }
}
