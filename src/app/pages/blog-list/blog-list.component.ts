import { Component, NO_ERRORS_SCHEMA, OnInit, Signal, signal, ViewContainerRef, WritableSignal } from '@angular/core';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { Application } from '@nativescript/core';
import {
    ModalDialogOptions,
    ModalDialogService,
    NativeScriptCommonModule,
} from '@nativescript/angular';
import { BlogService } from '../../services/blog.service';
import { Blog } from '../../models/blog';
import { CreateBlogComponent } from './create-blog/create-blog.component';
import { AuthService } from '~/app/services/auth.service';
import { SearchComponent } from '~/app/pages/search/search.component';
import { BlogItemComponent } from './blog-item/blog-item.component';
import { CommonModule } from '@angular/common';
import { NativeScriptUISideDrawerModule } from 'nativescript-ui-sidedrawer/angular';
import { NativeScriptUIListViewModule } from 'nativescript-ui-listview/angular';
import { NativeScriptLocalizeModule } from '@nativescript/localize/angular';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'ns-blog-list',
    standalone: true,
    templateUrl: './blog-list.component.html',
    styleUrls: ['./blog-list.component.scss'],
    imports: [
        SearchComponent,
        BlogItemComponent,
        CommonModule,
        NativeScriptCommonModule,
        NativeScriptLocalizeModule,
        NativeScriptUIListViewModule,
        FormsModule,
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class BlogListComponent implements OnInit {
    blogName: string;
    blogDescription: string;
    blogDate: string;
    blogs: WritableSignal<Blog[]> = signal([]);
    filteredBlogs: WritableSignal<Blog[]> = signal([]);

    constructor(
        public blogService: BlogService,
        private modalDialogService: ModalDialogService,
        private viewContainerRef: ViewContainerRef,
        public authService: AuthService
    ) { }
    ngOnInit(): void {
        this.blogs.set(this.blogService.getBlogs());
    }

    async createBlog() {
        const options: ModalDialogOptions = {
            context: {
                mode: 'create',
            },
            fullscreen: true,
            viewContainerRef: this.viewContainerRef,
        };
        await this.modalDialogService.showModal(
            CreateBlogComponent,
            options
        );
    }

    onFilteredBlogs(list: Blog[]) {
        this.filteredBlogs.set(list);
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>Application.getRootView();
        sideDrawer.showDrawer();
    }
}
