import { Injectable, OnInit } from "@angular/core";
import { firebase } from "@nativescript/firebase-core";
import { ObservableArray } from "@nativescript/core";
import "@nativescript/firebase-auth";
import "@nativescript/firebase-firestore";
import { FieldValue } from "@nativescript/firebase-firestore";
import { Blog } from "../models/blog";
import { catchError, from, map, Observable, shareReplay } from "rxjs";

@Injectable({ providedIn: "root" })
export class BlogService {
  blogs = [];
  userBlogs = [];
  user = firebase().auth().currentUser;
  auth = firebase().auth();

  constructor() { }

  createBlog(blog: Blog) {
    if (this.user) {
      firebase().firestore().collection("blog").add({
        title: blog.title,
        content: blog.content,
        created_at: FieldValue.serverTimestamp(),
        author_id: this.user.uid,
      });
      console.log("blogBejegyzés fent van");
    } else {
      console.log("blogbejegyzés nem sikerült, mert nincs user bejelentkezve");
    }

  }
  private blogs$?: Observable<Blog[]>;

  getBlogs(): Observable<Blog[]> {
    if (!this.blogs$) {
      const blogQuery = firebase()
        .firestore()
        .collection("blog")
        .orderBy("created_at", "desc")
        .get();

      this.blogs$ = from(blogQuery).pipe(
        map(querySnapshot => {
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
          return blogs;
        }),
        catchError(error => {
          console.error("Hiba a blogok lekérdezésekor:", error);
          return [[]];
        }),
        shareReplay(1)
      );
    }

    return this.blogs$;
  }

  async getBlog(blogId: string): Promise<Blog> {
    const blogDoc = await firebase().firestore().collection("blog").doc(blogId).get();

    if (blogDoc.exists) {
      return blogDoc.data();

    } else {
      console.log('Blog not found');
      return null;
    }
  }
  async getUserBlogs(userid: string) {
    this.getBlogs().subscribe({
      next(res) {
        this.userBlogs.push(res.filter(blog => blog.authorId === userid));
      }
    })
  }

  updateBlog(blogId: string, updatedBlog: Blog) {
    if (this.user != null) {
      firebase().firestore().collection("blog").doc(blogId).update({
        title: updatedBlog.title,
        content: updatedBlog.content,
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


}
