import { DOCUMENT } from '@angular/common';
import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewContainerRef,
  inject,
} from '@angular/core';
import {
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  merge,
  skip,
  startWith,
  tap,
} from 'rxjs';
import { PortalBridgeService } from '../services/portal-bridge.service';
import { TemplatePortal } from '@angular/cdk/portal';

@Directive({
  selector: '[mClickToggle]',
  standalone: true,
})
export class ClickToggleDirective {
  @Input('template') template!: TemplateRef<unknown>;

  el: HTMLElement = inject(ElementRef).nativeElement;
  document = inject(DOCUMENT);
  viewContainer = inject(ViewContainerRef);
  portals = inject(PortalBridgeService);

  portalElement: TemplatePortal<unknown> | null = null;

  click$ = fromEvent(document, 'click')
    .pipe(
      // tap((event) => {
      //   event.stopImmediatePropagation();
      //   console.log(this.template.elementRef.nativeElement);
      // }),
      filter((e) => {
        console.log(this.portalElement);
        return !this.portalElement?.viewContainerRef.element.nativeElement.contains(
          e.target as HTMLElement
        );
      }),
      map((event) => {
        // console.log(
        //   this.viewContainer.element.nativeElement.contains(event.target)
        // );
        return (
          this.el.contains(event.target as HTMLElement) ||
          this.template.elementRef.nativeElement.contains(
            event.target as HTMLElement
          )
        );
      }),
      startWith(false),
      skip(1),
      distinctUntilChanged()
    )
    .subscribe((isOpened: boolean) => {
      // const component = this.viewContainer.createComponent();

      this.portalElement = isOpened
        ? new TemplatePortal(this.template, this.viewContainer)
        : null;

      console.log(isOpened);

      // this.portals.setPortal(this.portalElement);
    });
}
