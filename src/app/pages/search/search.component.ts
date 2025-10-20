import { CommonModule } from '@angular/common';
import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NativeScriptCommonModule } from '@nativescript/angular';

@Component({
    selector: 'ns-search',
    standalone: true,
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
    imports: [FormsModule, CommonModule, NativeScriptCommonModule],
    schemas: [NO_ERRORS_SCHEMA],
})
export class SearchComponent {
    searchTerm = signal('');
    searchIconSrc = '../../../assets/icons/search-v3.png';
    exitIconSrc = '../../../assets/icons/exit.png';

    constructor() {}
    onSearchTextChanged(value: string) {
        this.searchTerm.set(value);
    }

    onDelete() {
        this.searchTerm.set('');
    }
}
