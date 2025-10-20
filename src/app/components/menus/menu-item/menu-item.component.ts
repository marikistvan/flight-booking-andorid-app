import { CommonModule } from '@angular/common';
import { Component, Input, NO_ERRORS_SCHEMA } from '@angular/core';
import {
    NativeScriptCommonModule,
    RouterExtensions,
} from '@nativescript/angular';
import { Application } from '@nativescript/core';
import { NativeScriptLocalizeModule } from '@nativescript/localize/angular';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';

@Component({
    selector: 'ns-menu-item',
    standalone: true,
    templateUrl: 'menu-item.component.html',
    styleUrls: ['menu-item.component.scss'],
    imports: [
        CommonModule,
        NativeScriptCommonModule,
        NativeScriptLocalizeModule,
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class MenuItemComponent {
    @Input({ required: true }) navlink!: string;
    @Input({ required: true }) title!: string;
    @Input({ required: true }) icon!: string;
    constructor(private routerExtensions: RouterExtensions) {}

    isComponentSelected(): boolean {
        return this.routerExtensions.router.url === this.navlink;
    }

    onNavItemTap(): void {
        this.routerExtensions.navigate([this.navlink], {
            transition: {
                name: 'fade',
            },
        });
        const sideDrawer = <RadSideDrawer>Application.getRootView();
        sideDrawer.closeDrawer();
    }
}
