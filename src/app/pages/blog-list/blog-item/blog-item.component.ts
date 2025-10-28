import { Component, Input, NO_ERRORS_SCHEMA, ViewContainerRef } from '@angular/core';
import { ModalDialogOptions, ModalDialogService, NativeScriptCommonModule } from '@nativescript/angular';
import { Blog } from '../../../models/blog';
import { AuthService } from '../../../services/auth.service';
import { ReadBlogComponent } from '../read-blog/read-blog.component';
import { BlogService } from '../../../services/blog.service';
import { DatePicker, Dialogs } from '@nativescript/core';
import { CreateBlogComponent } from '../create-blog/create-blog.component';
import { localize } from '@nativescript/localize';
import { CommonModule, DatePipe } from '@angular/common';
import { NativeScriptLocalizeModule } from '@nativescript/localize/angular';

@Component({
    providers: [DatePipe],
    selector: 'ns-blog-item',
    standalone: true,
    templateUrl: './blog-item.component.html',
    styleUrls: ['./blog-item.component.scss'],
    imports: [CommonModule,
        NativeScriptCommonModule,
        NativeScriptLocalizeModule],
    schemas: [NO_ERRORS_SCHEMA]
})
export class BlogItemComponent {
    @Input({ required: true }) blog!: Blog;

    constructor(
        public authService: AuthService,
        private modalDialogService: ModalDialogService,
        private viewContainerRef: ViewContainerRef,
        private blogService: BlogService,
        public datePipe: DatePipe
    ) { }

    async editBlog() {
        const options: ModalDialogOptions = {
            context: {
                mode: 'edit',
                blog: this.blog,
            },
            fullscreen: true,
            viewContainerRef: this.viewContainerRef,
        };
        const result = await this.modalDialogService.showModal(
            CreateBlogComponent,
            options
        );

        if (result as Blog) {
        }
    }

    async deleteBlog() {
        if (!(await this.confirmDelete())) return;
        this.blogService.deleteBlog(this.blog);
    }

    private async confirmDelete(): Promise<boolean> {
        return Dialogs.confirm({
            title: localize('blogItem.deleteBlog'),
            message: localize('blogItem.isSuredeleteBlog'),
            okButtonText: localize('general.yes'),
            cancelButtonText: localize('general.no'),
            neutralButtonText: localize('general.cancel'),
        });
    }

    testOpenBlog() {
        console.log('openBlog');
    }
    async openBlog() {
        const options: ModalDialogOptions = {
            context: this.blog,
            fullscreen: true,
            viewContainerRef: this.viewContainerRef,
        };
        const result = await this.modalDialogService.showModal(
            ReadBlogComponent,
            options
        );

        if (result) {
        }
    }
}
