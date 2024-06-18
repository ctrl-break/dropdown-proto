import { AfterViewInit, Directive, OnDestroy, inject } from '@angular/core';
import { debounceTime, map, distinctUntilChanged, Subscription } from 'rxjs';
import { DropdownPositionDirective } from './dropdown-position.directive';
import { DropdownDirective } from './dropdown.directive';
import { DROPDOWN_INTERSECTION_THRESHOLD } from './constants';

@Directive({
  selector: '[appDropdownIntersection]',
  standalone: true,
})
export class DropdownIntersectionDirective implements AfterViewInit, OnDestroy {
  dropdown = inject(DropdownDirective);
  dropdownPosition = inject(DropdownPositionDirective);

  intersectionObserver: IntersectionObserver | undefined;
  target$: Subscription | undefined;

  ngAfterViewInit(): void {
    this.setIntersectionObserver();
  }

  ngOnDestroy(): void {
    this.target$?.unsubscribe();
    this.intersectionObserver?.disconnect();
  }

  setIntersectionObserver() {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting === true) {
          return;
        }
        if (this.dropdownPosition.canRepositionToTop()) {
          this.dropdownPosition.repositionDropdownToTop();
          return;
        }
        if (this.dropdownPosition.canRepositionToBottom()) {
          this.dropdownPosition.repositionDropdownToBottom();
          return;
        }
        this.dropdown.closeDropdown();
      },
      { threshold: DROPDOWN_INTERSECTION_THRESHOLD }
    );

    this.target$ = this.dropdown.target$
      .pipe(
        debounceTime(50),
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
