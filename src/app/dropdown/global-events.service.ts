import { Injectable } from '@angular/core';
import { fromEvent, share, throttleTime } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalEventsService {
  delayTime = 300;

  public documentClick$ = fromEvent(document, 'click').pipe(share());
  public windowResize$ = fromEvent(window, 'resize').pipe(
    throttleTime(this.delayTime),
    share()
  );
  public documentScroll$ = fromEvent(document, 'scroll').pipe(
    throttleTime(this.delayTime),
    share()
  );
}
