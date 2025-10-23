import {
    AfterViewInit,
    Component,
    ElementRef,
    OnInit,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import {
    action,
    GridLayout,
    Image,
    ItemSpec,
    Label,
    TextField,
} from '@nativescript/core';
import {
    ModalDialogOptions,
    ModalDialogParams,
    ModalDialogService,
} from '@nativescript/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FlightInfo, Passenger } from '~/app/models/passenger';
import { SelectSeatComponent } from '../select-seat/select-seat.component';
import { Seatmap } from '~/app/models/seatmap-response';
import { FlightOffer, Segment } from '~/app/models/flight-offers-response';
import { localize } from '@nativescript/localize';

@Component({
    selector: 'ns-set-passenger',
    templateUrl: './set-passenger.component.html',
    styleUrls: ['./set-passenger.component.scss'],
})
export class SetpassengerComponent implements OnInit, AfterViewInit {
    segmentIndexArray: string[] = [];
    sexTypeDict: Record<string, string> = {
        woman: localize('register.woman'),
        man: localize('register.man'),
        other: localize('register.other'),
    };
    baggageTypeDict: Record<string, string> = {
        handbag: localize('setPassenger.handBag'),
    };
    formTitle: string;
    wayThere: FlightInfo[];
    seatMap: Seatmap[] = [];
    isOneWay: boolean;
    passengerId: string;
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
        baggageType: new FormControl('', Validators.required),
    });
    ngOnInit(): void { }
    constructor(
        private modalDialogParams: ModalDialogParams,
        private modalDialogSerivce: ModalDialogService,
        private viewContainerRef: ViewContainerRef
    ) {
        const context = modalDialogParams.context;
        this.formTitle = context.title;
        this.passengerId = context.id;
        this.flightOffer = context.flightOffer;
        this.isOneWay = this.flightOffer.itineraries.length < 2;
        this.departureSeatCount =
            this.flightOffer.itineraries[0].segments.length;
        if (!this.isOneWay) {
            this.arrivalSeatCount =
                context.flightOffer.itineraries[1].segments.length;
        }
        this.seatMap = context.seatMap;
        const passenger: Passenger = context.passenger;
        this.flightOffer.itineraries[0].segments.forEach((s) =>
            this.segmentIndexArray.push(s.id)
        );
        if (this.arrivalSeatCount) {
            this.flightOffer.itineraries[1].segments.forEach((s) =>
                this.segmentIndexArray.push(s.id)
            );
        }
        if (passenger.firstName === '') return;
        this.passengerForm.get('lastName').setValue(passenger.lastName);
        this.passengerForm.get('firstName').setValue(passenger.firstName);
        this.passengerForm.get('bornDate').setValue(passenger.born);
        this.passengerForm.get('sex').setValue(passenger.sex);
        this.passengerForm.get('baggageType').setValue(passenger.baggageType);
        this.flightOffer.itineraries[0].segments.forEach((s) => {
            this.passengerForm.setControl(s.id, new FormControl<string>(''));
            this.passengerForm
                .get(s.id)
                .setValue(
                    passenger.seats.find(
                        (element) => element.segmentId === s.id
                    ).seatNumber
                );
        });
        if (!this.arrivalSeatCount) return;
        this.flightOffer.itineraries[1].segments.forEach((s) => {
            this.passengerForm.setControl(s.id, new FormControl<string>(''));
            this.passengerForm
                .get(s.id)
                .setValue(
                    passenger.seats.find(
                        (element) => element.segmentId === s.id
                    ).seatNumber
                );
        });
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
            seats: this.uploadSeats(),
            id: this.passengerId,
        };
        this.modalDialogParams.closeCallback([passenger, 'next']);
    }

    uploadSeats(): FlightInfo[] {
        let flightSeats: FlightInfo[] = [];
        this.flightOffer.itineraries.forEach((element) => {
            element.segments.forEach((segment) => {
                const flight: FlightInfo = {
                    seatNumber: this.passengerForm.get(segment.id).value,
                    segmentId: segment.id,
                };
                flightSeats.push(flight);
            });
        });
        return flightSeats;
    }

    onCancel() {
        this.modalDialogParams.closeCallback([undefined, 'cancel']);
    }

    openSexPicker() {
        action({
            message: localize('register.chooseYourSex'),
            cancelButtonText: localize('general.cancel'),
            actions: Object.values(this.sexTypeDict),
        }).then((result) => {
            if (result !== localize('general.cancel')) {
                const sex = (
                    Object.keys(this.sexTypeDict) as Array<string>
                ).find((key) => this.sexTypeDict[key] === result);
                this.passengerForm.get('sex').setValue(sex);
            }
        });
    }
    openBaggagePicker() {
        action({
            message: localize('setPassenger.selectYourHandBag'),
            cancelButtonText: localize('general.cancel'),
            actions: Object.values(this.baggageTypeDict),
        }).then((result) => {
            if (result !== localize('general.cancel')) {
                const baggage = (
                    Object.keys(this.baggageTypeDict) as Array<string>
                ).find((key) => this.baggageTypeDict[key] === result);
                this.passengerForm.get('baggageType').setValue(baggage);
            }
        });
    }
    async openSeatPicker(direction: string, segmentId: string) {
        console.log('Meg lett nyomva a openSeatPicker');
        if (
            this.passengerForm.get('lastName').value !== '' &&
            this.passengerForm.get('firstName').value !== ''
        ) {
            const lastName = this.passengerForm.get('lastName').value;
            const firstName = this.passengerForm.get('firstName').value;
            console.log(
                'flightoffer tényleges segmentIdja 0. helyen: ' +
                this.flightOffer.itineraries[0].segments[0].id
            );
            console.log(
                'segmentId amit keresünk a seatMap tömben: ' + segmentId
            );
            console.log(
                'seatmap tényleges segment idai: ' +
                this.seatMap[0].segmentId +
                ' másik? ' +
                (this.seatMap[1]?.segmentId ?? 'null')
            );
            console.log(
                'segmentIndexArray hossza: ' + this.segmentIndexArray.length
            );

            const seatMap =
                this.seatMap[this.segmentIndexArray.indexOf(segmentId)];
            if (!seatMap) {
                console.log(
                    'a seatMap üres, ezért nem megy a select seat komponensre'
                );
                return;
            }
            const option: ModalDialogOptions = {
                context: {
                    lastName,
                    firstName,
                    seatMap: seatMap,
                    direction,
                },
                fullscreen: true,
                viewContainerRef: this.viewContainerRef,
            };

            await this.modalDialogSerivce
                .showModal(SelectSeatComponent, option)
                .then((result) => {
                    if (result?.action === 'reserve') {
                        const findCurrentFlightIndexOfSegmentId =
                            this.segmentIndexArray.indexOf(segmentId) + 1;
                        const element = this.seatMap[
                            this.segmentIndexArray.indexOf(segmentId)
                        ].decks[0].seats.find(
                            (s) => s.number === result.seatNumber
                        );
                        element.travelerPricing.forEach((tp) => {
                            tp.seatAvailabilityStatus = 'underReservation';
                        });

                        this.passengerForm
                            .get(segmentId)
                            ?.setValue(result.seatNumber);
                    }
                })
                .catch((err) => {
                    console.log(
                        'SelectSeatMap show modal erroral tért vissza: ' + err
                    );
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
        segments: Segment[],
        wayType: 'wayThere' | 'wayBack'
    ) {
        for (let i = 0; i < segmentCount; i++) {
            const segmentInfo = segments[i];
            const segmentId = segmentInfo.id;

            this.passengerForm.addControl(
                segmentId,
                new FormControl<string>('')
            );

            const iataCodes = `${segmentInfo.departure.iataCode} ${segmentInfo.arrival.iataCode}`;
            selectSeat.addChild(
                this.label(
                    `${iataCodes} úti ülőhely kiválasztása`,
                    'form-label'
                )
            );

            const grid = new GridLayout();
            this.seatGridSet(
                grid,
                wayType,
                `${iataCodes} úti ülőhely megadása`,
                segmentId
            );
            selectSeat.addChild(grid);
        }
    }
    seatGridSet(
        grid: GridLayout,
        direction: string,
        hint: string,
        segmentId: string
    ) {
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
        control.valueChanges.subscribe((val) => {
            textF.text = val || '';
        });

        textF.on('tap', () => {
            this.openSeatPicker(direction, segmentId);
        });

        grid.addChild(textF);
    }

    formatGridColumnsOrRows(
        layoutDirection: 'col' | 'row',
        sizes: Array<string>,
        grid: GridLayout
    ) {
        const addSpec =
            layoutDirection === 'col'
                ? (spec: ItemSpec) => grid.addColumn(spec)
                : (spec: ItemSpec) => grid.addRow(spec);

        sizes.forEach((size) => {
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
