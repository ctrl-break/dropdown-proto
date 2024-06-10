import {
  AfterViewInit,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownDirective } from 'src/app/directives/dropdown.directive';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { DropdownTriggerDirective } from 'src/app/directives/dropdown-trigger.directive';
import { DropdownByClickDirective } from 'src/app/directives/dropdown-by-click.directive';
import { PortalService } from 'src/app/services/portal.service';

@Component({
  selector: 'app-mock',
  standalone: true,
  imports: [
    CommonModule,
    DropdownDirective,
    DropdownComponent,
    DropdownTriggerDirective,
    DropdownByClickDirective,
  ],
  templateUrl: './mock.component.html',
  styleUrls: ['./mock.component.scss'],
})
export class MockComponent {
  portalService = inject(PortalService);
  // viewContainerRef = inject(ViewContainerRef);
  // @ViewChild('content', { static: true }) content!: TemplateRef<unknown>;
  // ngAfterViewInit(): void {
  //   setTimeout(() => this.setPortal(), 1000);
  // }
  // setPortal() {
  //   const templatePortal = new TemplatePortal(
  //     this.content,
  //     this.viewContainerRef
  //   );
  //   this.portalService.setPortal(templatePortal);
  // }

  chooseMenu(e: Event) {
    console.log(e);
    this.portalService.detach();
  }
}
