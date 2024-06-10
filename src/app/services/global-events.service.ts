import { Injectable } from '@angular/core';
import { fromEvent, share, throttleTime } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalEventsService {
  public documentClick$ = fromEvent(document, 'click').pipe(share());
  public windowResize$ = fromEvent(window, 'resize').pipe(
    throttleTime(500),
    share()
  );
  public documentScroll$ = fromEvent(document, 'scroll').pipe(
    throttleTime(300),
    share()
  );
}
