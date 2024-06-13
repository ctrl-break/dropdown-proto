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
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  distinctUntilChanged,
  map,
  skip,
  startWith,
} from 'rxjs';
import { DropdownWrapperComponent } from './dropdown-wrapper/dropdown-wrapper.component';
import { PortalsService } from './portals.service';
import { DropdownService } from './dropdown.service';

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
})
export class DropdownDirective implements OnDestroy {
  @Input('appDropdown') targetTemplateRef: TemplateRef<any> | null = null;

  hostElement: ElementRef = inject(ElementRef);
  globalEvents = inject(GlobalEventsService);
  portals = inject(PortalsService);
  vcr = inject(ViewContainerRef);

  targetSubject: BehaviorSubject<DropdownTarget> =
    new BehaviorSubject<DropdownTarget>({ ...DEFAULT_TARGET_DATA });
  target$: Observable<DropdownTarget> = this.targetSubject.asObservable();
  component: ComponentRef<DropdownWrapperComponent> | null = null;

  handleClicks$ = combineLatest([
    this.globalEvents.documentClick$,
    this.target$,
  ])
    .pipe(
      map(([event, target]) => {
        return (
          this.hostElement.nativeElement.contains(event.target) ||
          target?.targetElement?.nativeElement.contains(event.target)
        );
      }),
      startWith(false),
      skip(1),
      distinctUntilChanged()
    )
    .subscribe((isOpen) => {
      isOpen ? this.openDropdown() : this.closeDropdown();
    });

  ngOnDestroy(): void {
    this.targetSubject.complete();
    this.handleClicks$.unsubscribe();
    this.component?.destroy();
  }

  openDropdown() {
    this.createComponent();
    this.sendTargetToWrapper();
  }

  closeDropdown() {
    this.portals.remove(this.component);
    this.targetSubject.next({ ...DEFAULT_TARGET_DATA });
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

  setTargetPosition(pos: any) {
    this.targetSubject.next({ ...this.targetSubject.value, position: pos });
  }
}
