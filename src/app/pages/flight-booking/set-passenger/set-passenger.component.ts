import { AfterViewInit, Component, computed, ElementRef, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
import { action, GridLayout, Image, ItemSpec, Label, TextField } from "@nativescript/core";
import { ModalDialogOptions, ModalDialogParams, ModalDialogService, RouterExtensions } from "@nativescript/angular";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { FlightInfo, Passenger } from '~/app/models/passenger'
import { SelectSeatComponent } from "../select-seat/select-seat.component";
import { Seatmap } from "~/app/models/seatmap-response";
import { FlightOffer } from "~/app/models/flight-offers-response";


@Component({
  selector: "ns-set-passenger",
  templateUrl: "./set-passenger.component.html",
  styleUrls: ["./set-passenger.component.scss"],
})

export class SetpassengerComponent implements OnInit, AfterViewInit {
  sexType: Array<string> = ['Nő', 'Férfi', 'Egyéb'];
  formTitle: string;
  wayThere: FlightInfo[];
  seatMap: Seatmap[] = [];
  isOneWay: boolean;
  flightOffer: FlightOffer;
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
    const context = modalDialogParams.context;
    this.formTitle = context.title;
    this.flightOffer = context.flightOffer;
    this.isOneWay = this.flightOffer.itineraries.length < 2;
    this.departureSeatCount = this.flightOffer.itineraries[0].segments.length;
    if (!this.isOneWay) {
      this.arrivalSeatCount = context.flightOffer.itineraries[1].segments.length;
    }
    this.seatMap = context.seatMap;
    const passenger: Passenger = context.passenger;
    if (context.passenger.firstName !== '') {
      this.passengerForm.get('lastName').setValue(passenger.lastName);
      this.passengerForm.get('firstName').setValue(passenger.firstName);
      this.passengerForm.get('bornDate').setValue(passenger.born);
      this.passengerForm.get('sex').setValue(passenger.sex);
      this.passengerForm.get('baggageType').setValue(passenger.baggageType);
      for (let i = 0; i < this.departureSeatCount; i++) {
        const segmentId = this.flightOffer.itineraries[0].segments[i].id;
        this.passengerForm.setControl(segmentId, new FormControl<string>(''));
        this.passengerForm.get(segmentId).setValue(passenger.seatNumberWayThere.find((element) => element.segmentId === segmentId).seatNumber);
      }
      if (this.arrivalSeatCount) {
        for (let i = 0; i < this.arrivalSeatCount; i++) {
          const segmentId = this.flightOffer.itineraries[1].segments[i].id;
          this.passengerForm.setControl(segmentId, new FormControl<string>(''));
          this.passengerForm.get(segmentId).setValue(passenger.seatNumberWayThere.find((element) => element.segmentId === segmentId).seatNumber);
        }
      }
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

    const passenger: Passenger = {
      firstName: this.passengerForm.get('firstName').value,
      lastName: this.passengerForm.get('lastName').value,
      born: this.passengerForm.get('bornDate').value,
      sex: this.passengerForm.get('sex').value,
      baggageType: this.passengerForm.get('baggageType').value,
      seatNumberWayThere: this.feltoltData(0),
      seatNumberWayBack: this.feltoltData(1)
    }
    this.modalDialogParams.closeCallback([passenger, 'next']);
  }
  feltoltData(iteratiesNumber: number): FlightInfo[] {
    let flightSeats: FlightInfo[] = [];
    if (iteratiesNumber === 1 && this.isOneWay) {
      return flightSeats;
    }
    const segmentInfo = this.flightOffer.itineraries[iteratiesNumber].segments;
    for (let i = 0; i < segmentInfo.length; i++) {
      const flight: FlightInfo = {
        seatNumber: this.passengerForm.get(segmentInfo[i].id).value,
        fromPlace: segmentInfo[i].departure.iataCode,
        toPlace: segmentInfo[i].arrival.iataCode,
        segmentId: segmentInfo[i].id
      }
      flightSeats.push(flight);
    }
    return flightSeats;
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
  async openSeatPicker(direction: string, segmentId: string) {
    if (this.passengerForm.get('lastName').value !== '' && this.passengerForm.get('firstName').value !== '') {
      const lastName = this.passengerForm.get('lastName').value;
      const firstName = this.passengerForm.get('firstName').value;
      const seatMap = this.seatMap.find((element) => element.segmentId === segmentId);
      const option: ModalDialogOptions = {
        context: {
          lastName,
          firstName,
          seatMap: seatMap,
          direction
        },
        fullscreen: true,
        viewContainerRef: this.viewContainerRef
      };

      await this.modalDialogSerivce.showModal(SelectSeatComponent, option).then((result) => {
        if (result?.action === 'reserve') {
          const element = this.seatMap.find((element) => element.segmentId === segmentId).decks[0].seats.find(s => s.number === result.seatNumber);
          element.travelerPricing.forEach(tp => {
            tp.seatAvailabilityStatus = 'underReservation';
          });

          this.passengerForm.get(segmentId)?.setValue(result.seatNumber);
        }
      });
    }
  }

  seatSelectCreate() {
    const selectSeat = this.selectSeatRef.nativeElement;

    this.addSeatSelection(
      selectSeat,
      this.departureSeatCount,
      this.flightOffer.itineraries[0].segments,
      'wayThere'
    );

    if (this.arrivalSeatCount !== undefined) {
      this.addSeatSelection(
        selectSeat,
        this.arrivalSeatCount,
        this.flightOffer.itineraries[1].segments,
        'wayBack'
      );
    }
  }
  private addSeatSelection(
    selectSeat: any,
    segmentCount: number,
    segments: any[],
    wayType: 'wayThere' | 'wayBack'
  ) {
    for (let i = 0; i < segmentCount; i++) {
      const segmentInfo = segments[i];
      const segmentId = segmentInfo.id;

      this.passengerForm.addControl(segmentId, new FormControl<string>(''));

      const iataCodes = `${segmentInfo.departure.iataCode} ${segmentInfo.arrival.iataCode}`;
      selectSeat.addChild(this.label(`${iataCodes} úti ülőhely kiválasztása`, 'form-label'));

      const grid = new GridLayout();
      this.seatGridSet(grid, wayType, `${iataCodes} úti ülőhely megadása`, segmentId);
      selectSeat.addChild(grid);
    }
  }
  seatGridSet(grid: GridLayout, direction: string, hint: string, segmentId: string) {
    this.formatGridColumnsOrRows('col', ['*', 'auto'], grid);
    grid.className = 'set-passenger-component-input-baggage-type-grid';

    const arrowImg = new Image();
    GridLayout.setColumn(arrowImg, 1);
    arrowImg.className = 'set-passenger-icon-baggage-type';
    arrowImg.src = '~/assets/icons/down-arrow.png';
    arrowImg.on('tap', () => {
      this.openSeatPicker(direction, segmentId);
    });
    grid.addChild(arrowImg);

    const textF = new TextField();
    textF.className = 'set-passenger-triptype-textfield';
    textF.editable = false;
    GridLayout.setColumn(textF, 0);
    textF.hint = hint;

    const control = this.passengerForm.get(segmentId);
    textF.text = control.value || '';
    control.valueChanges.subscribe(val => {
      textF.text = val || '';
    });

    textF.on('tap', () => {
      this.openSeatPicker(direction, segmentId);
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
