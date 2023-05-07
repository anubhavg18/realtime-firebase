import { Component, OnInit, AfterViewInit } from '@angular/core';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import * as L from 'leaflet';

const firebaseConfig = {
  databaseURL: "https://nodemcu-realtime-poc-default-rtdb.firebaseio.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const db = getDatabase(app);


@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements AfterViewInit {

  map: any
  marker: any
  markerIcon: any
  locationData: any

  private initMap(location?: any): void {
    this.map = L.map('map', {
      center: [location.lat, location.lng],
      zoom: 16,
      attributionControl: false
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 17,
    }).addTo(this.map);

    this.markerIcon = L.icon({
      iconUrl: '../../assets/images/car-custom.png',
      shadowUrl: '../../assets/images/marker-shadow.png',
      iconSize: [45, 50], // size of the icon
      shadowSize: [50, 64], // size of the shadow
      iconAnchor: [25, 50], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    // this.marker = L.marker([location.lat, location.lng], { icon: myIcon }).addTo(this.map);
    // var circle = L.circle([location.lat, location.lng], { color: 'blue', fillColor: '#3364FF', fillOpacity: 0.5, radius: 40 }).addTo(this.map);
    // this.marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
  }

  constructor() {
    const starCountRef = ref(db, 'gps');
    onValue(starCountRef, (snapshot) => {
      this.locationData = snapshot.val();
      console.log(this.locationData);

      if (this.locationData.location) {
        if (this.marker) this.map.removeLayer(this.marker)

        this.map.flyTo([this.locationData.location.lat, this.locationData.location.lng], 16)
        //Create marker
        this.marker = L.marker([this.locationData.location.lat, this.locationData.location.lng], { icon: this.markerIcon }).addTo(this.map);
        this.marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
      }

    });
  }
  ngAfterViewInit(): void {
    this.initMap({ lat: 20.5937, lng: 78.9629 });
  }

  ngOnInit() { }
}


