import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownWrapperComponent } from '../dropdown-wrapper/dropdown-wrapper.component';
import { DropdownDirective } from '../dropdown.directive';

@Component({
  selector: 'app-dropdown-test',
  standalone: true,
  imports: [CommonModule, DropdownWrapperComponent, DropdownDirective],
  templateUrl: './dropdown-test.component.html',
  styleUrls: ['./dropdown-test.component.scss'],
})
export class DropdownTestComponent {}
