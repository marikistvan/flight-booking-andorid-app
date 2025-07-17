import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from "@nativescript/angular";
import { Blog } from '~/app/models/blog';

@Component({
  selector: 'ns-read-blog',
  templateUrl: './read-blog.component.html',
  styleUrls: ['./read-blog.component.scss'],
})
export class ReadBlogComponent implements OnInit {
  blog: Blog;

  constructor(
   private modalDialogParams: ModalDialogParams,
  ) {
   this.blog = modalDialogParams.context;
  }

  ngOnInit(): void { }

  onCancel() {
    this.modalDialogParams.closeCallback(null);
  }


}
