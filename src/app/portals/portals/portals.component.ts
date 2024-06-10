import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PortalBridgeService,
  Portals,
} from '../../services/portal-bridge.service';
import { PortalService } from 'src/app/services/portal.service';
import { PortalModule } from '@angular/cdk/portal';

@Component({
  selector: 'app-portals',
  standalone: true,
  imports: [CommonModule, PortalModule],
  templateUrl: './portals.component.html',
  styleUrls: ['./portals.component.scss'],
})
export class PortalsComponent implements AfterViewInit {
  @ViewChild('host', { static: true }) host!: Element;

  portals = inject(PortalService);
  portals$ = this.portals.portals$;

  ngAfterViewInit(): void {
    this.portals.setHost(this.host);
  }
}
