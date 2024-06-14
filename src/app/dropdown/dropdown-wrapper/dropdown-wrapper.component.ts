import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  Inject,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { DropdownTarget } from '../dropdown.directive';
import { fadeInOut } from '../animation';

@Component({
  selector: 'app-dropdown-wrapper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown-wrapper.component.html',
  styleUrls: ['./dropdown-wrapper.component.scss'],
  animations: [fadeInOut],
})
export class DropdownWrapperComponent implements AfterViewInit {
  @ViewChild('wrapper') targetWrapper!: ElementRef;
  @HostBinding('@fadeInOut') fadeInOut = true;

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
