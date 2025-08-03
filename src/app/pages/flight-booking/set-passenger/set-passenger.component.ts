import { Component, computed, OnInit, signal } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { action, Application } from "@nativescript/core";
import { ModalDialogOptions, ModalDialogParams, RouterExtensions } from "@nativescript/angular";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Passenger } from '~/app/models/passenger'


@Component({
  selector: "ns-set-passenger",
  templateUrl: "./set-passenger.component.html",
  styleUrls: ["./set-passenger.component.scss"],
})

export class SetpassengerComponent implements OnInit {
  sexType: Array<string> = ['Nő', 'Férfi', 'Egyéb'];
  formTitle: string;
  baggageType: Array<string> = ['Kézipoggyász'];
  passengerForm = new FormGroup({
    lastName: new FormControl<string>('', Validators.required),
    firstName: new FormControl<string>('', Validators.required),
    bornDate: new FormControl<Date | null>(null, Validators.required),
    sex: new FormControl<string>('', Validators.required),
    baggageType: new FormControl<string>('', Validators.required)
  })
  ngOnInit(): void {
  }
  constructor(private modalDialogParams: ModalDialogParams) {
    this.formTitle = modalDialogParams.context;
  }

  submit() {
    const passenger = {
      firstName: this.passengerForm.get('firstName').value,
      lastName: this.passengerForm.get('lastName').value,
      born: this.passengerForm.get('bornDate').value,
      sex: this.passengerForm.get('sex').value,
      baggageType: this.passengerForm.get('baggageType').value
    }
    this.modalDialogParams.closeCallback([passenger,'next']);
  }

  onCancel() {
    const passenger = {
      firstName: this.passengerForm.get('firstName').value,
      lastName: this.passengerForm.get('lastName').value,
      born: this.passengerForm.get('bornDate').value,
      sex: this.passengerForm.get('sex').value,
      baggageType: this.passengerForm.get('baggageType').value
    }
    this.modalDialogParams.closeCallback([passenger,'cancel']);
  }

  openSexPicker() {
    action({
      message: 'Válaszd ki a nemét.',
      cancelButtonText: 'Mégse',
      actions: this.sexType
    }).then(result => {
      if (result !== 'Mégse') {
        this.passengerForm.get('sex').setValue(result);
      }
    });
  }
  openBaggagePicker() {
    action({
      message: 'Válaszd ki a poggyászt.',
      cancelButtonText: 'Mégse',
      actions: this.baggageType
    }).then(result => {
      if (result !== 'Mégse') {
        this.passengerForm.get('baggageType').setValue(result);
      }
    })
  }
}
