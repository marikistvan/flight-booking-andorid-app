import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import {
    action,
    Application,
    Dialogs,
    ObservableArray,
} from '@nativescript/core';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { PassengerCategory } from '../../../models/passenger-category';
import { ModalDialogParams } from '@nativescript/angular';
import { localize } from '@nativescript/localize';

@Component({
    selector: 'ns-flightSearchPassengersSelectorComponent',
    templateUrl: 'flightSearchPassengersSelector.component.html',
    styleUrls: ['./flightSearchPassengersSelector.component.scss'],
})
export class FlightSearchPassengersSelectorComponent implements OnInit {
    passengersFormGroup: FormGroup;
    isPassengerNumberZero: boolean;
    isInfantsNumberMoreThenAdults: boolean;
    isOnlyChild: boolean;
    isTotalNumberOfSeatedTravelersMoreThenNine: boolean;

    passengerCategories: PassengerCategory[] = [
        {
            id: 'adult',
            ageCategory: localize('passengerCategory.adult'),
            description: localize('passengerCategory.adultDes'),
            count: 1,
        },
        {
            id: 'child',
            ageCategory: localize('passengerCategory.child'),
            description: localize('passengerCategory.childDes'),
            count: 0,
        },
        {
            id: 'infant',
            ageCategory: localize('passengerCategory.infant'),
            description: localize('passengerCategory.infantDes'),
            count: 0,
        },
    ];
    ngOnInit(): void {}
    constructor(
        private formBuilder: FormBuilder,
        private modalDialogParams: ModalDialogParams,
        private readonly changeDetectorRef: ChangeDetectorRef
    ) {
        setTimeout(() => this.changeDetectorRef.detectChanges(), 0);
        const receivePassengersCategories: PassengerCategory[] =
            modalDialogParams.context;
        for (let i = 0; i < receivePassengersCategories.length; i++) {
            this.passengerCategories[i].count =
                receivePassengersCategories[i].count;
        }
        this.passengersFormGroup = this.formBuilder.group(
            Object.fromEntries(
                this.passengerCategories.map((p) => [p.id, [p.count]])
            )
        );
        this.isInfantsNumberMoreThenAdults = false;
        this.isOnlyChild = false;
        this.isTotalNumberOfSeatedTravelersMoreThenNine = false;
    }
    increment(i: number): void {
        const category = this.passengerCategories[i];
        if (category.count < 8) {
            category.count++;
            this.passengersFormGroup.get(category.id)?.setValue(category.count);
        }
        this.validating();
    }

    decrement(i: number): void {
        const category = this.passengerCategories[i];
        if (category.count > 0) {
            category.count--;
            this.passengersFormGroup.get(category.id)?.setValue(category.count);
        }
        this.validating();
    }
    getPassengersNumber() {
        let sum = 0;
        this.passengerCategories.forEach((element) => (sum += element.count));
        if (sum === 0) {
            this.isPassengerNumberZero = true;
        } else {
            this.isPassengerNumberZero = false;
        }
        return sum;
    }
    submit() {
        if (this.validating() === 0) {
            this.modalDialogParams.closeCallback(this.passengerCategories);
        }
    }
    validating(): number {
        let count = 0;
        const adults = this.passengerCategories[0].count;
        const children = this.passengerCategories[1].count;
        const infants = this.passengerCategories[2].count;
        const totalPassengers = this.getPassengersNumber();

        // Több csecsemő, mint felnőtt
        this.isInfantsNumberMoreThenAdults = infants > adults;
        if (this.isInfantsNumberMoreThenAdults) count++;

        // Csak gyermek(ek) utaznak
        this.isOnlyChild =
            totalPassengers !== 0 && children === totalPassengers;
        if (this.isOnlyChild) count++;

        // Nincs utas
        this.isPassengerNumberZero = totalPassengers === 0;
        if (this.isPassengerNumberZero) count++;

        // 9-nél több utas
        this.isTotalNumberOfSeatedTravelersMoreThenNine = totalPassengers > 9;
        if (this.isTotalNumberOfSeatedTravelersMoreThenNine) count++;

        return count;
    }

    onCancel() {
        this.modalDialogParams.closeCallback(null);
    }
    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>Application.getRootView();
        sideDrawer.showDrawer();
    }
}
