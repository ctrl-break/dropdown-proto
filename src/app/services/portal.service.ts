import { DomPortalOutlet, TemplatePortal } from '@angular/cdk/portal';
import {
  ApplicationRef,
  ComponentFactoryResolver,
  Injectable,
  Injector,
} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PortalService {
  portalHost: DomPortalOutlet | undefined;
  portals: Map<number, HTMLElement> = new Map();
  counter = 1;

  constructor() {}

  setPortalHost(element: HTMLElement) {
    this.portalHost = new DomPortalOutlet(element);
  }

  attachTemplatePortal(templatePortal: TemplatePortal<unknown>) {
    if (this.portalHost) {
      const view = this.portalHost.attachTemplatePortal(templatePortal);
      this.portals.set(this.counter, view.rootNodes[0] as HTMLElement);
      this.counter++;
    }
  }

  detach() {
    if (this.portalHost) {
      this.portalHost.detach();
    }
  }
}
