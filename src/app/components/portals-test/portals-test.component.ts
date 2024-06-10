import { Component, TemplateRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalsManagerService } from 'src/app/services/portals-manager.service';

@Component({
  selector: 'app-portals-test',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portals-test.component.html',
  styleUrls: ['./portals-test.component.scss'],
})
export class PortalsTestComponent {
  portals = inject(PortalsManagerService);

  addPortal(template: TemplateRef<unknown>) {
    this.portals.addTemplate(template);
  }

  removePortal(template: TemplateRef<unknown>) {
    this.portals.removeTemplate(template);
  }
}
