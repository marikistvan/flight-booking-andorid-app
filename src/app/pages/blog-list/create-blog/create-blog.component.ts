import { Component, OnInit, signal } from '@angular/core';
import { ModalDialogParams } from "@nativescript/angular";
import { BlogService } from "~/app/services/blog.service";
import { Blog } from '~/app/models/blog'
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ns-blog-create',
  templateUrl: './create-blog.component.html',
  styleUrls: ['./create-blog.component.scss'],
})
export class CreateBlogComponent implements OnInit {
  mode = signal('');
  blogFormGroup = new FormGroup({
    title: new FormControl<string | null>('', Validators.required),
    content: new FormControl<string | null>('', Validators.required),
    photo: new FormControl<string | null>('', Validators.required),
    id: new FormControl<string | null>('')
  })

  constructor(
    private blogService: BlogService,
    private modalDialogParams: ModalDialogParams
  ) {
    const context = modalDialogParams.context;
    this.mode.set(context.mode);
    if (this.mode() === 'edit') {
      const blog: Blog = context.blog;
      this.blogFormGroup.get('title').setValue(blog.title);
      this.blogFormGroup.get('content').setValue(blog.content);
      this.blogFormGroup.get('id').setValue(blog.id);
    }
  }

  ngOnInit(): void { }

  submitCreate() {
    this.blogService.createBlog(this.generateBlog());
    this.blogService.setBlogs();
    this.modalDialogParams.closeCallback(null);
  }

  generateBlog(): Blog {
    const blog: Blog = {
      title: this.blogFormGroup.get('title').value,
      content: this.blogFormGroup.get('content').value,
      id: this.blogFormGroup.get('id').value ?? ''
    };
    return blog;
  }

  submitEdit() {
    this.blogService.updateBlog(this.generateBlog());
    this.blogService.setBlogs();
    this.modalDialogParams.closeCallback(null);
  }

  onCancel() {
    this.modalDialogParams.closeCallback(null);
  }
}
