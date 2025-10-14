import { CommonModule } from "@angular/common";
import { Screen } from '@nativescript/core';
import { Component, NO_ERRORS_SCHEMA, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { NativeScriptCommonModule, RouterExtensions } from "@nativescript/angular";
import { localize } from "@nativescript/localize";
import { NativeScriptLocalizeModule } from '@nativescript/localize/angular';
import { UserListRowComponent } from "./userList-row/userList-row.component";
import { AuthService } from "~/app/services/auth.service";
import { User, UserDetails } from "~/app/models/user";
import { SearchComponent } from "~/app/pages/search/search.component";
import { SectionHeaderComponent } from "~/app/components/header/section-header.component";

@Component({
  standalone: true,
  selector: "ns-user-list",
  templateUrl: "./userList.component.html",
  styleUrls: ["./userList.component.scss",],
  imports: [
    CommonModule,
    NativeScriptCommonModule,
    UserListRowComponent,
    NativeScriptLocalizeModule,
    SearchComponent,
    SectionHeaderComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]

})
export class UserListComponent implements OnInit {
  loaded: boolean = false;
  users: User[] = [];
  usersDetails: UserDetails[] = [];
  constructor(private authService: AuthService
  ) { }

  ngOnInit() {
    this.loadUsersTEST();
  }

  loadUsers() {
    /*    this.users = [
          {
            uid: "u1a2b3c4d5",
            email: "alice.smith@example.com",
            emailVerified: true,
            disabled: false,
            lastSignInTime: "2025-10-10T08:23:00Z",
            creationTime: "2023-06-14T12:45:00Z",
            provider: "password"
          },
          {
            uid: "x9y8z7w6v5",
            email: "bob.jones@example.org",
            emailVerified: false,
            disabled: false,
            lastSignInTime: "2025-09-28T17:30:00Z",
            creationTime: "2024-02-01T10:10:00Z",
            provider: "google"
          },
          {
            uid: "p0q1r2s3t4",
            email: "carla.mendez@example.net",
            emailVerified: true,
            disabled: true,
            lastSignInTime: "2025-08-15T09:15:00Z",
            creationTime: "2022-11-20T14:00:00Z",
            provider: "facebook"
          }
        ];
    
        this.usersDetails = [
          {
            uid: "u1a2b3c4d5",
            admin: true,
            born: "1990-05-12",
            genre: "female",
            firstName: "Alice",
            lastName: "Smith",
            profileImageUrl: "https://plus.unsplash.com/premium_photo-1666777247416-ee7a95235559?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687"
          },
          {
            uid: "x9y8z7w6v5",
            admin: false,
            born: "1988-09-03",
            genre: "male",
            firstName: "Bob",
            lastName: "Jones",
            profileImageUrl: "https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1972"
          },
          {
            uid: "p0q1r2s3t4",
            admin: false,
            born: "1995-01-25",
            genre: "female",
            firstName: "Carla",
            lastName: "Mendez",
            profileImageUrl: "https://images.unsplash.com/photo-1759852909538-57985f691821?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=765"
          }
        ];
*/
    this.authService.getUsers()
      .then((res) => {
        this.users = res;
      })
      .catch((err) => {
        console.error(err);
      });
    this.authService.getUsersDetails()
      .then((res) => {
        this.usersDetails = res;
      })
      .catch((err) => {
        console.error(err);
      })
  }


  loadUsersTEST() {
    Promise.all([
      this.authService.getUsers(),
      this.authService.getUsersDetails()
    ])
      .then(([users, details]) => {
        this.users = users;
        this.usersDetails = details;
        this.loaded = true;
      })
      .catch(err => console.error(err));
  }

  getCurrentUserDetail(uid: string): UserDetails {
    const res = this.usersDetails.find((u) => u.uid === uid);
    return res;
  }
}
