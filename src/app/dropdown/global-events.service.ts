import { Injectable } from '@angular/core';
import { debounceTime, fromEvent, share, tap, throttleTime } from 'rxjs';
import { DROPDOWN_DEBOUNCE_TIME } from './dropdown.constants';

@Injectable({
  providedIn: 'root',
})
export class GlobalEventsService {
  public documentClick$ = fromEvent(document, 'click').pipe(share());
  public windowResize$ = fromEvent(window, 'resize').pipe(
    debounceTime(DROPDOWN_DEBOUNCE_TIME),
    share()
  );
  public documentScroll$ = fromEvent(document, 'scroll').pipe(
    throttleTime(DROPDOWN_DEBOUNCE_TIME),
    share()
  );
}
