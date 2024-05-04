import { Injectable } from '@angular/core';

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
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZpY3Rvci5wb3J0bzczMzg5QGdtYWlsLmNvbSIsIm5hbWVpZCI6IjM3NTEwNzQ5LWY2ZWMtNDM4ZS05Yjk1LWY0MjZkMjk1YTI2ZSIsIkVtcGxveWVlQ29kZSI6IjA1IiwiTmFtZSI6InZpY3RvciBodWdvIiwiQ3JlYXRlZEJ5IjoiMTllYThmNTYtZGQwOS00NWRiLWFhYTQtNTJjZWJiZWRkOWM0IiwibmJmIjoxNzE0NzgwMjAyLCJleHAiOjE3NDYzMTYyMDIsImlhdCI6MTcxNDc4MDIwMiwiaXNzIjoiSVdhbnRBcHBJc3N1ZXIiLCJhdWQiOiJBdWRpZW5jZSJ9.5MlyUORHyN8O-FY6SBiSqdPFd06DWsKYnzLfcjNgk3I';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(this.apiSignupUrl, { headers });
  }

  addUser(user: any): Observable<any> {
    return this.http.post<any>(this.apiSignupUrl, user);
  }

  getToken(user: any): Observable<any> {
    return this.http.post<any>(this.apiToken, user);
  }

  public async set(key: string, value: any): Promise<any> {
    this._storage?.set(key, value).then(() => {
      console.log('Token saved');
    });
  }

  public async get(key: string) {
    return await this._storage?.get(key);
  }

  public async keys() {
    return await this._storage?.keys();
  }

  public async clear() {
    await this._storage?.clear();
  }

  public async remove(key: string) {
    await this._storage?.remove(key);
  }
}
