import { Component, OnInit } from '@angular/core'
import { RadSideDrawer } from 'nativescript-ui-sidedrawer'
import { Application } from '@nativescript/core'
import { RouterExtensions } from "@nativescript/angular";
import { BlogService } from "../../services/blog.service";
import { AuthService } from "../../services/auth.service"


export interface Blog {
  title: string;
  content: string;
  createdAt: Date;
  author_id:string;
}

@Component({
  selector: 'Blog',
  templateUrl: './blog.component.html',
  styleUrls: ["./blog.component.css"],
})
export class BlogComponent implements OnInit {
  blogName: string;
  blogDescription: string;
  blogDate:string;
  constructor(private routerExtensions: RouterExtensions, private blogService: BlogService, private authService: AuthService) {
  }
  blogs= [];
  isBlogDetailOn: boolean;
  ngOnInit(): void {
    this.isBlogDetailOn = false;
    this.blogService.getBlogs().then((data: Blog[]) => {
      this.blogs = data;
  
      if (this.blogs.length > 0) {
        console.log(this.blogs[0].title);
      }
    });
}

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView()
    sideDrawer.showDrawer()
  }
  CreateBlog(): void{
    this.routerExtensions.navigate(['blogCreate']);
  }
  formatDate(input: string): string {
    const date = new Date(input);
  
    const year = date.getFullYear();
    const month = this.padZero(date.getMonth() + 1);
    const day = this.padZero(date.getDate());
    const hours = this.padZero(date.getHours());
    const minutes = this.padZero(date.getMinutes());
  
    return `${year}.${month}.${day} ${hours}:${minutes}`;
  }
  
  private padZero(value: number): string {
    return value < 10 ? '0' + value : value.toString();
  }
  async onBlogTap(event: any) {
    this.isBlogDetailOn=true;
    const tappedItemIndex = event.index;
    const tappedBlog = this.blogs[tappedItemIndex];
    this.blogName=tappedBlog.title;
    this.blogDescription=tappedBlog.content;
    this.blogDate=this.formatDate(tappedBlog.createdAt);
    console.log(this.blogDate);
    // Ide jöhet pl. navigáció, részletek megnyitása:
    // this.router.navigate(["/blog-reszletek", tappedBlog.id]);
  }
  ExitDetails(){
    this.isBlogDetailOn=false;
    console.log("kiléptem a detailsből");
  }
  onBlogSelect(blog: any) {
    console.log("hi");
}
}
