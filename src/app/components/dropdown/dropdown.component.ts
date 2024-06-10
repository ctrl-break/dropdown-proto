import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownDirective } from 'src/app/directives/dropdown.directive';
import { PortalBridgeService } from 'src/app/services/portal-bridge.service';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule, DropdownDirective],
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent {
  portals = inject(PortalBridgeService);
}
