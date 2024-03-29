import { Component } from '@angular/core';
import { IonicModule, AlertController, Platform } from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { StorageService } from './../services/storage.service';
import { Budget } from '../models/budget';
import { IBudget } from '../repositories/interfaces/ibudget';
import { FileService } from '../services/file.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, ExploreContainerComponent, FormsModule, CommonModule],
})
export class Tab2Page {
  modelBudget!: Budget;
  budgets: Budget[] = [];
  total: string = '0,00';
  client: string = '';
  labor: string = '';
  budgetId: string = '';

  constructor(
    private alertController: AlertController,
    private storage: StorageService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private platform: Platform,
    private fileService: FileService
  ) {
    this.buildBudget();
  }

  ngOnInit() {
    this.loadData();
  }

  onLaborChange() {
    this.total = this.calculateTotalValue();
  }

  loadData() {
    this.activatedRoute.queryParams.subscribe((params) => {
      const budgetId = params['id'];

      if (budgetId) {
        this.budgetId = budgetId;
        this.storage.getBudget(budgetId).then((budget) => {
          var dataBudget: IBudget[] = JSON.parse(budget?.budget || '');

          this.labor = budget?.labor || '';
          this.client = budget?.client || '';
          this.budgets = [];

          dataBudget.forEach((element) => {
            var newbudget = new Budget(element._quantity, element._unit);
            newbudget.description = element._description;
            newbudget.unitaryValue = element._unitaryValue;
            newbudget.totalValue = element._totalValue;
            newbudget.created = element._created;
            newbudget.modified = element._modified;
            this.budgets.unshift(newbudget);
          });

          this.total = this.calculateTotalValue();

          if (this.platform.is('android')) {
            this.fileService.deleteReportFile(this.client, budgetId);
          }
        });
      } else {
        this.restartData(budgetId);
      }
    });
  }

  restartData(budgetId: number = 0) {
    if (budgetId === 0) {
      this.client = '';
      this.budgetId = '';
      this.labor = '0,00';
    }
    this.restartBudget();
    this.budgets = [];
    this.total = '0,00';
  }

  async alertFormError(message: string) {
    const alert = await this.alertController.create({
      message: message,
      buttons: [
        {
          text: 'Fechar',
          role: 'cancel',
        },
      ],
    });

    await alert.present();
  }

  updateTotalValue() {
    this.modelBudget.updateTotalValue();
  }

  addBudget() {
    const verify = this.modelBudget.verifyFields(this.client, this.labor);
    if (!verify[0]) {
      this.alertFormError(verify[1]);
    } else {
      this.updateTotalValue();
      this.budgets.unshift(this.modelBudget);
      this.total = this.calculateTotalValue();
      this.buildBudget();
    }
  }

  buildBudget() {
    this.restartBudget();
  }

  restartBudget() {
    this.modelBudget = new Budget('1', 'Peça');
    this.modelBudget.unitaryValue = '0,00';
    this.modelBudget.totalValue = '0,00';
  }

  calculateTotalValue(): string {
    let total = 0;

    for (const budget of this.budgets) {
      let totalValue = parseFloat(budget.totalValue.replace(',', '.'));

      if (!isNaN(totalValue)) {
        total += totalValue;
      }
    }

    let laborValue = parseFloat(this.labor.replace(',', '.'));

    if (!isNaN(laborValue)) {
      total += laborValue;
    }

    return total.toFixed(2).replace('.', ',');
  }

  removeItemBudget(index: number) {
    if (index >= 0 && index < this.budgets.length) {
      this.budgets.splice(index, 1);
      this.total = this.calculateTotalValue();
    }
  }

  async createBudget() {
    await this.storage.addBudget(
      JSON.stringify(this.budgets),
      this.client,
      this.total,
      this.labor
    );

    this.restartData();
    this.router.navigate(['/tabs/tab1']);
  }

  async updateBudget() {
    this.total = this.calculateTotalValue();

    await this.storage.updateBudgetById(
      this.budgetId,
      JSON.stringify(this.budgets),
      this.client,
      this.total,
      this.labor
    );

    this.restartData();

    this.router.navigate(['/tabs/tab1']);
  }

  async saveAndSend() {
    this.createBudget();
  }
}
