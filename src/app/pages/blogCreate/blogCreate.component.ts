import { Component, OnInit } from '@angular/core';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { Application } from '@nativescript/core';
import { FirebaseAuth } from '@nativescript/firebase-auth';
import { RouterExtensions } from "@nativescript/angular";
import { BlogService } from "../../services/blog.service";

export interface Blog {
  title: string;
  content: string;
  createdAt: Date;
  author_id:string;
}

@Component({
  selector: 'BlogCreate',
  templateUrl: './blogCreate.component.html',
  styleUrls: ["./blogCreate.component.css"],
})
export class BlogCreateComponent implements OnInit {
  blogTitle:string;
  blogDescription:string;
  constructor(private blogService: BlogService,private router:RouterExtensions) {
  }

  ngOnInit(): void {}

  createAction():void{
    
    const blog: Blog = {
      title: this.blogTitle,
      content: this.blogDescription,
      author_id:"userId",
      createdAt: new Date(),
    };

    this.blogService.createBlog(blog);
    this.router.navigate(['blog']);
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView()
    sideDrawer.showDrawer()
  }

}
