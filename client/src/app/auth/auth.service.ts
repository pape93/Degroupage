import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  public isLoggedIn = this.loggedIn.asObservable();

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Promise<boolean> {
    console.log('I am in src/app/auth/auth.service.ts file');
    return this.http.post<any>('https://degroup.herokuapp.com/api/login', { username, password })
      .pipe(
        tap(() => this.loggedIn.next(true))
      )
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  logout(): void {
    this.loggedIn.next(false);
  }
}
