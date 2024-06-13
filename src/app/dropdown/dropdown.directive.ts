import {
  ComponentRef,
  Directive,
  ElementRef,
  Injector,
  Input,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { GlobalEventsService } from './global-events.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { DropdownWrapperComponent } from './dropdown-wrapper/dropdown-wrapper.component';
import { PortalsService } from './portals.service';
import { DropdownService } from './dropdown.service';
import { DropdownTriggerDirective } from './dropdown-trigger.directive';

const DEFAULT_TARGET_DATA: DropdownTarget = {
  targetTemplate: null,
  targetContext: null,
  targetElement: null,
  position: null,
};

export interface DropdownTarget {
  targetTemplate: TemplateRef<unknown> | null;
  targetContext: any;
  targetElement: ElementRef | null;
  position: any;
}

@Directive({
  selector: '[appDropdown]',
  standalone: true,
  hostDirectives: [
    {
      directive: DropdownTriggerDirective,
      inputs: ['appDropdownTrigger'],
    },
  ],
})
export class DropdownDirective implements OnDestroy {
  @Input('appDropdown') targetTemplateRef: TemplateRef<any> | null = null;
  @Input('appDropdownTrigger') appDropdownTrigger: 'click' | 'hover' = 'click';

  hostElement: ElementRef = inject(ElementRef);
  globalEvents = inject(GlobalEventsService);
  portals = inject(PortalsService);
  vcr = inject(ViewContainerRef);

  targetSubject: BehaviorSubject<DropdownTarget> =
    new BehaviorSubject<DropdownTarget>({ ...DEFAULT_TARGET_DATA });
  target$: Observable<DropdownTarget> = this.targetSubject.asObservable();
  component: ComponentRef<DropdownWrapperComponent> | null = null;

  visibilityHandler: Observable<boolean> | null = null;
  visibilityHandler$: Subscription | null = null;

  ngOnDestroy(): void {
    this.targetSubject.complete();
    this.visibilityHandler$?.unsubscribe();
    this.component?.destroy();
  }

  openDropdown() {
    this.createComponent();
    this.sendTargetToWrapper();
  }

  closeDropdown() {
    this.portals.remove(this.component);
    this.targetSubject.next({ ...DEFAULT_TARGET_DATA });
    if (this.appDropdownTrigger === 'hover') {
      this.subscribeToVisibilityHandler();
    }
  }

  createComponent() {
    const injector = Injector.create({
      providers: [{ provide: 'targetData', useValue: this.targetSubject }],
    });
    this.component = this.portals.add(DropdownWrapperComponent, injector);
  }

  sendTargetToWrapper() {
    const context = {
      $implicit: () => this.closeDropdown(),
    };
    this.targetSubject.next({
      targetTemplate: this.targetTemplateRef,
      targetContext: context,
      targetElement: null,
      position: DropdownService.getPosition(
        this.hostElement.nativeElement.getBoundingClientRect()
      ),
    });
  }

  setVisibilityHandler(visibilityHandler: Observable<boolean>) {
    this.visibilityHandler = visibilityHandler;
    this.subscribeToVisibilityHandler();
  }

  subscribeToVisibilityHandler() {
    if (!this.visibilityHandler) {
      return;
    }
    this.visibilityHandler$?.unsubscribe();
    this.visibilityHandler$ = this.visibilityHandler.subscribe((isOpen) => {
      isOpen ? this.openDropdown() : this.closeDropdown();
    });
  }

  setTargetPosition(pos: any) {
    this.targetSubject.next({ ...this.targetSubject.value, position: pos });
  }
}
