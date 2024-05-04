import { Injectable } from '@angular/core';

import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { DataClient } from '../repositories/interfaces/client';
import { BehaviorSubject, Observable } from 'rxjs';
import { Toast } from '@capacitor/toast';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  public clientList: BehaviorSubject<DataClient[]> = new BehaviorSubject<DataClient[]>([]);
  private isClientReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private db: SQLiteDBConnection;

  constructor(private storage: StorageService) {
    this.db = this.storage.getConnection();
    this.getClients();
  }

  async getClient(id: string) {
    const sql = `SELECT * FROM clients WHERE id=${id}`;
    const result = await this.db.query(sql);

    if (result && result.values && result.values.length > 0) {
      const client = result.values[0] as DataClient;
      return client;
    }

    return null;
  }

  clientState() {
    return this.isClientReady.asObservable();
  }

  fetchClients(): Observable<DataClient[]> {
    return this.clientList.asObservable();
  }

  async getClients() {
    await this.loadClients();
    this.isClientReady.next(true);
  }

  async loadClients() {
    const clients: DataClient[] = (
      await this.db.query('SELECT * FROM clients ORDER BY id DESC LIMIT 10;')
    ).values as DataClient[];

    this.clientList.next(clients);
    this.isClientReady.next(true);
  }

  async addClient(
    name: string,
    email: string,
    address: string,
    phone: string
  ) {

    const sql = `INSERT INTO clients (name, email, address, phone) VALUES (?,?,?,?);`;

    await this.db.run(sql, [
      name,
      email,
      address,
      phone
    ]);

    await this.loadClients();

    await Toast.show({
      text: `Cliente salvo com sucesso!`,
      duration: 'long',
    });
  }

  async updateClient(
    id: string,
    name: string,
    email: string,
    address: string,
    phone: string
  ) {

    const sql = `UPDATE clients SET name='${name}',
      email="${email}",
      address="${address}",
      phone="${phone}" WHERE id=${id}`;

    await this.db.run(sql);
    await this.loadClients();
    await Toast.show({
      text: `Cliente salvo com sucesso!`,
      duration: 'long',
    });
  }
}
