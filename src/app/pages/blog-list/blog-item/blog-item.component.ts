import { Component, Input, ViewContainerRef } from '@angular/core'
import { ModalDialogOptions, ModalDialogService } from '@nativescript/angular';
import { Blog } from '~/app/models/blog';
import { AuthService } from '~/app/services/auth.service';
import {ReadBlogComponent} from '../read-blog/read-blog.component'

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

  ) { }

  testEdit() {
    console.log("edit");
  }
  testDelete() {
    console.log("delete");
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
