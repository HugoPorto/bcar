import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomLogin3Component } from '../custom-login3/custom-login3.component';
import { CustomSignUp1Component } from '../custom-sign-up1/custom-sign-up1.component';

@Component({
  selector: 'app-custom-card5',
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CustomLogin3Component,
    CustomSignUp1Component
  ],
  templateUrl: './custom-card5.component.html',
  styleUrls: ['./custom-card5.component.scss'],
})
export class CustomCard5Component implements OnInit {
  @Input() list?: Array<any>;
  @Output() callParentFunctionEditNavigate = new EventEmitter<number>();
  @Output() callParentFunctionGetBudget = new EventEmitter<number>();
  @Output() callParentFunctionRemoveBudget = new EventEmitter<{ budgetId: number, client: string }>();

  constructor() { }

  ngOnInit() {
    console.log('CustomCard5Component');
  }

  callFunctionEditNavigate(budgetId: number) {
    this.callParentFunctionEditNavigate.emit(budgetId);
  }

  callFunctionBudget(budgetId: number) {
    this.callParentFunctionGetBudget.emit(budgetId);
  }

  callFunctionRemoveBudget(budgetId: number, client: string) {
    this.callParentFunctionRemoveBudget.emit({ budgetId: budgetId, client: client });
  }
}