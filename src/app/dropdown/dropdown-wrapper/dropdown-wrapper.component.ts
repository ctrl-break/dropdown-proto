import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { DropdownTarget } from '../dropdown.directive';

@Component({
  selector: 'app-dropdown-wrapper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown-wrapper.component.html',
  styleUrls: ['./dropdown-wrapper.component.scss'],
  providers: [],
})
export class DropdownWrapperComponent implements AfterViewInit {
  @ViewChild('wrapper', { static: true }) targetWrapper!: ElementRef;

  dropdownTarget$: BehaviorSubject<DropdownTarget>;

  constructor(
    @Inject('targetData') targetData: BehaviorSubject<DropdownTarget>
  ) {
    this.dropdownTarget$ = targetData;
  }

  ngAfterViewInit(): void {
    const current = this.dropdownTarget$.value;
    this.dropdownTarget$.next({
      ...current,
      targetElement: this.targetWrapper,
    });
  }
}
