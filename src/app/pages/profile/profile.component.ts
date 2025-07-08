import { Component, OnInit } from '@angular/core'
import { RadSideDrawer } from 'nativescript-ui-sidedrawer'
import { Application } from '@nativescript/core'
import { RouterExtensions } from "@nativescript/angular";
import { FirebaseAuth } from '@nativescript/firebase-auth';
import { firebase } from "@nativescript/firebase-core";
import { BlogService } from '../../services/blog.service';

export interface Blog {
  id?:string;
  title: string;
  content: string;
  createdAt: Date;
  author_id:string;
}
@Component({
  selector: 'Profile',
  templateUrl: './profile.component.html',
  styleUrls: ["./profile.component.css"],
})
export class ProfileComponent implements OnInit {
  user=firebase().auth().currentUser;
  isBlogDetailOn:boolean;
  firstname:string;
  lastName:string;
  fullName:string;
  email:string;
  born:Date;
  genre:string;
  myBlogs=[];
  blogTitle:string;
  blogDescription:string;
  toModifyBlogId:string;

  constructor(private blogService: BlogService,private routerExtensions: RouterExtensions) {
    // Use the component constructor to inject providers.
  }

  async ngOnInit(): Promise<void> {
    console.log("figyelj tess");
    if(this.user!=null){
      firebase()
      .firestore()
      .collection("users")
      .doc(this.user.uid)
      .get()
      .then((cred) => {
        if (cred && !cred.exists) {
          console.log('Document does not exist')
          return
        }
        this.firstname=cred.data()['firstName'];
        this.lastName=cred.data()['lastName'];
        this.fullName=this.firstname+' '+this.lastName;
        this.born=cred.data()['born'];
        this.genre=cred.data()['genre'];
      });
      this.myBlogs= await this.blogService.getUserBlogs(this.user.uid);
     // this.modify("0aihPHAA1Rj0S4xyFULM");
    }
  }
  onBlogTap($event):void{

  }
  userDataModify():boolean{
    console.log("átirányítás");
    this.routerExtensions.navigate(['profile-edit']);

    return true;
  }
  modify(id: string):void{
    this.isBlogDetailOn=true;
    this.toModifyBlogId=id;
    for(let i=0;i<this.myBlogs.length;i++){
      if(this.myBlogs[i].id==id){
        this.blogTitle=this.myBlogs[i].title;
        this.blogDescription=this.myBlogs[i].content;
        break;
      }
    }
  }
  backAction(){
    this.isBlogDetailOn=false;
  }
  modifyAction():boolean{
    const blog : Blog={
      title: this.blogTitle,
      content: this.blogDescription,
      createdAt: new Date(),
      author_id:this.user.uid,
    }
    this.blogService.updateBlog(this.toModifyBlogId,blog);
    this.isBlogDetailOn=false;
    return true;
  }
  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView()
    sideDrawer.showDrawer()
  }
  SetProfil(): void{
    console.log("set");
  }
}
