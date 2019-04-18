import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {

  config$: Observable<any>;

  constructor(
    public store: Store<any>
  ) { }
  ngOnInit() {

    this.config$ = this.store.select("config")
      .pipe(
        tap((state: any) => {
          console.log(state.config);
        }),
        switchMap((state: any) => {
          return of(state.config)
        })
      )
  }
  ngOnDestroy() { }
}
