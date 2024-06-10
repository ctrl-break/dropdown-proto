import {
  AfterViewInit,
  Component,
  ComponentRef,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalEventsService } from 'src/app/services/global-events.service';
import { delay, distinctUntilChanged, filter, map, startWith, tap } from 'rxjs';
import { DomPortal } from '@angular/cdk/portal';
import { PortalService } from 'src/app/services/portal.service';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent implements AfterViewInit, OnDestroy {
  @ViewChild('host', { static: true }) host!: ElementRef;
  @ViewChild('targetWrapper', { static: true }) targetWrapper!: ElementRef;
  @ViewChild('dropdown', { static: true }) dropdown!: TemplateRef<unknown>;

  @Input('target') templateRef: TemplateRef<any> | null = null;
  @Input() openAt: 'click' | 'hover' = 'click';

  vcr = inject(ViewContainerRef);
  globalEvents = inject(GlobalEventsService);
  portals = inject(PortalService);
  domPortal: DomPortal | null = null;
  open = false;

  handleClicks$ = this.globalEvents.documentClick$
    .pipe(
      delay(0),
      tap((event) => {
        console.log(event);
        event.stopPropagation();
        event.stopImmediatePropagation();
        event.preventDefault();
      }),
      map((event) => {
        return (
          this.host.nativeElement.contains(event.target) ||
          this.targetWrapper.nativeElement.contains(event.target)
        );
      }),
      startWith(false),
      distinctUntilChanged()
    )
    .subscribe((event) => {
      console.log(event);
      // this.open = event;
      if (event) {
        this.openDropdown();
      } else {
        this.closeDropdown();
      }
    });

  ngAfterViewInit(): void {
    console.log(this.host);
    console.log(this.templateRef);
  }

  ngOnDestroy(): void {
    this.handleClicks$.unsubscribe();
  }

  openDropdown() {
    // this.domPortal = new DomPortal(this.targetWrapper);
    // this.portals.addPortal(this.domPortal);
    // this.open = true;
    this.portals.addPortal(this.dropdown, this.vcr);
  }

  closeDropdown() {
    // if (this.domPortal) {
    //   this.portals.removePortal(this.domPortal);
    //   this.domPortal.detach();
    //   this.domPortal = null;
    // }
    // this.open = false;
  }
}
