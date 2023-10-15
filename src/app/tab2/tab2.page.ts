import { Component } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { StorageService } from './../services/storage.service';
import { DatabaseService } from '../services/database.service';
import { ActivatedRoute } from '@angular/router';
import { Budget } from '../models/budget';
import { IBudget } from '../repositories/interfaces/ibudget';
import { Router } from '@angular/router';

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
  total: string = '0';
  client: string = '';
  budgetId: string = '';

  constructor(
    private alertController: AlertController,
    private storage: StorageService,
    private databaseService: DatabaseService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.buildBudget();
    // this.databaseService.downloadDatabase();
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      const budgetId = params['id'];

      if (budgetId) {
        this.budgetId = budgetId;
        this.storage.getBudget(budgetId).then((budget) => {
          var dataBudget: IBudget[] = JSON.parse(budget?.budget || '');

          this.modelBudget.client = budget?.client || '';

          this.budgets = [];

          dataBudget.forEach((element) => {
            var newbudget = new Budget(element._quantity, element._unit);
            newbudget.description = element._description;
            newbudget.unitaryValue = element._unitaryValue;
            newbudget.totalValue = element._totalValue;
            newbudget.client = element._client;
            newbudget.created = element._created;
            newbudget.modified = element._modified;
            this.budgets.push(newbudget);
          });

          this.total = this.calculateTotalValue();
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
    }
    this.restartBudget();
    this.budgets = [];
    this.total = '0';
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
    if (!this.modelBudget.verifyFields()) {
      this.alertFormError('Preencha os campos obrigatírios!');
    } else {
      this.updateTotalValue();

      this.budgets.push(this.modelBudget);

      this.total = this.calculateTotalValue();

      this.buildBudget();
    }
  }

  buildBudget() {
    if (
      this.client == null ||
      this.client == '' ||
      this.client !== this.modelBudget.client
    ) {
      if (this.modelBudget) {
        this.client = this.modelBudget.client;
      }
    }

    this.restartBudget();
  }

  restartBudget() {
    this.modelBudget = new Budget('1', 'Peça');
    this.modelBudget.unitaryValue = '0,00';
    this.modelBudget.totalValue = '0,00';
    this.modelBudget.client = this.client;
  }

  calculateTotalValue(): string {
    let total = 0;

    for (const budget of this.budgets) {
      const totalValue = parseFloat(budget.totalValue.replace(',', '.'));

      if (!isNaN(totalValue)) {
        total += totalValue;
      }
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
      this.modelBudget.client
    );

    this.restartData();

    this.router.navigate(['/tabs/tab1']);
  }

  async updateBudget() {
    await this.storage.updateBudgetById(
      this.budgetId,
      JSON.stringify(this.budgets),
      this.modelBudget.client
    );

    this.restartData();

    this.router.navigate(['/tabs/tab1']);
  }

  async saveAndSend() {
    this.createBudget();
    this.shareBudget();
  }

  async shareBudget() {}

  async discard() {}
}
