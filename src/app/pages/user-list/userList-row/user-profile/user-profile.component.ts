import { CommonModule, DatePipe } from "@angular/common";
import { Component, input, Input, NO_ERRORS_SCHEMA, OnInit, signal } from "@angular/core";
import { NativeScriptCommonModule, RouterExtensions } from "@nativescript/angular";
import { NativeScriptLocalizeModule } from '@nativescript/localize/angular';
import { SectionHeaderComponent } from "~/app/components/header/section-header.component";
import { User, UserDetails } from "~/app/models/user";
import { FlightSearchStateService } from "~/app/services/flight-search-state.service";
import { ProfileCardComponent } from "~/app/components/profile-card/profile-card.component";

@Component({
  providers: [DatePipe],
  standalone: true,
  selector: "ns-user-profile",
  templateUrl: "./user-profile.component.html",
  imports: [
    CommonModule,
    NativeScriptCommonModule,
    NativeScriptLocalizeModule,
    SectionHeaderComponent,
    ProfileCardComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class UserProfileComponent implements OnInit {
  imageSrc = input();
  userDetails: UserDetails;
  user: User;
  constructor(public datePipe: DatePipe, private searchStateService: FlightSearchStateService) { }
  ngOnInit(): void {
    this.user = (this.searchStateService.getProfileToSee() ?? {
      uid: "u1a2b3c4d5",
      email: "alice.smith@example.com",
      emailVerified: true,
      disabled: false,
      lastSignInTime: "2025-10-10T08:23:00Z",
      creationTime: "2023-06-14T12:45:00Z",
      provider: "password"
    });

    this.userDetails = this.searchStateService.getProfileDetialsToSee() ?? {
      uid: "u1a2b3c4d5",
      admin: true,
      born: "1990-05-12",
      genre: "female",
      firstName: "Alice",
      lastName: "Smith",
      profileImageUrl: "https://plus.unsplash.com/premium_photo-1666777247416-ee7a95235559?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687"
    };
  }
  async deleteProfile() { }

  get userName() {
    return (this.userDetails?.lastName ?? '') + ' ' + (this.userDetails?.firstName ?? '');
  }

  get email() {
    return this.user?.email ?? '';
  }

  get born() {
    if (this.userDetails?.born) {
      return this.datePipe.transform(this.userDetails.born, 'YYYY.MM.dd');
    }
  }

  get sex() {
    return this.userDetails?.genre ?? '';
  }

  get photo() {
    return this.userDetails?.profileImageUrl;
  }

  async setProfil(id: number) { }
}
