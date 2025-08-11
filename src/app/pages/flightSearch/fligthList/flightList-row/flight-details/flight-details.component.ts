import { AfterViewInit, Component, ElementRef, ViewChild, ViewContainerRef, signal } from '@angular/core';
import { GridLayout, ItemSpec, Label, StackLayout, Image } from '@nativescript/core';
import { Dictionaries, FlightOffersResponse } from '~/app/models/flight-offers-response';
import { ModalDialogOptions, ModalDialogParams, ModalDialogService } from '@nativescript/angular';
import { FlightOffer } from '~/app/models/flight-offers-response';
import { AmadeusService } from '~/app/services/amadeus.service';
import { DatePipe } from '@angular/common';
import { LocationResponseForOneLocation } from '~/app/models/location-response-for-one-location';
import data from '~/assets/iata_data.json';
import { PassengerInfoComponent } from '~/app/pages/flight-booking/passenger-info.component';


@Component({
  providers: [DatePipe],
  selector: 'ns-flight-details',
  templateUrl: './flight-details.component.html',
  styleUrls: ['./flight-details.component.scss'],
})

export class FlightDetailsComponent implements AfterViewInit {
  private segmentDepartureHeaders: GridLayout[] = [];
  private segmentArrivalHeaders: GridLayout[] = [];
  private segmentDepartureDetails: GridLayout[] = [];
  private segmentArrivalDetails: GridLayout[] = [];
  private expandedStates: { [key: string]: boolean } = {};
  locations = signal<LocationResponseForOneLocation[]>([]);
  dictionary: Dictionaries;
  flightOffer: FlightOffer;
  halfPrice: number;
  DepartureMainGrid = new GridLayout();
  ArrivalMainGrid = new GridLayout();
  @ViewChild('departureContainer', { static: false }) departureContainerRef!: ElementRef;
  @ViewChild('arrivalContainer', { static: false }) arrivalContainerRef!: ElementRef;

  constructor(
    private amadeusService: AmadeusService,
    private datePipe: DatePipe,
    private modalDialogService: ModalDialogService,
    private viewContainerRef: ViewContainerRef,
    private modalDialogParams: ModalDialogParams
  ) {
    this.dictionary = modalDialogParams.context.dictionary;
    this.flightOffer = modalDialogParams.context.flight;
    // this.dictionary = amadeusService.getMockFlightOffers().dictionaries;
    // this.flightOffer = amadeusService.getMockFlightOffers().data[0];
    this.halfPrice = Number(this.flightOffer.price.total) / 2;
  }

  ngAfterViewInit() {
    this.setupMainGrid(this.DepartureMainGrid, 0);

    this.addMainFlightInfo(this.DepartureMainGrid, 0);

    this.addOpeningTabButton(this.DepartureMainGrid, 'departure', 0);

    for (let i = 0; i < this.flightOffer.itineraries[0].segments.length; i++) {
      this.addSegmentHeader(this.DepartureMainGrid, 'departure', i, 0);
      this.addSegmentDetails(this.DepartureMainGrid, 'departure', i, 0);
    }
    if (this.flightOffer.itineraries.length === 2) {
      this.setupMainGrid(this.ArrivalMainGrid, 1);
      this.addMainFlightInfo(this.ArrivalMainGrid, 1);
      this.addOpeningTabButton(this.ArrivalMainGrid, 'arrival', 1);
      for (let i = 0; i < this.flightOffer.itineraries[1].segments.length; i++) {
        this.addSegmentHeader(this.ArrivalMainGrid, 'arrival', i, 1);
        this.addSegmentDetails(this.ArrivalMainGrid, 'arrival', i, 1);
      }
    }
    /*
            const connectionTime = new StackLayout();
      GridLayout.setColumn(connectionTime, 0);
      GridLayout.setColumnSpan(connectionTime, 5);
      GridLayout.setRow(connectionTime, 5);
      connectionTime.orientation = 'horizontal';
      connectionTime.horizontalAlignment = 'center';
      connectionTime.className = 'flight-details-component-connection-time';
  
      connectionTime.addChild(this.label('csatlakozási idő a reptéren', 'flight-details-component-travel-info', -1, -1));
      const connectionTimeNumber = this.
      connectionTime.addChild(this.label(, 'flight-details-component-date-info', -1, -1));
              <StackLayout col="0" colSpan="5" row="5" orientation="horizontal" class="travel-date-layout"
              horizontalAlignment="center">
              <Label text="csatlakozási idő a reptéren" class="travel-info"></Label>
              <Label text="2 óra 0 perc" class="date-info"></Label>
          </StackLayout>
      
    */


    const departureContainer = this.departureContainerRef.nativeElement;
    departureContainer.addChild(this.DepartureMainGrid);
    const arrivalContainer = this.arrivalContainerRef.nativeElement;
    arrivalContainer.addChild(this.ArrivalMainGrid);
    this.expandedStates['departure'] = true;
    this.expandedStates['arrival'] = true;
  }

  private setupMainGrid(grid: GridLayout, iteratiesNumber: number): void {
    grid.className = 'flight-details-component-card';
    this.formatGridColumnsOrRows('col', ['*', 'auto', '110', '*', '*'], grid);
    const rowCounts = 3 + 4 * this.flightOffer.itineraries[iteratiesNumber].segments.length;
    for (let i = 0; i < rowCounts; i++) {
      grid.addRow(new ItemSpec(1, 'auto'));
    }
  }

  private addMainFlightInfo(grid: GridLayout, iteratiesNumber: number): void {
    const segmentLength = this.flightOffer.itineraries[iteratiesNumber].segments.length;
    const segment = this.flightOffer.itineraries[iteratiesNumber].segments[0];
    grid.addChild(this.label(this.datePipe.transform(segment.departure.at, 'HH:mm') ?? '', 'flight-details-component-t-date', 1, 0));
    grid.addChild(this.label(this.formatDuration(this.flightOffer.itineraries[0].duration), 'flight-details-component-t-duration', 2, 0));
    grid.addChild(this.label(this.datePipe.transform(segment.arrival.at, 'HH:mm') ?? '', 'flight-details-component-t-date', 3, 0));
    const blackLine = new StackLayout();
    GridLayout.setColumn(blackLine, 2);
    GridLayout.setRow(blackLine, 1);
    blackLine.className = 'flight-details-component-black-line';
    grid.addChild(blackLine);
    grid.addChild(this.label(segment.departure.iataCode, 'flight-details-component-t-iataCode', 1, 2));
    grid.addChild(this.label(this.flightOffer.itineraries[iteratiesNumber].segments.length - 1 + ' átszállás', 'flight-details-component-t-transfer', 2, 2));
    grid.addChild(this.label(this.flightOffer.itineraries[iteratiesNumber].segments[segmentLength - 1].arrival.iataCode, 'flight-details-component-t-iataCode', 3, 2));
  }

  private addOpeningTabButton(grid: GridLayout, flightInfo: string, iteratiesNumber: number): void {
    const openingTabImg = new Image();
    const isExpanded = this.expandedStates[flightInfo] ?? false;
    openingTabImg.src = '~/assets/icons/right-arrow.png';
    openingTabImg.className = isExpanded
      ? 'flight-details-component-btn-details-up'
      : 'flight-details-component-btn-details-down';

    openingTabImg.on('tap', () => {
      const currentlyExpanded = this.expandedStates[flightInfo] ?? false;
      const newExpanded = !currentlyExpanded;
      this.expandedStates[flightInfo] = newExpanded;

      this.switchExpanded(flightInfo);

      openingTabImg.className = newExpanded
        ? 'flight-details-component-btn-details-up'
        : 'flight-details-component-btn-details-down';
    });

    const rowCounts = 3 + 4 * this.flightOffer.itineraries[iteratiesNumber].segments.length;
    GridLayout.setColumn(openingTabImg, 0);
    GridLayout.setColumnSpan(openingTabImg, 5);
    GridLayout.setRow(openingTabImg, rowCounts);

    grid.addChild(openingTabImg);
  }


  private addSegmentHeader(grid: GridLayout, flightInfo: string, i: number, iteratiesNumber: number): void {
    const segment = this.flightOffer.itineraries[iteratiesNumber].segments[i];
    const headerGrid = new GridLayout();
    headerGrid.className = 'flight-details-component-details-header';
    headerGrid.horizontalAlignment = 'center';
    GridLayout.setColumn(headerGrid, 0);
    GridLayout.setColumnSpan(headerGrid, 5);
    GridLayout.setRow(headerGrid, 3 + (i * 3));
    this.formatGridColumnsOrRows('col', ['auto', 'auto'], headerGrid);
    headerGrid.addRow(new ItemSpec(1, 'auto'));
    const stack = new StackLayout();
    stack.className = 'flight-details-component-airlines';
    stack.orientation = 'horizontal';
    GridLayout.setColumn(stack, 0);
    GridLayout.setRow(stack, 0);
    const logo = new Image();
    logo.className = 'flight-details-component-airline-icon';
    logo.src = '~/assets/icons/workplace.png';
    const name = this.dictionary.carriers[segment.operating.carrierCode];
    const label = new Label();
    label.text = name;
    stack.addChild(logo);
    stack.addChild(label);
    headerGrid.addChild(stack);
    headerGrid.addChild(this.label(this.datePipe.transform(segment.departure.at, 'YYYY.MM.dd EEEEEE'), 'flight-details-component-details-date', 1, 0));

    if (flightInfo === 'departure') {
      this.segmentDepartureHeaders.push(headerGrid);
    } else {
      this.segmentArrivalHeaders.push(headerGrid);
    }
    grid.addChild(headerGrid);
  }

  private addSegmentDetails(grid: GridLayout, flightInfo: string, i: number, iteratiesNumber: number) {
    const segment = this.flightOffer.itineraries[iteratiesNumber].segments[i];
    const departureAndArrivalWithTimeGrid = new GridLayout();
    GridLayout.setColumn(departureAndArrivalWithTimeGrid, 0);
    GridLayout.setColumnSpan(departureAndArrivalWithTimeGrid, 5);
    GridLayout.setRow(departureAndArrivalWithTimeGrid, 4 + (i * 3));
    this.formatGridColumnsOrRows('row', ['auto', 'auto', 'auto', 'auto', 'auto'], departureAndArrivalWithTimeGrid);
    this.formatGridColumnsOrRows('col', ['35', '45', 'auto'], departureAndArrivalWithTimeGrid);
    departureAndArrivalWithTimeGrid.className = 'flight-details-component-segment-departure-and-arrival-with-time-grid';

    const line = new StackLayout();
    line.className = 'flight-details-component-left-vertival-line';
    GridLayout.setColumn(line, 0);
    GridLayout.setRow(line, 0);
    GridLayout.setRowSpan(line, 3);
    departureAndArrivalWithTimeGrid.addChild(line);
    departureAndArrivalWithTimeGrid.addChild(this.label(this.datePipe.transform(segment.departure.at, 'HH:mm'), 'flight-details-component-secound.cols', 1, 0));
    departureAndArrivalWithTimeGrid.addChild(this.label(this.getCityName(segment.departure.iataCode), 'flight-details-component-third-col', 2, 0));

    const clock = new Image();
    clock.src = '~/assets/icons/clock.png';
    clock.className = 'flight-details-component-clock-icon';
    GridLayout.setColumn(clock, 1);
    GridLayout.setRow(clock, 1);
    departureAndArrivalWithTimeGrid.addChild(clock);
    departureAndArrivalWithTimeGrid.addChild(this.label(this.formatDuration(segment.duration), 'flight-details-component-third-col', 2, 1));
    departureAndArrivalWithTimeGrid.addChild(this.label(this.datePipe.transform(segment.arrival.at, 'HH:mm'), 'flight-details-component-secound.cols', 1, 2));
    departureAndArrivalWithTimeGrid.addChild(this.label(this.getCityName(segment.arrival.iataCode), 'flight-details-component-third-col', 2, 2));
    if (flightInfo === 'departure') {
      this.segmentDepartureDetails.push(departureAndArrivalWithTimeGrid);
    } else {
      this.segmentArrivalDetails.push(departureAndArrivalWithTimeGrid);
    }
    grid.addChild(departureAndArrivalWithTimeGrid);
  }

  onCancel() {
    this.modalDialogParams.closeCallback(null);
  }

  switchExpanded(flightInfo: string) {
    if (flightInfo === 'departure') {
      this.segmentDepartureHeaders.forEach(header => header.visibility = this.expandedStates[flightInfo] ? 'visible' : 'collapse');
      this.segmentDepartureDetails.forEach(detail => detail.visibility = this.expandedStates[flightInfo] ? 'visible' : 'collapse');
    } else {
      this.segmentArrivalHeaders.forEach(header => header.visibility = this.expandedStates[flightInfo] ? 'visible' : 'collapse');
      this.segmentArrivalDetails.forEach(detail => detail.visibility = this.expandedStates[flightInfo] ? 'visible' : 'collapse');
    }
  }

  getCityName(iataCode: string): string {
    const cityNameFromJson = data[iataCode]?.city;
    if (cityNameFromJson !== null) {
      return cityNameFromJson;
    }
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
      GridLayout.setRow(lbl, row);
    }
    return lbl;
  }

  formatDuration(duration: string): string {
    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?/;
    const match = duration.match(regex);
    if (!match) return duration;
    const hours = match[1] ? `${+match[1]} óra` : '';
    const minutes = match[2] ? `${+match[2]} perc` : '';
    return [hours, minutes].filter(Boolean).join(' ');
  }

  async selectFlight() {
    const options: ModalDialogOptions = {
      context: {
        flight: this.flightOffer,
        dictionary: this.dictionary
      },
      fullscreen: true,
      viewContainerRef: this.viewContainerRef
    };
    const result = await this.modalDialogService
      .showModal(PassengerInfoComponent, options);

    if (result) {

    } else {

    }
  }
}
