import { Component } from '@angular/core';
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
import { Toast } from '@capacitor/toast';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

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
    private platform: Platform
  ) {}

  ngOnInit() {
    this.showPlatform();
    this.loadbudgets();
  }

  async showPlatform() {
    let platform = '';
    if (this.platform.is('android')) {
      platform = 'android';
    } else {
      platform = 'desktop';
    }
    await Toast.show({
      text: `Plataforma: ${platform}`,
      duration: 'long',
    });
  }

  pdfDownload(
    budgetArray: any[],
    client: string,
    id: string,
    total: string,
    labor: string
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
          const result = await Filesystem.writeFile({
            path,
            data: data,
            directory: Directory.Documents,
            recursive: true,
          });
        } catch (e) {
          console.error('Unable to write file', e);
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
      const dataBudget: IBudget[] = JSON.parse(budget?.budget || '');
      const id = budget?.id || '';
      const client = budget?.client || '';
      const total = budget?.total || '';
      const labor = budget?.labor || '';
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

      this.pdfDownload(budgetArray, client, id.toString(), total, labor);
    });
  }

  writeSecretFile = async () => {
    await Filesystem.writeFile({
      path: 'secrets/text.txt',
      data: 'This is a test',
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    });
  };

  readSecretFile = async () => {
    const contents = await Filesystem.readFile({
      path: 'secrets/text.txt',
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    });

    console.log('secrets:', contents);
  };

  deleteSecretFile = async () => {
    await Filesystem.deleteFile({
      path: 'secrets/text.txt',
      directory: Directory.Documents,
    });
  };

  readFilePath = async () => {
    // Here's an example of reading a file with a full file path. Use this to
    // read binary data (base64 encoded) from plugins that return File URIs, such as
    // the Camera.
    const contents = await Filesystem.readFile({
      path: 'file:///var/mobile/Containers/Data/Application/22A433FD-D82D-4989-8BE6-9FC49DEA20BB/Documents/text.txt',
    });

    console.log('data:', contents);
  };
}
