import { Component, OnInit } from '@angular/core';
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
  blogTitle: string;
  blogDescription: string;
  blogFormGroup = new FormGroup({
    title: new FormControl<string | null>('', Validators.required),
    content: new FormControl<string | null>('', Validators.required),
    photo: new FormControl<string | null>('', Validators.required),
  })

  constructor(
    private blogService: BlogService,
    private modalDialogParams: ModalDialogParams
  ) { }

  ngOnInit(): void { }

  submit() {
    const blog: Blog = {
      title: this.blogFormGroup.get('title').value,
      content: this.blogFormGroup.get('content').value,
    };

    this.blogService.createBlog(blog);
    this.modalDialogParams.closeCallback(null);
  }

  onCancel() {
    this.modalDialogParams.closeCallback(null);
  }
}
