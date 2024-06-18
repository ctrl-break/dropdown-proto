import { ElementRef, TemplateRef } from '@angular/core';

export interface DropdownAbsolutePosition {
  position: 'absolute';
  top: number;
  left: number;
  right?: number;
  bottom?: number;
  width?: number;
  height?: number;
}

export interface DropdownAbsolutePositionPx {
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
  position: DropdownAbsolutePositionPx | null;
}
