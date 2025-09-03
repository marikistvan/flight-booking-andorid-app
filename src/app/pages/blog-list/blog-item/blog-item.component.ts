import { Component, Input, ViewContainerRef } from '@angular/core'
import { ModalDialogOptions, ModalDialogService } from '@nativescript/angular';
import { Blog } from '~/app/models/blog';
import { AuthService } from '~/app/services/auth.service';
import { ReadBlogComponent } from '../read-blog/read-blog.component'
import { BlogService } from '~/app/services/blog.service';
import { Dialogs } from '@nativescript/core';
import { CreateBlogComponent } from '../create-blog/create-blog.component';

@Component({
  selector: 'ns-blog-item',
  templateUrl: './blog-item.component.html',
  styleUrls: ['./blog-item.component.scss'],
})
export class BlogItemComponent {
  @Input({ required: true }) blog!: Blog;

  constructor(
    public authService: AuthService,
    private modalDialogService: ModalDialogService,
    private viewContainerRef: ViewContainerRef,
    private blogService: BlogService

  ) { }

  async editBlog() {
    const options: ModalDialogOptions = {
      context: {
        mode: "edit",
        blog: this.blog
      },
      fullscreen: true,
      viewContainerRef: this.viewContainerRef
    };
    const result = await this.modalDialogService
      .showModal(CreateBlogComponent, options);

    if (result as Blog) {
    }
  }

  async deleteBlog() {
    if (!(await this.confirmDelete())) return;
    this.blogService.deleteBlog(this.blog);
  }

  private async confirmDelete(): Promise<boolean> {
    return Dialogs.confirm({
      title: 'Blog törlése!',
      message: 'Biztosan törölni akarod a blogot?',
      okButtonText: 'Igen',
      cancelButtonText: 'Nem',
      neutralButtonText: 'Mégsem',
    });
  }

  testOpenBlog() {
    console.log("openBlog");
  }
  async openBlog() {

    const options: ModalDialogOptions = {
      context: this.blog,
      fullscreen: true,
      viewContainerRef: this.viewContainerRef
    };
    const result = await this.modalDialogService
      .showModal(ReadBlogComponent, options);

    if (result) {
    }
  }
}
