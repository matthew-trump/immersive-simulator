import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, tap, takeUntil } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { AuthService } from '../auth.service';
import { BackendApiService } from '../backend-api.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ConfigService } from '../config.service';
const BACKEND_URL: string = environment.server.url;
const CONFIG_PATH: string = environment.server.configPath;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginform: FormGroup;

  loginError: boolean = false;
  inProgress: boolean = false;

  unsubscribe$: Subject<null> = new Subject();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public http: HttpClient,
    private backendApiService: BackendApiService,
    private configService: ConfigService,
    private router: Router) {
    this.loginform = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  ngOnInit() { }

  login() {
    const val = this.loginform.value;
    this.inProgress = true;
    this.loginError = false;
    if (val.username && val.password) {
      /**
     console.log(val.username, val.password);
     this.configService.loadConfig();
     const url: string = BACKEND_URL;
     console.log(url);


     this.http.get<any>(url + '/api/config').toPromise().then(_ => {
       console.log("DONE-/api/config");
     })

     this.http.get<any>(url + '/api/doget').toPromise().then(_ => {
       console.log("DONE-/api/doget");
     })

     this.http.get<any>(url + '/api2/doget').toPromise().then(_ => {
       console.log("DONE-/api2/config");
     })
     */
      /** 
      this.http.get(url).subscribe(_ => {
        console.log("DONE");
      });
      */
      //console.log("TEST", this.authService.login(val.username, val.password));
      //this.configService.loadConfig();
      /** 
      const url: string = BACKEND_URL + "/login";
      console.log(url);
      this.http.get(url).subscribe(_ => {
        console.log("DONE");
      });
      */
      /** 
      this.backendApiService.login(val.username, val.password).subscribe(_ => {
        console.log("DONE");
      });
      **/
      this.authService.login(val.username, val.password)
        .pipe(
          tap((result) => {
            this.inProgress = false;
            if (result) {
              this.router.navigateByUrl('/');
            }
          }),
          catchError(err => {
            this.inProgress = false;
            this.loginError = true;
            console.log(err);
            return of(null);
          }),
          takeUntil(this.unsubscribe$)
        ).subscribe(_ => { })
    }

  }


  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
