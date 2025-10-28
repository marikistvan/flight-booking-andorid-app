import { Component, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { ModalDialogParams, NativeScriptCommonModule } from '@nativescript/angular';
import { Blog } from '~/app/models/blog';

@Component({
    selector: 'ns-read-blog',
    standalone: true,
    templateUrl: './read-blog.component.html',
    styleUrls: ['./read-blog.component.scss'],
    imports: [NativeScriptCommonModule],
    schemas: [NO_ERRORS_SCHEMA]
})
export class ReadBlogComponent implements OnInit {
    blog: Blog;

    constructor(private modalDialogParams: ModalDialogParams) {
        this.blog = modalDialogParams.context;
    }

    ngOnInit(): void { }

    onCancel() {
        this.modalDialogParams.closeCallback(null);
    }
}
