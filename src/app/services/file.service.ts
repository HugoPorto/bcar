import { Injectable } from '@angular/core';

import { Filesystem, Directory } from '@capacitor/filesystem';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor(private storage: StorageService) {}

  async deleteReportFile(client: string, budgetId: string) {
    let path = `pdf/bcar/orcameto_${client}.pdf`;

    await Filesystem.stat({
      path: path,
      directory: Directory.Documents,
    })
      .then((result) => {
        if (result.type === 'file') {
          console.log('Tab2[Novo] - Linha 77: ', 'O arquivo existe.');
          Filesystem.deleteFile({
            path: path,
            directory: Directory.Documents,
          });
          this.storage.updateFilePathBudgetById(budgetId, '');
        } else if (result.type === 'directory') {
          console.log(
            'Tab2[Novo] - Linha 81: ',
            'O caminho especificado é um diretório.'
          );
        } else {
          console.log('Tab2[Novo] - Linha 86: ', 'O arquivo não existe.');
        }
      })
      .catch((error) => {
        console.error(
          'Tab2[Novo] - Linha 94: Erro ao verificar a existência do arquivo:',
          error
        );
      });
  }
}
