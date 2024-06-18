import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

export const fadeInOut = trigger('fadeInOut', [
  state(
    'void',
    style({
      opacity: 0,
    })
  ),
  transition(':enter', [
    style({ opacity: 0 }),
    animate('200ms ease-in', style({ opacity: 1 })),
  ]),
  transition(':leave', [
    style({ opacity: 1 }),
    animate('150ms ease-out', style({ opacity: 0 })),
  ]),
]);
