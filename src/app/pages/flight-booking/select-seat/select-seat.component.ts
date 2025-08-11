import { AfterViewInit, Component, computed, ElementRef, OnInit, signal, ViewChild, ViewContainerRef } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { action, Application, GridLayout, ItemSpec, Label, Image, StackLayout, resetRootView } from "@nativescript/core";
import { ModalDialogOptions, ModalDialogParams, ModalDialogService, RouterExtensions } from "@nativescript/angular";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { enableSwipeBackNavigationProperty } from "@nativescript/core/ui/page/page-common";
import { SeatDetailsModalComponent } from "./seat-details-modal/seat-details-modal.component";
import { Seatmap } from "~/app/models/seatmap-response";

@Component({
  selector: "ns-select-seat",
  templateUrl: "./select-seat.component.html",
  styleUrls: ["./select-seat.component.scss"],
})

export class SelectSeatComponent implements OnInit, AfterViewInit {
  seats: Seatmap;
  lastName:string;
  firstName:string;
  direction:number;
  placeColumnName: string[] = ['A', 'B', 'C', 'D', 'E', 'F'];
  seatsGridLayout = new GridLayout();
  planeGridLayout = new GridLayout();
  @ViewChild('planeContainer', { static: false }) planeContainerRef!: ElementRef;

  constructor(private modalDialogService: ModalDialogService, private modalDialogParams: ModalDialogParams) {
    const context = modalDialogParams.context;
    this.lastName=context.lastName;
    this.firstName=context.firstName;
    this.direction=context.direction==='wayThere' ? 0 : 1;
    this.seats = context.seatMap;
  }
  ngAfterViewInit(): void {
    GridLayout.setColumn(this.seatsGridLayout, 1);
    this.planeGridLayout.addColumn(new ItemSpec(50, 'pixel'));
    this.planeGridLayout.addColumn(new ItemSpec(1, 'star'));
    this.planeGridLayout.addColumn(new ItemSpec(50, 'pixel'));
    for (let i = 0; i <= this.seats.decks[0].deckConfiguration.width; i++) {
      this.seatsGridLayout.addColumn(new ItemSpec(1, 'auto'));
    }
    for (let i = 0; i <= this.seats.decks[0].deckConfiguration.length; i++) {
      this.seatsGridLayout.addRow(new ItemSpec(1, 'auto'));
    }
    this.seatsGridLayout.className = 'select-seat-component-seats-gridlayout';
    /*   this.seatsGridLayout.addChild(this.label(this.placeColumnName[0], 'select-seat-component-place-col-name', 0, 0));
       this.seatsGridLayout.addChild(this.label(this.placeColumnName[1], 'select-seat-component-place-col-name', 1, 0));
       this.seatsGridLayout.addChild(this.label(this.placeColumnName[2], 'select-seat-component-place-col-name', 2, 0));
       this.seatsGridLayout.addChild(this.label('', 'select-seat-component-place-col-name', 3, 0));
       this.seatsGridLayout.addChild(this.label(this.placeColumnName[3], 'select-seat-component-place-col-name', 4, 0));
       this.seatsGridLayout.addChild(this.label(this.placeColumnName[4], 'select-seat-component-place-col-name', 5, 0));
       this.seatsGridLayout.addChild(this.label(this.placeColumnName[5], 'select-seat-component-place-col-name', 6, 0));*/

    for (let i = 0; i < this.seats.decks[0].deckConfiguration.endSeatRow; i++) {
      this.seatsGridLayout.addChild(this.label((i + 1).toString(), 'select-seat-component-none-seat-label', 3, i + 1));

    }
    this.seats.decks[0].seats.forEach(element => {
      if (element.travelerPricing[0].seatAvailabilityStatus === 'AVAILABLE') {
        this.seatsGridLayout.addChild(this.label('', 'select-seat-component-available-seat-label', element.coordinates.y, element.coordinates.x, element.number));
      } else if (element.travelerPricing[0].seatAvailabilityStatus === 'BLOCKED') {
        this.seatsGridLayout.addChild(this.label('', 'select-seat-component-blocked-seat-label', element.coordinates.y, element.coordinates.x, element.number));
   
      } else if (element.travelerPricing[0].seatAvailabilityStatus === 'underReservation') {
        this.seatsGridLayout.addChild(this.label('', 'select-seat-component-underReservation-seat-label', element.coordinates.y, element.coordinates.x, element.number));
      } else {
        this.seatsGridLayout.addChild(this.label('', 'select-seat-component-OCCUPIED-seat-label', element.coordinates.y, element.coordinates.x, element.number));
      }
    });
    if(this.seats.decks[0]?.facilities !==undefined){

    
    this.seats.decks[0].facilities.forEach(element => {
      if (element.code === 'LA') {
        this.seatsGridLayout.addChild(this.image('~/assets/icons/lavatory.png', 'select-seat-component-icons-img', element.coordinates.y, element.coordinates.x));
      } else if (element.code === 'G') {
        this.seatsGridLayout.addChild(this.image('~/assets/icons/chef.png', 'select-seat-component-icons-img', element.coordinates.y, element.coordinates.x));
      } else if (element.code === 'CL' || element.code === 'SO') {
        this.seatsGridLayout.addChild(this.image('~/assets/icons/closet.png', 'select-seat-component-icons-img', element.coordinates.y, element.coordinates.x));
      }
      else {
        this.seatsGridLayout.addChild(this.label(element.column, 'select-seat-component-place-col-name', element.coordinates.y, element.coordinates.x));
      }
    })
  }
    const leftWing = new StackLayout();
    leftWing.className = 'select-seat-component-left-wing';
    GridLayout.setColumn(leftWing, 0);
    this.planeGridLayout.addChild(leftWing);
    this.planeGridLayout.addChild(this.seatsGridLayout);

    const rightWing = new StackLayout();
    rightWing.className = 'select-seat-component-right-wing';
    GridLayout.setColumn(rightWing, 2);
    this.planeGridLayout.addChild(rightWing);

    const planeContainer = this.planeContainerRef.nativeElement;
    planeContainer.addChild(this.planeGridLayout);
  }
  onCancel() { }
  selectSeat(code: string) {
    console.log()
  }
  image(src: string, className: string, col: number, row: number): Image {
    const img = new Image();
    img.src = src;
    img.className = className;
    GridLayout.setColumn(img, col);
    GridLayout.setRow(img, row);

    return img;
  }
  label(text: string, className = '', col = 0, row = 0, seatNumber?: string): Label {
    const lbl = new Label();
    lbl.text = text;
    if (className) lbl.className = className;
    if (col !== -1 && row !== -1) {
      GridLayout.setColumn(lbl, col);
      GridLayout.setRow(lbl, row);
    }
    if (seatNumber !== undefined) {
      lbl.on('tap', () => {
        console.log('meg lett nyomva: ' + seatNumber);
        this.testF(seatNumber, lbl);
      })
    }
    return lbl;
  }

  testF(seatNumber: string, lbl: Label) {
    this.seatsGridLayout.eachChildView((view) => {
      if (view instanceof Label) {
        if (view.className === 'select-seat-component-available-seat-label') {
          view.backgroundColor = 'rgba(0, 115, 255, 0.5)';
        }
        if (view.className === 'select-seat-component-blocked-seat-label') {
          view.backgroundColor = '#B1B2B5';
        }
      }
      return true;
    });
    lbl.backgroundColor = 'rgba(0, 200, 0, 0.7)';
    const elementStatus = this.seats.decks[0].seats.find(element => element.number === seatNumber);
    let total_price = elementStatus.travelerPricing[0]?.price?.total ?? '-1';

    const seatData = {
      cabinType: elementStatus.cabin,
      seatNumber,
      status: elementStatus.travelerPricing[0].seatAvailabilityStatus,
      price: total_price,
    };

    const options: ModalDialogOptions = {
      fullscreen: false,
      context: seatData
    };

    this.modalDialogService.showModal(SeatDetailsModalComponent, options)
      .then((result) => {
        if (result?.action === 'reserve') {
          console.log('Foglalás történt:', result.seat);
          lbl.backgroundColor = 'rgba(0, 17, 144, 0.7)';
          this.modalDialogParams.closeCallback({
            action:'reserve',
            seatNumber:result.seat
          })
        }
      });
  }
  ngOnInit(): void { }

}
