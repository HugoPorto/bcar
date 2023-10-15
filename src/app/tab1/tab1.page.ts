import { Component } from '@angular/core';
import { IonicModule, ViewWillEnter } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { StorageService } from './../services/storage.service';
import { DataBudget } from '../repositories/interfaces/budget';
import { of, switchMap } from 'rxjs';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { IBudget } from '../repositories/interfaces/ibudget';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, ExploreContainerComponent, CommonModule, FormsModule],
})
export class Tab1Page implements ViewWillEnter {
  pdf: any;
  budgets: DataBudget[] = [];

  constructor(
    private storage: StorageService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadbudgets();
  }

  pdfDownload(budgetArray: any[]) {
    const tableHeaders = [
      'Item',
      'Quantidade',
      'Descrição',
      'Valor Unitário',
      'Valor Total',
      'Valor Total',
    ];

    var dd = {
      content: [
        { text: 'Orçamento', style: 'header' },
        {
          style: 'tableExample',
          table: {
            widths: ['*', '*', '*', '*', '*', '*'],
            body: [tableHeaders, ...budgetArray],
          },
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: 0,
        },
      },
    };
    this.pdf = pdfMake.createPdf(dd);
    this.pdf.download('demo.pdf');
  }

  editNavigate(budgetId: number) {
    this.router.navigate(['/tabs/tab2'], {
      queryParams: { id: budgetId },
    });
  }

  ionViewWillEnter() {
    this.loadbudgets();
  }

  loadbudgets() {
    try {
      this.storage
        .budgetState()
        .pipe(
          switchMap((res) => {
            if (res) {
              return this.storage.fetchBudgets();
            } else {
              return of([]);
            }
          })
        )
        .subscribe((data) => {
          this.budgets = data;
        });
    } catch (err) {
      throw new Error(`Error: ${err}`);
    }
  }

  async removeBudget(id: number) {
    await this.storage.deleteBudgetById(id.toString());
  }

  async getBudget(id: number) {
    this.storage.getBudget(id.toString()).then((budget) => {
      var dataBudget: IBudget[] = JSON.parse(budget?.budget || '');
      var budgetArray: any[] = [];
      dataBudget.forEach((element) => {
        budgetArray.push(Object.values(element));
      });

      // console.log(budgetArray);
      this.pdfDownload(budgetArray);
    });
  }
}
