import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, ViewWillEnter } from '@ionic/angular';

import { DataClient } from '../../repositories/interfaces/client';
import { ClientService } from '../../services/client.service';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.page.html',
  styleUrls: ['./clients.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ClientsPage implements OnInit, ViewWillEnter {
  clients: DataClient[] = [];

  constructor(
    private storage: ClientService,
    private router: Router
  ) { }

  ngOnInit() {}

  ionViewWillEnter() {
    this.loadClietns();
  }

  loadClietns() {
    try {
      this.storage
        .clientState()
        .pipe(
          switchMap((res) => {
            if (res) {
              return this.storage.fetchClients();
            } else {
              return of([]);
            }
          })
        )
        .subscribe((data) => {
          this.clients = data;
        });
    } catch (err) {
      throw new Error(`Error: ${err}`);
    }
  }

  async onEdit(id: number) {
    this.router.navigate(['/client'], {
      queryParams: { id: id },
    });
  }
}
