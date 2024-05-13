import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, ViewWillEnter } from '@ionic/angular';

import { DataClient } from '../../repositories/interfaces/client';
import { ClientService } from '../../services/client.service';
import { of, switchMap } from 'rxjs';
import { InfiniteScrollCustomEvent } from '@ionic/angular';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.page.html',
  styleUrls: ['./clients.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ClientsPage implements OnInit, ViewWillEnter {
  clients: DataClient[] = [];
  searchFlag = false;
  offset = 10;

  constructor(
    private storage: ClientService,
    private router: Router
  ) { }

  ngOnInit() {}

  ionViewWillEnter() {
    this.loadClietns();
  }

  handleInput(event: any) {
    const query = event.target.value.toLowerCase();
    if (query !== '') {
      this.clients = this.clients.filter(
        (d) => d.name.toLocaleLowerCase().indexOf(query) > -1
      );
      if (this.clients.length === 0) {
        this.storage.getClientByName(event.target.value).then((budget) => {
          if (budget) {
            this.clients = [budget];
          } else {
            this.searchFlag = true;
          }
        });
      } else {
        this.searchFlag = false;
      }
    } else {
      this.loadClietns();
    }
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

  async openClient() {
    this.router.navigate(['/client']);
  }

  private getItems() {
    this.storage.loadClientsPaging(this.offset).then((clients) => {
      if (clients.length > 0) {
        clients.forEach((client) => {
          this.clients.push(client);
        });
        this.offset += 10;
      }
    });
  }

  onIonInfinite(ev: any) {
    console.log('ionInfinite');
    this.getItems();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }
}
