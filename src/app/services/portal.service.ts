import {
  DomPortal,
  DomPortalOutlet,
  Portal,
  TemplatePortal,
} from '@angular/cdk/portal';
import {
  ElementRef,
  Injectable,
  Injector,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PortalService {
  private portalHost: DomPortalOutlet | null = null;
  private portals: Portal<unknown>[] = [];
  private portalsSubject: BehaviorSubject<Portal<unknown>[]> =
    new BehaviorSubject<Portal<unknown>[]>([]);

  constructor() {}

  get portals$(): Observable<Portal<unknown>[]> {
    return this.portalsSubject.asObservable();
  }

  setHost(host: Element): void {
    this.portalHost = new DomPortalOutlet(host);
  }

  addPortal(
    template: TemplateRef<unknown>,
    viewContainerRef: ViewContainerRef,
    injector?: Injector
  ): void {
    // if (portal instanceof DomPortal) {
    //   this.addDomPortal(portal);
    // }
    console.log(template, viewContainerRef);
    // const portal = new DomPortal(element);
    // this.portalHost.attachTemplatePortal(this.portal);
    const portal = new TemplatePortal(
      template,
      viewContainerRef,
      null,
      injector
    );
    this.portalHost?.attachTemplatePortal(portal);
  }

  removePortal(portal: Portal<unknown>): void {
    console.log(this.portals);

    if (portal instanceof DomPortal) {
      this.removeDomPortal(portal);
    }
    console.log(this.portals);
  }

  private addDomPortal(portal: DomPortal, injector: Injector): void {
    // if (
    //   !!this.portals.find(
    //     (item) => (item as DomPortal).element === portal.element
    //   )
    // ) {
    //   return;
    // }
    // this.portals.push(portal);
    // this.emitMapAsArray();
  }

  private removeDomPortal(portal: DomPortal): void {
    this.portals = this.portals.filter(
      (item) => (item as DomPortal).element !== portal.element
    );
    this.emitMapAsArray();
  }

  private emitMapAsArray(): void {
    this.portalsSubject.next(this.portals);
  }
}
