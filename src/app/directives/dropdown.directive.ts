import { Directive, Input, TemplateRef } from '@angular/core';
import { PositionDirective } from './position.directive';
import { ClickToggleDirective } from './click-toggle.directive';

@Directive({
  selector: '[mDropdown]',
  standalone: true,
  hostDirectives: [
    {
      directive: PositionDirective,
      inputs: ['template: mDropdown'],
    },
    {
      directive: ClickToggleDirective,
      inputs: ['template: mDropdown'],
    },
  ],
})
export class DropdownDirective {
  @Input('mDropdown') template!: TemplateRef<unknown>;
}
