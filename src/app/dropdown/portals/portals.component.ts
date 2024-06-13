import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalsService } from '../portals.service';

@Component({
  selector: 'app-portals',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portals.component.html',
  styleUrls: ['./portals.component.scss'],
})
export class PortalsComponent implements AfterViewInit {
  @ViewChild('portals', { read: ViewContainerRef, static: true })
  portals!: ViewContainerRef;

  portalService = inject(PortalsService);

  ngAfterViewInit(): void {
    this.portalService.setHost(this.portals);
  }
}
