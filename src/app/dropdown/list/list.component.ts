import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownDirective } from '../dropdown.directive';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, DropdownDirective],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent {
  @Output() close = new EventEmitter<void>();
}
