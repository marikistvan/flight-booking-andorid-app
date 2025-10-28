import { CommonModule } from '@angular/common';
import {
  Component,
  NO_ERRORS_SCHEMA,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  NativeScriptCommonModule,
} from '@nativescript/angular';
import { NativeScriptLocalizeModule } from '@nativescript/localize/angular';
import { UserListRowComponent } from './userList-row/userList-row.component';
import { AuthService } from '~/app/services/auth.service';
import { User, UserDetails } from '~/app/models/user';
import { SearchComponent } from '~/app/pages/search/search.component';
import { SectionHeaderComponent } from '~/app/components/header/section-header.component';

@Component({
  standalone: true,
  selector: 'ns-user-list',
  templateUrl: './userList.component.html',
  styleUrls: ['./userList.component.scss'],
  imports: [
    CommonModule,
    NativeScriptCommonModule,
    UserListRowComponent,
    NativeScriptLocalizeModule,
    SearchComponent,
    SectionHeaderComponent,
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class UserListComponent implements OnInit {
  loaded: boolean = false;
  users: WritableSignal<User[]> = signal([]);
  usersDetails: UserDetails[] = [];
  filteredUsers: WritableSignal<User[]> = signal([]);
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    Promise.all([
      this.authService.getUsers(),
      this.authService.getUsersDetails(),
    ])
      .then(([users, details]) => {
        this.users.set(users);
        this.usersDetails = details;
        this.loaded = true;
      })
      .catch((err) => console.error(err));
  }

  getCurrentUserDetail(uid: string): UserDetails {
    const res = this.usersDetails.find((u) => u.uid === uid);
    return res;
  }

  onFilteredUsers(user: User[]) {
    this.filteredUsers.set(user);
  }
}
