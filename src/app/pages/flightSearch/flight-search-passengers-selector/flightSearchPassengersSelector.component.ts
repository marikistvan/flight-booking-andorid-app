import { Component, OnInit, signal } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { action, Application, Dialogs, ObservableArray } from "@nativescript/core";
import { FormControl, FormBuilder, FormGroup } from "@angular/forms";
import { PassengerCategory } from '../../../models/passenger-category';
import { ModalDialogParams } from "@nativescript/angular";
@Component({
  selector: "ns-flightSearchPassengersSelectorComponent",
  templateUrl: "flightSearchPassengersSelector.component.html",
  styleUrls: ["./flightSearchPassengersSelector.component.scss"],
})

export class FlightSearchPassengersSelectorComponent implements OnInit {
  passengersFormGroup: FormGroup;
  isPassengerNumberZero:boolean;
  passengerCategories: PassengerCategory[] = [
    { id: 'adult', ageCategory: 'Felnőtt', description: '18 év felett', count: 1 },
    { id: 'youth', ageCategory: 'Fiatal', description: '12–17 év között', count: 0 },
    { id: 'child', ageCategory: 'Gyerek', description: '2–12 év között', count: 0 },
    { id: 'infant', ageCategory: 'Csecsemő', description: '0–2 év között', count: 0 },
  ];
  ngOnInit(): void {
  }
  constructor(private formBuilder: FormBuilder,private modalDialogParams: ModalDialogParams) {
    const receivePassengersCategories:PassengerCategory[]=modalDialogParams.context;
    for(let i=0;i<receivePassengersCategories.length;i++){
      this.passengerCategories[i].count=receivePassengersCategories[i].count;
    }
    this.passengersFormGroup = this.formBuilder.group(
      Object.fromEntries(
        this.passengerCategories.map(p => [p.id, [p.count]])
      )
    );
  }
  increment(i: number): void {
    const category = this.passengerCategories[i];
    if (category.count < 8) {
      category.count++;
      this.passengersFormGroup.get(category.id)?.setValue(category.count);
    }
  }

  decrement(i: number): void {
    const category = this.passengerCategories[i];
    if (category.count > 0) {
      category.count--;
      this.passengersFormGroup.get(category.id)?.setValue(category.count);
    }
  }
  getPassengersNumber(){
    let sum=0;
    this.passengerCategories.forEach(element =>
      sum+=element.count,
    );
    if(sum===0) {
      this.isPassengerNumberZero=true;
    }else{
      this.isPassengerNumberZero=false;
    }
    return sum;
  }
  submit() {
    if(this.getPassengersNumber()!==0){
    this.modalDialogParams.closeCallback(this.passengerCategories); 
    }else{
      this.isPassengerNumberZero=true;
    }
  }

  onCancel() {
    this.modalDialogParams.closeCallback(null);
  }
  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView()
    sideDrawer.showDrawer()
  }
}
