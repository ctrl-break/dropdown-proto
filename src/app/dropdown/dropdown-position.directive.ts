import {
  AfterViewInit,
  Directive,
  ElementRef,
  OnDestroy,
  inject,
} from '@angular/core';
import { DropdownDirective } from './dropdown.directive';
import { DROPDOWN_MARGIN_PX } from './constants';
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
    this.setTargetInitialPosition()
  );

  ngAfterViewInit(): void {
    this.setTargetInitialPosition();
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
      top: pos.top + DROPDOWN_MARGIN_PX,
      left: pos.left,
    };
  }

  setTargetInitialPosition() {
    const pos = this.getPosition(
      this.hostElement.nativeElement.getBoundingClientRect()
    );
    this.dropdown.setTargetPosition(pos);
  }

  repositionDropdownToTop() {
    const prevPosition = this.dropdown.position;
    const hostRect =
      this.dropdown.hostElement.nativeElement.getBoundingClientRect();
    const dropdownRect =
      this.dropdown.targetSubject.value.targetElement?.nativeElement.getBoundingClientRect();
    const top =
      prevPosition!.top -
      dropdownRect.height -
      hostRect.height -
      DROPDOWN_MARGIN_PX;

    const position: DropdownAbsolutePosition = {
      position: 'absolute',
      top: top,
      left: dropdownRect.left,
    };
    this.dropdown.setTargetPosition(position);
  }

  repositionDropdownToBottom() {
    this.setTargetInitialPosition();
  }

  canRepositionToTop(): boolean {
    const hostRect =
      this.dropdown.hostElement.nativeElement.getBoundingClientRect();
    const dropdownRect =
      this.dropdown.targetSubject.value.targetElement?.nativeElement.getBoundingClientRect();
    if (!dropdownRect || !hostRect) {
      return false;
    }
    const topPosition = hostRect.top - dropdownRect.height - DROPDOWN_MARGIN_PX;
    const fitsTop =
      topPosition > 0 && topPosition + dropdownRect.height < window.innerHeight;
    return fitsTop;
  }

  canRepositionToBottom(): boolean {
    const hostRect =
      this.dropdown.hostElement.nativeElement.getBoundingClientRect();
    const dropdownRect =
      this.dropdown.targetSubject.value.targetElement?.nativeElement.getBoundingClientRect();
    if (!dropdownRect || !hostRect) {
      return false;
    }
    const bottomPosition =
      hostRect.bottom + dropdownRect.height + DROPDOWN_MARGIN_PX;
    const fitsBottom =
      bottomPosition < window.innerHeight &&
      bottomPosition > dropdownRect.height;
    return fitsBottom;
  }
}
