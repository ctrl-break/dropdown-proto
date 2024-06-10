import { TemplatePortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  Input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { PortalService } from '../services/portal.service';

@Directive({
  selector: '[appDropdownByClick]',
  standalone: true,
})
export class DropdownByClickDirective {
  @Input('appDropdownByClick') templateRef!: TemplateRef<any>;

  private portal!: TemplatePortal<any> | null;

  constructor(
    private elementRef: ElementRef,
    private viewContainerRef: ViewContainerRef,
    private appPortalService: PortalService
  ) {}

  @HostListener('click', ['$event'])
  toggleDropdown(event: MouseEvent) {
    event.stopPropagation();
    if (this.portal) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (
      this.portal &&
      !this.elementRef.nativeElement.contains(event.target) &&
      !document.querySelector('.portals-host')?.contains(event.target as Node)
    ) {
      this.closeDropdown();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.portal) {
      this.closeDropdown();
    }
  }

  private openDropdown() {
    this.portal = new TemplatePortal(this.templateRef, this.viewContainerRef);
    this.appPortalService.attachTemplatePortal(this.portal);
  }

  private closeDropdown() {
    this.appPortalService.detach();
    this.portal = null;
  }

  ngOnDestroy() {
    this.closeDropdown();
  }
}
