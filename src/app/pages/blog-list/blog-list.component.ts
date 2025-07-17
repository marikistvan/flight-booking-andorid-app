import { Component, ViewContainerRef } from '@angular/core'
import { RadSideDrawer } from 'nativescript-ui-sidedrawer'
import { Application } from '@nativescript/core'
import { ModalDialogOptions, ModalDialogService } from "@nativescript/angular"
import { BlogService } from "../../services/blog.service"
import { Blog } from '../../models/blog'
import { CreateBlogComponent } from './create-blog/create-blog.component'
import { AuthService } from '~/app/services/auth.service'

@Component({
  selector: 'ns-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss'],
})
export class BlogListComponent {
  searchTerm: string;
  blogName: string;
  blogDescription: string;
  blogDate: string;

  constructor(
    public blogService: BlogService,
    private modalDialogService: ModalDialogService,
    private viewContainerRef: ViewContainerRef,
    public authService: AuthService
  ) {}

  onSearchTextChanged(event: any) {
    const query = event.value.toLowerCase();
  }

  onDelete() {
    this.searchTerm = "";
  }

  async createBlog() {
    const options: ModalDialogOptions = {
      context: "create",
      fullscreen: true,
      viewContainerRef: this.viewContainerRef
    };
    const result = await this.modalDialogService
      .showModal(CreateBlogComponent, options);

    if (result as Blog) {
    }
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView()
    sideDrawer.showDrawer()
  }
}
