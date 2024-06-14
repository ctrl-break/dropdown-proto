import {
  AfterViewInit,
  Directive,
  Input,
  OnDestroy,
  inject,
} from '@angular/core';
import { DropdownDirective } from './dropdown.directive';
import { GlobalEventsService } from './global-events.service';
import {
  Observable,
  Subscription,
  combineLatest,
  debounceTime,
  delay,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  merge,
  skip,
  startWith,
  switchMap,
} from 'rxjs';
import { DropdownTarget } from './dropdown.models';

@Directive({
  selector: '[appDropdownTrigger]',
  standalone: true,
})
export class DropdownTriggerDirective implements AfterViewInit, OnDestroy {
  @Input('appDropdownTrigger') appDropdownTrigger: 'click' | 'hover' = 'click';

  dropdown = inject(DropdownDirective);
  globalEvents = inject(GlobalEventsService);

  visibilityHandler$: Observable<boolean> | undefined;
  intersectionObserver: IntersectionObserver | undefined;
  target$: Subscription | undefined;

  ngAfterViewInit(): void {
    this.setVisibilityHandler();
    this.setIntersectionObserver();
  }

  ngOnDestroy(): void {
    this.target$?.unsubscribe();
    this.intersectionObserver?.disconnect();
  }

  setVisibilityHandler() {
    if (this.dropdown.visibilityHandler$) {
      return;
    }
    if (this.appDropdownTrigger === 'click') {
      this.setClicksHandler();
      return;
    }

    this.setHoverHandler();
  }

  emitHandlerToParent(visibilityHandler: Observable<boolean>) {
    this.dropdown.setVisibilityHandler(visibilityHandler);
  }

  /* CLICK */
  setClicksHandler() {
    this.visibilityHandler$ = combineLatest([
      this.globalEvents.documentClick$,
      this.dropdown.target$,
    ]).pipe(
      map(([event, target]) => {
        return (
          this.dropdown.hostElement.nativeElement.contains(event.target) ||
          target?.targetElement?.nativeElement.contains(event.target)
        );
      }),
      startWith(false),
      skip(1),
      distinctUntilChanged()
    );

    this.emitHandlerToParent(this.visibilityHandler$);
  }

  /* HOVER */
  setHoverHandler() {
    const MOUSE_MOVING_DELAY = 500;

    const hostHover$ = fromEvent(
      this.dropdown.hostElement.nativeElement,
      'mouseenter'
    ).pipe(map(() => true));

    const targetVisible$ = this.dropdown.target$.pipe(
      filter((target) => !!target?.targetElement),
      switchMap((target: DropdownTarget) =>
        merge(
          fromEvent<MouseEvent>(
            this.dropdown.hostElement.nativeElement,
            'mouseleave'
          ).pipe(map((event) => ({ event, target }))),
          fromEvent<MouseEvent>(
            target?.targetElement?.nativeElement,
            'mouseleave'
          ).pipe(map((event) => ({ event, target })))
        )
      ),
      delay(MOUSE_MOVING_DELAY),
      map(({ target }) => {
        const isHovered =
          this.dropdown.hostElement.nativeElement.matches(':hover') ||
          target?.targetElement?.nativeElement.matches(':hover');
        return isHovered;
      }),
      startWith(true)
    );

    this.visibilityHandler$ = hostHover$.pipe(
      switchMap(() => targetVisible$),
      distinctUntilChanged()
    );

    this.emitHandlerToParent(this.visibilityHandler$);
  }

  /* Intersection Observer */
  setIntersectionObserver() {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting === false) {
          this.dropdown.closeDropdown();
        }
      },
      {
        threshold: 0.5,
      }
    );

    this.target$ = this.dropdown.target$
      .pipe(
        debounceTime(300),
        map(({ targetElement }) => targetElement),
        distinctUntilChanged()
      )
      .subscribe((target) => {
        if (!target) {
          this.intersectionObserver!.disconnect();
          return;
        }
        this.intersectionObserver!.observe(target?.nativeElement);
      });
  }
}
