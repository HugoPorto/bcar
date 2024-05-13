import { Injectable, EventEmitter } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage-angular';

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  login = new EventEmitter<boolean>();
  apiSignupUrl = 'https://localhost:7051/members';
  apiToken = 'https://localhost:7051/token';

  private _storage: Storage | null = null;

  constructor(private http: HttpClient, private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiSignupUrl);
  }

  getUsers(): Observable<any> {
    const token = this._storage?.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(this.apiSignupUrl, { headers });
  }

  addUser(user: any): Observable<any> {
    return this.http.post<any>(this.apiSignupUrl, user);
  }

  getToken(user: any): Observable<any> {
    return this.http.post<any>(this.apiToken, user);
  }

  public async set(key: string, value: any, email?: string): Promise<any> {
    try {
      await this._storage?.set(key, value);
      await this._storage?.set('login', true);
      await this._storage?.set('email', email);
      const loginValue = await this._storage?.get('login');
      this.login.emit(loginValue);
    } catch (error) {
      console.error(error);
    }
  }

  public async get(key: string) {
    return await this._storage?.get(key);
  }

  public async keys() {
    return await this._storage?.keys();
  }

  public async clear() {
    await this._storage?.clear();
    this.login.emit(false);
  }

  public async remove(key: string) {
    await this._storage?.remove(key);
  }

  public async removeUser(email: string, login: string, token: string) {
    await this._storage?.remove(email);
    await this._storage?.remove(login);
    await this._storage?.remove(token);
    this.login.emit(false);
  }

  public async setClient(cleintUse?: boolean): Promise<any> {
    this._storage?.set('clientUse', cleintUse);
  }
}
