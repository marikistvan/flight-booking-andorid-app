import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NO_ERRORS_SCHEMA, Output } from '@angular/core';
import { NativeScriptCommonModule } from '@nativescript/angular';
import { localize } from "@nativescript/localize";
import { NativeScriptLocalizeModule } from '@nativescript/localize/angular';

@Component({
    selector: 'ns-profile-card',
    standalone: true,
    templateUrl: './profile-card.component.html',
    styleUrls: ['./profile-card.component.scss'],
    imports: [
        CommonModule,
        NativeScriptCommonModule,
        NativeScriptLocalizeModule
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class ProfileCardComponent {
    @Input() photo?: string;
    @Input() userName!: string;
    @Input() email!: string;
    @Input() born!: string;
    @Input() sex!: string;

    @Output() edit = new EventEmitter<number>();
    @Output() delete = new EventEmitter<void>();

    setProfil(section: number) {
        this.edit.emit(section);
    }

    deleteProfile() {
        this.delete.emit();
    }
}
