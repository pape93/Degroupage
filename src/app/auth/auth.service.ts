import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5000'; // Replace with your backend API URL
  private _isLoggedIn = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Promise<boolean> {
    const loginData = { username, password };

    return new Promise((resolve, reject) => {
      this.http.post(`${this.apiUrl}/login`, loginData).subscribe(
        (response: any) => {
          if (response.message === 'Logged in successfully') {
            this._isLoggedIn.next(true);
            resolve(true);
          } else {
            resolve(false);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  logout(): void {
    this._isLoggedIn.next(false);
  }

  get isLoggedIn(): BehaviorSubject<boolean> {
    return this._isLoggedIn;
  }
}
