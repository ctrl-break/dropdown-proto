import {
  ComponentRef,
  Directive,
  ElementRef,
  HostListener,
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
import { DropdownTriggerDirective } from './dropdown-trigger.directive';
import { DropdownPositionDirective } from './dropdown-position.directive';
import { DropdownAbsolutePosition, DropdownTarget } from './dropdown.models';
import { DEFAULT_TARGET_DATA } from './constants';

@Directive({
  selector: '[appDropdown]',
  standalone: true,
  hostDirectives: [
    DropdownPositionDirective,
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

  position: DropdownAbsolutePosition | null = null;

  @HostListener('document:keydown.escape')
  onEscape() {
    this.component && this.closeDropdown();
  }

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
    this.subscribeToVisibilityHandler();
  }

  createComponent() {
    const injector = Injector.create({
      providers: [{ provide: 'targetData', useValue: this.targetSubject }],
    });
    this.component = this.portals.add(DropdownWrapperComponent, injector);
  }

  sendTargetToWrapper() {
    this.targetSubject.next({
      targetTemplate: this.targetTemplateRef,
      targetContext: { $implicit: () => this.closeDropdown() },
      targetElement: null,
      position: this.position,
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

  setTargetPosition(pos: DropdownAbsolutePosition) {
    this.position = pos;
    this.targetSubject.next({ ...this.targetSubject.value, position: pos });
  }
}
