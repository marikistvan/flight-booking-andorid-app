import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NO_ERRORS_SCHEMA, OnChanges, OnInit, Output, signal, SimpleChanges } from '@angular/core';
import { NativeScriptCommonModule, NativeScriptFormsModule } from '@nativescript/angular';

@Component({
    selector: 'ns-search',
    standalone: true,
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
    imports: [NativeScriptFormsModule, CommonModule, NativeScriptCommonModule],
    schemas: [NO_ERRORS_SCHEMA],
})
export class SearchComponent<T> implements OnInit {
    @Input({ required: true }) items: T[] = [];
    @Input({ required: true }) filterKeys: (keyof T)[] = [];
    @Output() filteredItemsChange = new EventEmitter<T[]>();
    searchIconSrc = '../../../assets/icons/search-v3.png';
    exitIconSrc = '../../../assets/icons/exit.png';

    searchTerm: string = '';

    constructor() { }

    ngOnInit() {
        this.filteredItemsChange.emit(this.items);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['items']) {
            this.onSearchChange();
        }
    }

    onSearchChange() {
        if (!this.searchTerm) {
            this.filteredItemsChange.emit(this.items);
            return;
        }

        const term = this.searchTerm.toLowerCase();
        const filtered = this.items.filter(item =>
            this.filterKeys.some(key => {
                const value = String(item[key] ?? '').toLowerCase();
                return value.includes(term);
            })
        );

        this.filteredItemsChange.emit(filtered);
    }

    onDelete() {
        this.searchTerm = '';
        this.onSearchChange();
    }
}
