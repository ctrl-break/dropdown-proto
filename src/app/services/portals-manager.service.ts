import { Injectable, TemplateRef } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PortalsManagerService {
  private portals: TemplateRef<unknown>[] = [];
  private portalsSubject: BehaviorSubject<TemplateRef<unknown>[]> =
    new BehaviorSubject<TemplateRef<unknown>[]>([]);

  constructor() {}

  get portals$(): Observable<any[]> {
    return this.portalsSubject.asObservable();
  }

  addTemplate(template: TemplateRef<unknown>): void {
    if (this.portals.find((item) => item === template)) {
      return;
    }
    this.portals.push(template);
    this.emitMapAsArray();
    console.log(this.portals);
  }

  removeTemplate(template: TemplateRef<unknown>): void {
    console.log(template, this.portals);
    this.portals = this.portals.filter((item) => item !== template);
    this.emitMapAsArray();
  }

  private emitMapAsArray(): void {
    this.portalsSubject.next(this.portals);
  }
}
