import {
  Directive,
  ElementRef,
  HostListener,
  Injector,
  ApplicationRef,
  ComponentFactoryResolver,
  Input,
  TemplateRef,
  ViewContainerRef,
  OnDestroy,
} from '@angular/core';
import { DomPortalOutlet, TemplatePortal } from '@angular/cdk/portal';
import { PortalService } from '../services/portal.service';

@Directive({
  selector: '[appDropdownTrigger]',
  standalone: true,
})
export class DropdownTriggerDirective implements OnDestroy {
  @Input('appDropdownTrigger') templateRef: TemplateRef<any> | null = null;

  private portalHost: DomPortalOutlet | null = null;
  private dropdownHostElement: HTMLElement | null = null;
  private portal: TemplatePortal<any> | null = null;

  constructor(
    private elementRef: ElementRef,
    private injector: Injector,
    private appRef: ApplicationRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef,
    private portals: PortalService
  ) {}

  @HostListener('click', ['$event'])
  toggleDropdown(event: MouseEvent) {
    event.stopPropagation();
    if (this.portalHost) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (
      this.portalHost &&
      !this.elementRef.nativeElement.contains(event.target) &&
      !this.dropdownHostElement?.contains(event.target as Node)
    ) {
      this.closeDropdown();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.portalHost) {
      this.closeDropdown();
    }
  }

  private openDropdown() {
    this.dropdownHostElement = document.createElement('div');
    document.body.appendChild(this.dropdownHostElement);

    this.portalHost = new DomPortalOutlet(
      this.dropdownHostElement,
      this.componentFactoryResolver,
      this.appRef,
      this.injector
    );

    this.portal = new TemplatePortal(this.templateRef!, this.viewContainerRef);
    this.portalHost.attachTemplatePortal(this.portal);

    const rect = this.elementRef.nativeElement.getBoundingClientRect();
    this.dropdownHostElement.style.position = 'absolute';
    this.dropdownHostElement.style.top = `${rect.bottom}px`;
    this.dropdownHostElement.style.left = `${rect.left}px`;
  }

  private closeDropdown() {
    this.portalHost?.detach();
    this.portalHost = null;
    if (this.dropdownHostElement) {
      document.body.removeChild(this.dropdownHostElement);
      this.dropdownHostElement = null;
    }
  }

  ngOnDestroy() {
    this.closeDropdown();
  }
}
