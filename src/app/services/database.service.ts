import { Injectable } from '@angular/core';
import '@capacitor-community/sqlite';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  event: any = [];
  constructor(private alertCtrl: AlertController, private http: HttpClient) {}

  public downloadDatabase(update = false) {
    this.getEvnt().subscribe((res) => {
      console.log('res', res);
      this.event = res;
    });
  }

  getEvnt() {
    return this.http
      .get('https://devdactic.fra1.digitaloceanspaces.com/tutorial/db.json')
      .pipe(
        map((res: any) => {
          console.log('res', res);
          // return res.tables;
        })
      );
  }
}
