import { Injectable } from '@angular/core';

@Injectable()
export class DropdownService {
  static getPosition(domRect: DOMRect) {
    const rnd = Math.ceil(Math.random() * 1000);
    const rnd2 = Math.ceil(Math.random() * 100);
    return {
      position: 'absolute',
      top: rnd2 + 'px',
      left: rnd + 'px',
      width: '300px',
    };
  }
}
