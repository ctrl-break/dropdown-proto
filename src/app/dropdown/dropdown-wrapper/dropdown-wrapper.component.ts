import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { DropdownData } from '../dropdown.directive';

@Component({
  selector: 'app-dropdown-wrapper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown-wrapper.component.html',
  styleUrls: ['./dropdown-wrapper.component.scss'],
  providers: [],
})
export class DropdownWrapperComponent implements OnInit, AfterViewInit {
  @ViewChild('wrapper', { static: true }) targetWrapper!: ElementRef;

  dropdownData$: BehaviorSubject<DropdownData>;

  constructor(@Inject('targetData') targetData: BehaviorSubject<DropdownData>) {
    this.dropdownData$ = targetData;
    console.log(this.dropdownData$.value);
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const current = this.dropdownData$.value;
    this.setPosition(current.position);
    this.dropdownData$.next({
      ...current,
      targetElement: this.targetWrapper,
    });
  }

  setPosition(hostPosition?: DOMRect | null) {
    const rnd = Math.ceil(Math.random() * 1000);
    const rnd2 = Math.ceil(Math.random() * 100);
    const styles = {
      position: 'absolute',
      top: rnd2 + 'px',
      left: rnd + 'px',
      width: '300px',
    };
    this.targetWrapper.nativeElement.style.position = styles.position;
    this.targetWrapper.nativeElement.style.top = styles.top;
    this.targetWrapper.nativeElement.style.left = styles.left;
    this.targetWrapper.nativeElement.style.width = styles.width;
  }
}
