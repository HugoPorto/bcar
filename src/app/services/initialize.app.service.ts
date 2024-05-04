import { Injectable } from '@angular/core';

import { SQLiteService } from './sqlite.service';
import { StorageService } from './storage.service';

@Injectable()
export class InitializeAppService {
  isAppInit: boolean = false;
  platform!: string;

  constructor(
    private sqliteService: SQLiteService,
    private storageService: StorageService
  ) { }

  async initializeApp() {
    await this.sqliteService.initializePlugin().then(async (ret) => {
      this.platform = this.sqliteService.platform;

      try {
        if (this.sqliteService.platform === 'web') {
          await this.sqliteService.initWebStore();
        }
  
        const DB_BCAR = 'mybcardb';
        await this.storageService.initializeDatabase(DB_BCAR);

        if (this.sqliteService.platform === 'web') {
          await this.sqliteService.saveToStore(DB_BCAR);
        }

        this.isAppInit = true;
      } catch (error) {
        console.log(`initializeAppError: ${error}`);
      }
    });
  }
}
