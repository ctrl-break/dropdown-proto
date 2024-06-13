import {
  Component,
  ComponentRef,
  Injectable,
  Injector,
  Type,
  ViewContainerRef,
} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PortalsService {
  portalHost: ViewContainerRef | null = null;

  setHost(container: ViewContainerRef): void {
    this.portalHost = container;
    console.log(this.portalHost);
  }

  add<T>(comp: Type<T>, injector?: Injector): ComponentRef<T> {
    return this.portalHost!.createComponent(comp, { injector });
  }

  remove(comp: ComponentRef<unknown> | null) {
    if (comp) {
      comp.destroy();
    }
  }
}
