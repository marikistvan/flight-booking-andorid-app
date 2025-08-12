import { AfterViewInit, Component, computed, ElementRef, OnInit, signal, ViewChild, ViewContainerRef } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { action, Application, GridLayout, Image, ItemSpec, Label, TextField } from "@nativescript/core";
import { ModalDialogOptions, ModalDialogParams, ModalDialogService, RouterExtensions } from "@nativescript/angular";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { FlightInfo, Passenger } from '~/app/models/passenger'
import { title } from "process";
import { SelectSeatComponent } from "../select-seat/select-seat.component";
import { SeatmapResponse } from "~/app/models/seatmap-response"
import { Seatmap } from "~/app/models/seatmap-response";


@Component({
  selector: "ns-set-passenger",
  templateUrl: "./set-passenger.component.html",
  styleUrls: ["./set-passenger.component.scss"],
})

export class SetpassengerComponent implements OnInit, AfterViewInit {
  sexType: Array<string> = ['Nő', 'Férfi', 'Egyéb'];
  formTitle: string;
  wayThere:FlightInfo[];
  seatMap: Seatmap[] = [];
  isOneWay: boolean;
  departureSeatCount: number;
  arrivalSeatCount: number;
  baggageType: Array<string> = ['Kézipoggyász'];
  @ViewChild('selectSeat', { static: false }) selectSeatRef!: ElementRef;

  passengerForm = new FormGroup<Record<string, FormControl>>({
    lastName: new FormControl('', Validators.required),
    firstName: new FormControl('', Validators.required),
    bornDate: new FormControl(null, Validators.required),
    sex: new FormControl('', Validators.required),
    baggageType: new FormControl('', Validators.required)
  });
  ngOnInit(): void {
  }
  constructor(private modalDialogParams: ModalDialogParams, private modalDialogSerivce: ModalDialogService, private viewContainerRef: ViewContainerRef) {
    const [title, passenger, isOneWay, departureSeatCount, arrivalSeatCount, seatMapDatas] = modalDialogParams.context;
    this.formTitle = title;
    this.isOneWay = isOneWay;
    this.departureSeatCount = departureSeatCount;
    this.arrivalSeatCount = arrivalSeatCount;
    this.seatMap = seatMapDatas;
    if (passenger.firstName !== '') {
      this.passengerForm.get('lastName').setValue(passenger.lastName);
      this.passengerForm.get('firstName').setValue(passenger.firstName);
      this.passengerForm.get('bornDate').setValue(passenger.born);
      this.passengerForm.get('sex').setValue(passenger.sex);
      this.passengerForm.get('baggageType').setValue(passenger.baggageType);
    }
  }
  ngAfterViewInit(): void {
    this.seatSelectCreate();
  }

  submit() {
    if (this.passengerForm.invalid) {
      this.passengerForm.markAllAsTouched();
      return;
    }

    const passenger:Passenger = {
      firstName: this.passengerForm.get('firstName').value,
      lastName: this.passengerForm.get('lastName').value,
      born: this.passengerForm.get('bornDate').value,
      sex: this.passengerForm.get('sex').value,
      baggageType: this.passengerForm.get('baggageType').value,
      seatNumberWayThere:[],
    }
    this.modalDialogParams.closeCallback([passenger, 'next']);
  }

  onCancel() {
    this.modalDialogParams.closeCallback([undefined, 'cancel']);
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
  async openSeatPicker(direction: string, dataId: number, controlName: string) {
    if (this.passengerForm.get('lastName').value !== '' && this.passengerForm.get('firstName').value !== '') {
      const lastName = this.passengerForm.get('lastName').value;
      const firstName = this.passengerForm.get('firstName').value;

      const option: ModalDialogOptions = {
        context: {
          lastName,
          firstName,
          seatMap: this.seatMap[dataId],
          direction
        },
        fullscreen: true,
        viewContainerRef: this.viewContainerRef
      };

      await this.modalDialogSerivce.showModal(SelectSeatComponent, option).then((result) => {
        if (result?.action === 'reserve') {
          const element = this.seatMap[dataId].decks[0].seats.find(s => s.number === result.seatNumber);
          element.travelerPricing.forEach(tp => {
            tp.seatAvailabilityStatus = 'underReservation';
          });

          this.passengerForm.get(controlName)?.setValue(result.seatNumber);
        }
      });
    }
  }

  seatSelectCreate() {
    const selectSeat = this.selectSeatRef.nativeElement;

    for (let i = 0; i < this.departureSeatCount; i++) {
      const controlName = `departureSeat_${i}`;
      this.passengerForm.addControl(controlName, new FormControl<string>(''));

      selectSeat.addChild(this.label(`${i + 1}. oda úti ülőhely kiválasztása`, 'form-label'));
      const grid = new GridLayout();
      this.seatGridSet(grid, 'wayThere', 'oda úti ülőhely megadása', i, controlName);
      selectSeat.addChild(grid);
    }
    
    if (this.arrivalSeatCount !== undefined) {
      for (let i = 0; i < this.arrivalSeatCount; i++) {
        const controlName = `arrivalSeat_${i}`;
        this.passengerForm.addControl(controlName, new FormControl<string>(''));

        selectSeat.addChild(this.label(`${i + 1}. vissza úti ülőhely kiválasztása`, 'form-label'));
        const grid = new GridLayout();
        this.seatGridSet(grid, 'wayBack', 'vissza úti ülőhely megadása', this.departureSeatCount - 1 + i, controlName);
        selectSeat.addChild(grid);
      }
    }
  }
  seatGridSet(grid: GridLayout, direction: string, hint: string, dataId: number, controlName: string) {
    this.formatGridColumnsOrRows('col', ['*', 'auto'], grid);
    grid.className = 'set-passenger-component-input-baggage-type-grid';

    const arrowImg = new Image();
    GridLayout.setColumn(arrowImg, 1);
    arrowImg.className = 'set-passenger-icon-baggage-type';
    arrowImg.src = '~/assets/icons/down-arrow.png';
    arrowImg.on('tap', () => {
      this.openSeatPicker(direction, dataId, controlName);
    });
    grid.addChild(arrowImg);

    const textF = new TextField();
    textF.className = 'set-passenger-triptype-textfield';
    textF.editable = false;
    GridLayout.setColumn(textF, 0);
    textF.hint = hint;

    const control = this.passengerForm.get(controlName);
    textF.text = control.value || '';
    control.valueChanges.subscribe(val => {
      textF.text = val || '';
    });

    textF.on('tap', () => {
      this.openSeatPicker(direction, dataId, controlName);
    });

    grid.addChild(textF);
  }

  formatGridColumnsOrRows(
    layoutDirection: ('col' | 'row'),
    sizes: Array<string>,
    grid: GridLayout
  ) {
    const addSpec = layoutDirection === 'col'
      ? (spec: ItemSpec) => grid.addColumn(spec)
      : (spec: ItemSpec) => grid.addRow(spec);

    sizes.forEach(size => {
      let spec: ItemSpec;
      if (size === 'auto') {
        spec = new ItemSpec(1, 'auto');
      } else if (size.includes('*')) {
        spec = new ItemSpec(1, 'star');
      } else {
        spec = new ItemSpec(+size, 'pixel');
      }
      addSpec(spec);
    });
  }
  label(text: string, className = '', col = 0, row = 0): Label {
    const lbl = new Label();
    lbl.text = text;
    if (className) lbl.className = className;
    if (col !== -1 && row !== -1) {
      GridLayout.setColumn(lbl, col);
      GridLayout.setColumnSpan(lbl, 3);
      GridLayout.setRow(lbl, row);
    }
    return lbl;
  }

  isInvalid(controlName: string): boolean {
    const control = this.passengerForm.get(controlName);
    return control && control.invalid && (control.dirty || control.touched);
  }
}
