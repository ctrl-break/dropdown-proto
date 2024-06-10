import {
  Component,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalsManagerService } from 'src/app/services/portals-manager.service';

@Component({
  selector: 'app-portals-host',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portals-host.component.html',
  styleUrls: ['./portals-host.component.scss'],
})
export class PortalsHostComponent {
  portals$ = inject(PortalsManagerService).portals$;
  pm = inject(PortalsManagerService);

  closePortal(template: TemplateRef<unknown>) {
    this.pm.removeTemplate(template);
  }
}
