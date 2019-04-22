import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ChildService } from './child.service';

@Injectable({
  providedIn: 'root'
})
export class ImmersiveSimulatorService {

  response$: BehaviorSubject<any> = new BehaviorSubject(null);
  constructor(private childService: ChildService) {

    this.response$
      .pipe(
        tap((response: any) => {
          this.childService.handleImmersiveResponse(response);
        })
      )
      .subscribe();
  }
}
