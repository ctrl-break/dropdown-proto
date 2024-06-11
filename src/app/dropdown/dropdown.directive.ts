import {
  AfterViewInit,
  Component,
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
import { GlobalEventsService } from '../services/global-events.service';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  skip,
  startWith,
  tap,
} from 'rxjs';
import { DropdownWrapperComponent } from './dropdown-wrapper/dropdown-wrapper.component';

const DEFAULT_TARGET_DATA: DropdownData = {
  targetTemplate: null,
  targetContext: null,
  targetElement: null,
  position: null,
  isOpen: false,
};

export interface DropdownData {
  targetTemplate: TemplateRef<unknown> | null;
  targetContext: any;
  targetElement: ElementRef | null;
  position: DOMRect | null;
  isOpen: boolean;
}

@Directive({
  selector: '[appDropdown]',
  standalone: true,
})
export class DropdownDirective implements AfterViewInit, OnDestroy {
  @Input('appDropdown') targetTemplateRef: TemplateRef<any> | null = null;

  hostElement: ElementRef = inject(ElementRef);
  vcr = inject(ViewContainerRef);
  globalEvents = inject(GlobalEventsService);

  targetSubject: BehaviorSubject<DropdownData> =
    new BehaviorSubject<DropdownData>({ ...DEFAULT_TARGET_DATA });

  target$: Observable<DropdownData> = this.targetSubject.asObservable();
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

  ngAfterViewInit(): void {
    console.log(this.hostElement);
  }

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
    this.component?.destroy();
    this.targetSubject.next({ ...DEFAULT_TARGET_DATA });
  }

  createComponent() {
    const injector = Injector.create({
      providers: [{ provide: 'targetData', useValue: this.targetSubject }],
    });
    this.component = this.vcr.createComponent(DropdownWrapperComponent, {
      injector,
    });
  }

  sendTargetToWrapper() {
    const ctx = {
      $implicit: () => this.closeDropdown(),
    };
    this.targetSubject.next({
      targetTemplate: this.targetTemplateRef,
      targetContext: ctx,
      targetElement: null,
      position: this.hostElement.nativeElement.getBoundingClientRect(),
      isOpen: true,
    });
  }
}
