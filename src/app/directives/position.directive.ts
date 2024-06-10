import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  TemplateRef,
  inject,
} from '@angular/core';

@Directive({
  selector: '[mPosition]',
  standalone: true,
})
export class PositionDirective implements AfterViewInit {
  el: HTMLElement = inject(ElementRef).nativeElement;

  @Input('template') template!: TemplateRef<unknown>;

  constructor() {}

  ngAfterViewInit(): void {
    this.getPosition();
  }

  getPosition() {
    if (!this.template) {
      return;
    }
    // console.log(this.template.elementRef.nativeElement);

    // this.template.elementRef.nativeElement.style.position = 'absolute';
    // this.template.elementRef.nativeElement.style.top = '32px';
    console.log(this.el.getBoundingClientRect());
  }
}
