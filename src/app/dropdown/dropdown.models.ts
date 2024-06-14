import { ElementRef, TemplateRef } from '@angular/core';

export interface DropdownAbsolutePosition {
  position: 'absolute';
  top: string;
  left: string;
  right?: string;
  bottom?: string;
  width?: string;
  height?: string;
}

export interface DropdownTarget {
  targetTemplate: TemplateRef<unknown> | null;
  targetContext: any;
  targetElement: ElementRef | null;
  position: any;
}
