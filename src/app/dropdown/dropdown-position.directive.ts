import {
  AfterViewInit,
  Directive,
  ElementRef,
  OnDestroy,
  inject,
} from '@angular/core';
import { DropdownDirective } from './dropdown.directive';
import { DROPDOWN_MARGIN_PX } from './dropdown.constants';
import { DropdownAbsolutePosition } from './dropdown.models';
import { GlobalEventsService } from './global-events.service';

@Directive({
  selector: '[appDropdownPosition]',
  standalone: true,
})
export class DropdownPositionDirective implements AfterViewInit, OnDestroy {
  dropdown = inject(DropdownDirective);
  hostElement: ElementRef = inject(ElementRef);

  windowResize$ = inject(GlobalEventsService).windowResize$.subscribe(() =>
    this.setTargetPosition()
  );

  ngAfterViewInit(): void {
    this.setTargetPosition();
  }

  ngOnDestroy(): void {
    this.windowResize$?.unsubscribe();
  }

  getCoords(hostRect: DOMRect) {
    return {
      top: hostRect.top + window.scrollY,
      right: hostRect.right + window.scrollX,
      bottom: hostRect.bottom + window.scrollY,
      left: hostRect.left + window.scrollX,
    };
  }

  getPosition(hostRect: DOMRect): DropdownAbsolutePosition {
    const pos = this.getCoords(hostRect);
    return {
      position: 'absolute',
      top: pos.top + DROPDOWN_MARGIN_PX + 'px',
      left: pos.left + 'px',
    };
  }

  setTargetPosition() {
    const pos = this.getPosition(
      this.hostElement.nativeElement.getBoundingClientRect()
    );
    this.dropdown.setTargetPosition(pos);
  }
}
