import { Component, Input, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { Application } from '@nativescript/core';

@Component({
  selector: 'ns-section-header',
  standalone: true,
  templateUrl: 'section-header.component.html',
  styleUrls: ["section-header.component.scss"],
  schemas: [NO_ERRORS_SCHEMA]
})

export class SectionHeaderComponent {
  @Input({ required: true }) title!: string;
  constructor() { }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView()
    sideDrawer.showDrawer()
  }
}
