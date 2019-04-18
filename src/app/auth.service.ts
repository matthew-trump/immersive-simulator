import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { shareReplay, tap, catchError } from 'rxjs/operators';
import { ConfigService } from './config.service';

import * as moment from "moment";

import { BackendApiService } from './backend-api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private backendApiService: BackendApiService,
    private configService: ConfigService) {
  }
  login(username: string, password: string) {
    return this.backendApiService.login(username, password)
      .pipe(
        tap(res => this.setSession(res)),
        tap(_ => {
          this.configService.loadConfig();
        }),
        shareReplay(1),
      );
  }
  private setSession(authResult) {
    const expiresAt = moment().add(authResult.expiresIn, 'second');
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
    localStorage.setItem("username", authResult.username);
  }
  logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    localStorage.removeItem("username");
  }

  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }
  public getLoggedInUser() {
    if (this.isLoggedIn()) {
      return localStorage.getItem("username");
    }
    return null;
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration() {
    const expiration = localStorage.getItem("expires_at");
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

}
