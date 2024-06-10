import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PortalsComponent } from './portals/portals/portals.component';
import { MockComponent } from './components/mock/mock.component';
import { PortalService } from './services/portal.service';
import { PortalsHostComponent } from './portals/portals-host/portals-host.component';
import { PortalsTestComponent } from './components/portals-test/portals-test.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PortalsComponent,
    MockComponent,
    PortalsHostComponent,
    PortalsTestComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {}
