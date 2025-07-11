import { Component, OnInit } from '@angular/core'
import { RadSideDrawer } from 'nativescript-ui-sidedrawer'
import { Application,ObservableArray } from '@nativescript/core'
import { FirebaseAuth } from '@nativescript/firebase-auth';
import { firebase } from "@nativescript/firebase-core";

interface BasicFlightInformation {
  data_itineraries_segments_departure_at: string
  data_itineraries_segments_arrival_at: string
  data_itineraries_segments_departure_iataCode:string
  data_itineraries_segments_arrival_iataCode:string
  data_itineraries_price_total:string
  data_itineraries_duration:string
  data_id:string
 }

@Component({
  selector: 'ns-basket',
  templateUrl: './basket.component.html',
  styleUrls: ["./basket.component.scss"],
})
export class BasketComponent implements OnInit {
  user=firebase().auth().currentUser;
  auth = firebase().auth();
  basicFlightInformations:ObservableArray<BasicFlightInformation>;
  constructor() {
  }
  getFlightsFromDatabase():void{
    this.basicFlightInformations= new ObservableArray<BasicFlightInformation>();
    if (this.user != null) {
      firebase()
      .firestore()
      .collection("userBasket")
      .doc(this.user.uid)
      .collection("flights")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const data=doc.data()
          this.basicFlightInformations.push({
            data_itineraries_segments_departure_at: data.departureAt,
            data_itineraries_segments_arrival_at: data.arrivalAt,
            data_itineraries_segments_departure_iataCode: data.departureIata,
            data_itineraries_segments_arrival_iataCode:data.arrivalIata,
            data_itineraries_price_total:data.totalPrice,
            data_itineraries_duration:data.duration,
            data_id:data.id,
          });
        });
    for(let i=0;i< this.basicFlightInformations.length;i++){
      console.log(this.basicFlightInformations.getItem(i));
    }
  })
  .catch((error) => {
    console.error("Error fetching flights:", error);
  });
    }
  }

  ngOnInit(): void {
    this.getFlightsFromDatabase();
    }
  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView()
    sideDrawer.showDrawer()
  }
  Delete(id:string):void{
    console.log(id);
    let index="0";
    for(let i=0;i<this.basicFlightInformations.length;i++){
      if(this.basicFlightInformations.getItem(i).data_id==id){
        index=i+"";
      }
    }
    firebase()
    .firestore()
    .collection("userBasket")
    .doc(this.user.uid)
    .collection("flights")
    .doc(this.basicFlightInformations.getItem(parseInt(index)).data_id+'_'+this.basicFlightInformations.getItem(parseInt(index)).data_itineraries_duration)
    .delete()
    .then(() => {
      console.log("Document has been successfully deleted.");
      this.getFlightsFromDatabase();
    })
    .catch((error) => {
      console.error("An error occurred during deletion: ", error);
    });  
  }
}
