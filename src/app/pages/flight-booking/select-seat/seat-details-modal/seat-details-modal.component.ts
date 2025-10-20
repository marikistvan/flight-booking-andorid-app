import { Component } from '@angular/core';
import { ModalDialogParams } from '@nativescript/angular';

@Component({
    selector: 'seat-details-modal',
    templateUrl: './seat-details-modal.component.html',
    styleUrls: ['./seat-details-modal.component.scss'],
})
export class SeatDetailsModalComponent {
    data: any;

    constructor(private params: ModalDialogParams) {
        this.data = params.context;
    }

    reserve() {
        this.params.closeCallback({
            action: 'reserve',
            seat: this.data.seatNumber,
        });
        console.log('foglalás');
    }

    close() {
        this.params.closeCallback(null);
        console.log('bezárás');
    }
}
