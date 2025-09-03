import { Injectable, signal } from "@angular/core";
import { firebase } from "@nativescript/firebase-core";
import "@nativescript/firebase-auth";
import "@nativescript/firebase-firestore";
import { FieldValue } from "@nativescript/firebase-firestore";
import { Blog } from "../models/blog";
import { AuthService } from "./auth.service";

@Injectable({ providedIn: "root" })
export class BlogService {
  private blogs = signal<Blog[]>([]);
  userBlogs = [];

  constructor(private authService: AuthService) {
    this.setBlogs();
  }

  createBlog(blog: Blog) {
    if (this.authService.currentUser) {
      firebase().firestore().collection("blog").add({
        title: blog.title,
        content: blog.content,
        created_at: FieldValue.serverTimestamp(),
        author_id: this.authService.currentUser.uid,
      });
      console.log("blogBejegyzés fent van");
    } else {
      console.log("blogbejegyzés nem sikerült, mert nincs user bejelentkezve");
    }
  }

  getBlogs(): Blog[] {
    return this.blogs();
  }

  setBlogs(): void {
    firebase()
      .firestore()
      .collection("blog")
      .orderBy("created_at", "desc")
      .get()
      .then(querySnapshot => {
        const blogs: Blog[] = [];
        querySnapshot.forEach(doc => {
          const data = doc.data();
          blogs.push({
            id: doc.id,
            title: data.title,
            content: data.content,
            createdAt: data.created_at?.toDate(),
            authorId: data.author_id
          });
        });
        this.blogs.set(blogs);
      })
      .catch(error => {
        console.error("Hiba a blogok lekérdezésekor:", error);
        this.blogs.set([]);
      });
  }

  async getBlog(blogId: string): Promise<Blog> {
    const blogDoc = await firebase().firestore().collection("blog").doc(blogId).get();

    if (blogDoc.exists) {
      return blogDoc.data();
    }

    else {
      console.log('Blog not found');
      return null;
    }
  }
  async getUserBlogs(userid: string) {
    await this.setBlogs();
    this.userBlogs.push(this.blogs().filter(blog => blog.authorId === userid));
  }

  updateBlog(blog:Blog) {
    if (this.authService.currentUser) {
      firebase().firestore().collection("blog").doc(blog.id).update({
        title: blog.title,
        content: blog.content,
        updated_at: FieldValue.serverTimestamp(),
      })
        .then(() => {
          console.log("Blogbejegyzés frissítve");
        })
        .catch((error) => {
          console.error("Hiba a blog frissítése közben:", error);
        });
    } else {
      console.log("Nem sikerült frissíteni, mert nincs bejelentkezett user.");
    }
  }

  deleteBlog(blog: Blog) {
    firebase().firestore().collection('blog').doc(blog.id).delete()
      .then(() => {
        this.setBlogs();
      })
      .catch((error) => {
        console.error('Hiba történt blog törlése során:' + error);
        throw error;
      })
  }
}
