import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';

export interface DropdownCoords {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

@Directive({
  selector: '[appDropdownPosition]',
  standalone: true,
})
export class DropdownPositionDirective implements OnInit, OnChanges {
  @Input('hostPosition') hostPosition: DOMRect | null = null;

  @Output('setTargetPosition') setTargetPosition = new EventEmitter();

  ngOnInit(): void {
    console.log(this.hostPosition);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (changes['hostPosition']) {
      this.getPosition(changes['hostPosition'].currentValue);
    }
  }

  getPosition(domRect: DOMRect) {
    console.log(domRect);
    this.setTargetPosition.emit(domRect);
  }
}
