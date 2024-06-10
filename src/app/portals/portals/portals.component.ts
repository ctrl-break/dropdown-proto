import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PortalBridgeService,
  Portals,
} from '../../services/portal-bridge.service';
import { PortalService } from 'src/app/services/portal.service';

@Component({
  selector: 'app-portals',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portals.component.html',
  styleUrls: ['./portals.component.scss'],
})
export class PortalsComponent implements AfterViewInit {
  @ViewChild('portalsHost') el!: ElementRef<HTMLElement>;

  portals = inject(PortalService);

  ngAfterViewInit(): void {
    this.portals.setPortalHost(this.el.nativeElement);
  }
}
