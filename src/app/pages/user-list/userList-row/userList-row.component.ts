import { CommonModule, DatePipe } from '@angular/common';
import {
    Component,
    Input,
    NO_ERRORS_SCHEMA,
    OnInit,
    signal,
} from '@angular/core';
import {
    NativeScriptCommonModule,
    RouterExtensions,
} from '@nativescript/angular';
import { NativeScriptLocalizeModule } from '@nativescript/localize/angular';
import { localize } from '@nativescript/localize';
import { User, UserDetails } from '~/app/models/user';
import { FlightSearchStateService } from '~/app/services/flight-search-state.service';

@Component({
    providers: [DatePipe],
    standalone: true,
    selector: 'ns-user-list-row',
    templateUrl: './userList-row.component.html',
    styleUrls: ['./userList-row.component.scss'],
    imports: [
        CommonModule,
        NativeScriptCommonModule,
        NativeScriptLocalizeModule,
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class UserListRowComponent implements OnInit {
    @Input({ required: true }) user!: User;
    @Input({ required: true }) userDetails!: UserDetails;

    get userCreate() {
        return this.datePipe.transform(this.user.creationTime, 'YYYY.MM.dd');
    }

    get userName() {
        return this.userDetails.lastName + ' ' + this.userDetails.firstName;
    }

    get userId() {
        return this.user.uid;
    }

    ngOnInit(): void {}
    constructor(
        public datePipe: DatePipe,
        private searchStateService: FlightSearchStateService,
        private routerExtensions: RouterExtensions
    ) {}

    selectProfile() {
        this.searchStateService.setProfileToSee(this.user);
        this.searchStateService.setProfileDetailsToSee(this.userDetails);
        this.routerExtensions.navigate(['userProfile']);
    }
}
