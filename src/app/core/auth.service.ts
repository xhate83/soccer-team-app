import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, of } from 'rxjs';
import { config } from './config';
import { IUser} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _httpClient = inject(HttpClient);
  private _isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public isLoggedIn$: Observable<boolean> = this._isLoggedInSubject.asObservable();

  constructor() { 
    if(localStorage.getItem('token') && localStorage.getItem('user')){
      this._isLoggedInSubject.next(true)
    }
  }
  
  
  public login(user: IUser): Observable<any> {

    this._setSession({token: 'tokenquemado'}, user)
    return of(true)

    // El endpoint tiene fallas en CORS
    // return this._httpClient.post(`${config.apiUrl}login`, user).pipe(
    //   tap(response =>  {
    //     this._setSession(response, user)})
    // );
  }

  public logout(): Observable<any> {

    this._deleteSession()
    return of(true);

    // El endpoint tiene fallas en CORS
    // return this._httpClient.post(`${config.apiUrl}logout`, "").pipe(
    //   tap(() => this._deleteSession())
    // );;
  }

  public isLoggedIn(): Observable<boolean> {
    return this.isLoggedIn$;
  }

  public getUser(): IUser | null {

    const userString = localStorage.getItem('user');
    if(userString) {
      return JSON.parse(atob(userString)) as IUser;
    }
    return null
  }

  private _setSession(authResult: any, user: any) {
    localStorage.setItem('token', btoa(authResult.token));
    localStorage.setItem('user', btoa(JSON.stringify(user)));
    this._isLoggedInSubject.next(true);
  }

  private _deleteSession(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this._isLoggedInSubject.next(false);
  }
  
}
