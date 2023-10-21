import { Component } from '@angular/core';
import {
  IonicModule,
  ViewWillEnter,
  Platform,
  AlertController,
} from '@ionic/angular';
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
import { FileOpener } from '@capawesome-team/capacitor-file-opener';
import { FilePicker } from '@capawesome/capacitor-file-picker';

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
  imageSrc1: any;
  imageSrc2: any;
  filePath: any;

  constructor(
    private storage: StorageService,
    private router: Router,
    private platform: Platform,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.loadbudgets();
  }

  showlFilePath() {
    alert(this.filePath);
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
              await Toast.show({
                text: `Erro: Acesso ao arquivo negado!`,
                duration: 'long',
              });
            }
          } else {
            try {
              await FileOpener.openFile({
                path: filePath,
              });
            } catch (e) {
              await Toast.show({
                text: `Erro: Acesso ao arquivo negado!`,
                duration: 'long',
              });
            }
          }
        } catch (e) {
          await Toast.show({
            text: `Erro: Não foi possível salvar o arquivo!`,
            duration: 'long',
          });
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

  writeSecretFile = async () => {
    await Filesystem.writeFile({
      path: 'secrets/text.txt',
      data: 'This is a test',
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    });
  };

  // readSecretFile = async () => {
  //   const contents = await Filesystem.readFile({
  //     path: 'secrets/text.txt',
  //     directory: Directory.Documents,
  //     encoding: Encoding.UTF8,
  //   });

  //   console.log('secrets:', contents);
  // };

  deleteSecretFile = async () => {
    await Filesystem.deleteFile({
      path: 'secrets/text.txt',
      directory: Directory.Documents,
    });
  };

  // readFilePath = async () => {
  //   const contents = await Filesystem.readFile({
  //     path: 'file:///var/mobile/Containers/Data/Application/22A433FD-D82D-4989-8BE6-9FC49DEA20BB/Documents/text.txt',
  //   });

  //   console.log('data:', contents);
  // };

  open = async () => {
    await FileOpener.openFile({
      path: 'content://com.android.providers.downloads.documents/document/msf%3A1000000073',
    });
  };

  // pickFiles = async () => {
  //   const result = await FilePicker.pickFiles({
  //     types: ['image/jpg'],
  //     multiple: false,
  //     readData: true,
  //   });

  //   this.filePath = result.files[0].path;

  //   this.imageSrc1 = 'data:image/jpg;base64,' + result.files[0].data;

  //   const alert = await this.alertController.create({
  //     message: result.files[0].data,
  //     buttons: [
  //       {
  //         text: 'Fechar',
  //         role: 'cancel',
  //       },
  //     ],
  //   });

  //   await alert.present();
  // };

  // pickImages = async () => {
  //   const result = await FilePicker.pickImages({
  //     multiple: false,
  //     readData: true,
  //   });

  //   this.imageSrc1 = 'data:image/jpg;base64,' + result.files[0].data;
  //   this.imageSrc2 = 'data:image/jpg;base64,' + result.files[1].data;
  // };

  pickPDFFiles = async () => {
    const result = await FilePicker.pickFiles({
      types: ['application/pdf'],
      multiple: false,
      readData: true,
    });

    result ? (this.filePath = result.files[0].path) : (this.filePath = '');
  };

  openFile = async () => {
    try {
      await FileOpener.openFile({
        path: this.filePath,
      });
    } catch (e) {
      alert(e);
    }
  };
}
