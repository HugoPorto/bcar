import { Component, OnInit } from '@angular/core';
import { IonicModule, ViewWillEnter, Platform } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { StorageService } from './../services/storage.service';
import { DataBudget } from '../repositories/interfaces/budget';
import { of, switchMap } from 'rxjs';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { IBudget } from '../repositories/interfaces/ibudget';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FileOpener } from '@capawesome-team/capacitor-file-opener';
import { FileService } from '../services/file.service';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { CustomCard5Component } from '../components/custom-card5/custom-card5.component';
import { Card5Service } from './card5.service';
import {timer} from 'rxjs';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  template: `<app-custom-card5 (callParentFunctionEditNavigate)="editNavigate($event)" 
    (callParentFunctionGetBudget)="getBudget($event)" 
    (callParentFunctionRemoveBudget)="removeBudget($event)"></app-custom-card5>`,
  standalone: true,
  imports: [IonicModule, ExploreContainerComponent, CommonModule, FormsModule, CustomCard5Component],
})
export class Tab1Page implements ViewWillEnter, OnInit {
  pdf: any;
  budgets: DataBudget[] = [];
  filePath: any;
  searchFlag = false;
  offset = 10;
  public data = [
    'Amsterdam',
    'Buenos Aires',
    'Cairo',
    'Geneva',
    'Hong Kong',
    'Istanbul',
    'London',
    'Madrid',
    'New York',
    'Panama City',
  ];
  public results = [...this.data];
  list: Array<any>;
  isLoading = true;

  constructor(
    private storage: StorageService,
    private router: Router,
    private platform: Platform,
    private fileService: FileService,
    private service: Card5Service
  ) {
    this.list = this.service.getList();
  }

  ngOnInit() {
    timer(2000).subscribe(r => {
      this.isLoading = !this.isLoading;
      this.loadbudgets();
    });
  }

  pdfDownload(
    budgetArray: any[],
    client: string,
    id: string,
    total: string,
    labor: string,
    filePath: string
  ) {
    const tableHeaders = [
      'Item',
      'Quantidade',
      'Unidade',
      'Descrição',
      'Valor Unitário',
      'Valor Total',
    ];

    const laborAndTotal = Math.abs(
      parseFloat(total.replace(',', '.')) - parseFloat(labor.replace(',', '.'))
    );

    var dd = {
      content: [
        {
          text: 'Orçamento Nº: ' + id,
          style: 'header',
        },
        {
          text: 'Total: ' + total,
          style: 'subheader',
        },
        {
          text: 'Mão de obra: ' + labor,
          style: 'subheader',
        },
        {
          text: 'Total - Mão de Obra: ' + laborAndTotal,
          style: 'subheader',
        },
        {
          text: 'Cliente: ' + client,
          style: 'subheader',
        },
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
          marginBottom: 5,
        },
        subheader: {
          fontSize: 14,
          bold: true,
          marginBottom: 5,
        },
      },
    };

    this.pdf = pdfMake.createPdf(dd);

    if (this.platform.is('desktop')) {
      this.pdf.download('Orçamento ' + client + '.pdf');
    } else if (this.platform.is('android')) {
      this.pdf.getBase64(async (data: any) => {
        try {
          let path = `pdf/bcar/orcameto_${client}.pdf`;

          if (!filePath) {
            const result = await Filesystem.writeFile({
              path,
              data: data,
              directory: Directory.Documents,
              recursive: true,
            });

            this.storage.updateFilePathBudgetById(id, result.uri);

            try {
              await FileOpener.openFile({
                path: result.uri,
              });
            } catch (e) {
              console.log('Erro: Acesso ao arquivo negado!', e);
            }
          } else {
            try {
              await FileOpener.openFile({
                path: filePath,
              });
            } catch (e) {
              console.log('Erro: Acesso ao arquivo negado!', e);
            }
          }
        } catch (e) {
          console.log('Erro: Não foi possível salvar o arquivo!', e);
        }
      });
    }
  }

  editNavigate(budgetId: number) {
    this.router.navigate(['/tabs/tab2'], {
      queryParams: { id: budgetId },
    });
  }

  ionViewWillEnter() {
    this.offset = 10;
    this.loadbudgets();
  }

  loadbudgets() {
    this.searchFlag = false;
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

  async removeBudget({ budgetId, client }: { budgetId: number, client: string }) {
    if (this.platform.is('android')) {
      this.fileService.deleteReportFile(client, budgetId.toString());
    }
    await this.storage.deleteBudgetById(budgetId.toString());
  }

  async getBudget(id: number) {
    this.storage.getBudget(id.toString()).then((budget) => {
      const dataBudget: IBudget[] = JSON.parse(budget?.budget || '');
      const id = budget?.id || '';
      const client = budget?.client || '';
      const total = budget?.total || '';
      const labor = budget?.labor || '';
      const filePath = budget?.filePath || '';
      const budgetArray: any[] = [];

      dataBudget.forEach((element, index) => {
        const orderedObject = {
          _quantity: element._quantity,
          _unit: element._unit,
          _description: element._description,
          _unitaryValue: element._unitaryValue,
          _totalValue: element._totalValue,
        };

        const subArray = Object.values(orderedObject);
        subArray.unshift((index + 1).toString());
        budgetArray.push(subArray);
      });

      this.pdfDownload(
        budgetArray,
        client,
        id.toString(),
        total,
        labor,
        filePath
      );
    });
  }

  handleInput(event: any) {
    const query = event.target.value.toLowerCase();
    if (query !== '') {
      this.budgets = this.budgets.filter(
        (d) => d.client.toLocaleLowerCase().indexOf(query) > -1
      );
      if (this.budgets.length === 0) {
        this.storage.getBudgetByName(event.target.value).then((budget) => {
          if (budget) {
            this.budgets = [budget];
          } else {
            this.searchFlag = true;
          }
        });
      } else {
        this.searchFlag = false;
      }
    } else {
      this.loadbudgets();
    }
  }

  private getItems() {
    this.storage.loadBudgetsPaging(this.offset).then((budgets) => {
      if (budgets.length > 0) {
        budgets.forEach((budget) => {
          this.budgets.push(budget);
        });
        this.offset += 10;
      }
    });
  }

  onIonInfinite(ev: any) {
    this.getItems();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  signup() {
    this.router.navigate(['/signup']);
  }
}
