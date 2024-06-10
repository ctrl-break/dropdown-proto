import {
  ComponentRef,
  Directive,
  EmbeddedViewRef,
  Injectable,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  inject,
} from '@angular/core';

@Directive()
export abstract class Portals {
  @ViewChild('viewContainer', { read: ViewContainerRef })
  private readonly vcr!: ViewContainerRef;

  protected readonly nothing = inject(PortalBridgeService).attach(this);

  public addComponentChild<C>(component: ComponentRef<C>): ComponentRef<C> {
    const ref = this.vcr.createComponent(component.componentType);

    ref.changeDetectorRef.detectChanges();

    return ref;
  }

  public addTemplateChild<C>(
    templateRef: TemplateRef<C>,
    context?: C
  ): EmbeddedViewRef<C> {
    return this.vcr.createEmbeddedView(templateRef, context);
  }
}

@Injectable({
  providedIn: 'root',
})
export class PortalBridgeService {
  protected host?: Portals;

  public attach(host: Portals): void {
    this.host = host;
  }

  public add<C>(component: ComponentRef<C>): ComponentRef<C> {
    return this.host!.addComponentChild(component);
  }

  public remove<C>({ hostView }: ComponentRef<C>): void {
    if (!hostView.destroyed) {
      hostView.destroy();
    }
  }

  public addTemplate<C>(
    templateRef: TemplateRef<C>,
    context?: C
  ): EmbeddedViewRef<C> {
    return this.host!.addTemplateChild(templateRef, context);
  }

  public removeTemplate<C>(viewRef: EmbeddedViewRef<C>): void {
    if (!viewRef.destroyed) {
      viewRef.destroy();
    }
  }
}
