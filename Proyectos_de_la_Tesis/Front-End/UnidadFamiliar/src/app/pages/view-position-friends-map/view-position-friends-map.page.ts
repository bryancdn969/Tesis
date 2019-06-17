import { Component, OnInit } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { Router } from '@angular/router';

declare var google;

@Component({
  selector: 'app-view-position-friends-map',
  templateUrl: './view-position-friends-map.page.html',
  styleUrls: ['./view-position-friends-map.page.scss'],
})
export class ViewPositionFriendsMapPage implements OnInit {

  map: any;
  address: string;
  responseData: any;
  myLatLng: any;
  directionsService: any = null;
  directionsDisplay: any = null;
  R = 6371; // km
  distanciaInicio: number;
  lat: number;
  lng: number;
  bounds: any = null;

  constructor(
    private geolocation: Geolocation,
    private router: Router,
  ) {
    this.directionsService = new google.maps.DirectionsService();
    this.directionsDisplay = new google.maps.DirectionsRenderer();
    this.bounds = new google.maps.LatLngBounds();
    this.responseData = JSON.parse(localStorage.getItem('friendSelected'));
  }

  ngOnInit() {
    this.getPosition();
    const aux = '';
    localStorage.setItem('friendSelected', JSON.stringify(aux));
  }

  getPosition(): any {
    this.geolocation.getCurrentPosition()
    .then(response => {
      this.loadMap(response);
    })
    .catch(error => {
      console.log(error);
    });
  }

  loadMap(position: Geoposition) {
    console.log(this.responseData);
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    // create a new map by passing HTMLElement
    const mapEle: HTMLElement = document.getElementById('map');
    const panelEle: HTMLElement = document.getElementById('panel');

    // create LatLng object
    this.myLatLng = {lat: latitude, lng: longitude};

    // create map
    this.map = new google.maps.Map(mapEle, {
      center: this.myLatLng,
      zoom: 15,
    });

    this.directionsDisplay.setMap(this.map);
    this.directionsDisplay.setPanel(panelEle);

    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      mapEle.classList.add('show-map');
      // this.calculateRoute();
      const dLatI = this.rad( +(this.responseData.latitud_position) - this.myLatLng.lat);
      const dLonI = this.rad( +(this.responseData.longitud_position) - this.myLatLng.lng);
      const aI = Math.sin(dLatI / 2) * Math.sin(dLatI / 2) +
      Math.cos(this.myLatLng.lat) * Math.cos(+(this.responseData.latitud_position)) *
      Math.sin(dLonI / 2) * Math.sin(dLonI / 2);
      const cI = 2 * Math.atan2(Math.sqrt(aI), Math.sqrt(1 - aI));
      const dI = this.R * cI;
      this.distanciaInicio = dI;
      this.lat = +(this.responseData.latitud_position);
      this.lng = +(this.responseData.longitud_position);

      const point = new google.maps.LatLng(this.lat, this.lng);
      console.log(point);
      this.bounds.extend(point);

      this.map.fitBounds(this.bounds);
      this.directionsService.route({
          origin: new google.maps.LatLng(this.myLatLng.lat, this.myLatLng.lng),
          destination: new google.maps.LatLng(this.lat, this.lng),
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.WALKING,
        avoidTolls: true
      }, (response, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.directionsDisplay.setDirections(response);
        } else {
          alert('Could not display directions due to: ' + status);
        }
      });
    });
  }

  regresar() {
    this.router.navigate([ '/menu/viewPositionFriends' ]);
  }

  rad(x) {
    return x * Math.PI / 180;
  }
}
