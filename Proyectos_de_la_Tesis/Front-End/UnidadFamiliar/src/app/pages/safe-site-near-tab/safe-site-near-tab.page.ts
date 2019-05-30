import { Component, OnInit } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { Router } from '@angular/router';

declare var google;

@Component({
  selector: 'app-safe-site-near-tab',
  templateUrl: './safe-site-near-tab.page.html',
  styleUrls: ['./safe-site-near-tab.page.scss'],
})
export class SafeSiteNearTabPage implements OnInit {

    map: any;
    directionsService: any = null;
    directionsDisplay: any = null;
    bounds: any = null;
    myLatLng: any;
    waypoints: any[];

  constructor(
    public geolocation: Geolocation,
    private router: Router,
  ) {
    this.directionsService = new google.maps.DirectionsService();
    this.directionsDisplay = new google.maps.DirectionsRenderer();
    this.bounds = new google.maps.LatLngBounds();
    this.waypoints = [
      /*{ location: { lat: -0.287557, lng: -78.547576 }, stopover: true, },
       { location: { lat: -0.245671, lng: -78.530838 }, stopover: true, },
      { location: { lat: -0.258335, lng: -78.518117 }, stopover: true, },*/
      { location: { lat: -0.247890, lng: -78.515729 }, stopover: true, }
    ];
  }

  ngOnInit() {
    this.getPosition();
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
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log(latitude, longitude);
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
      this.calculateRoute();
    });
  }

  private calculateRoute() {
    this.bounds.extend(this.myLatLng);
    this.waypoints.forEach(waypoint => {
      const point = new google.maps.LatLng(waypoint.location.lat, waypoint.location.lng);
      this.bounds.extend(point);
    });

    this.map.fitBounds(this.bounds);
    console.log(this.waypoints[0].location.lat, this.waypoints[0].location.lng);
    this.directionsService.route({
      origin: new google.maps.LatLng(this.myLatLng.lat, this.myLatLng.lng),
      destination: new google.maps.LatLng(this.waypoints[0].location.lat, this.waypoints[0].location.lng),
      // destination: new google.maps.LatLng(this.myLatLng.lat, this.myLatLng.lng),
      // waypoints: this.waypoints,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.WALKING,
      avoidTolls: true
    }, (response, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        console.log(response);
        this.directionsDisplay.setDirections(response);
      } else {
        alert('Could not display directions due to: ' + status);
      }
    });
    this.calcularDistancia();
  }

  calcularDistancia() {
    const R = 6371; // km
    const dLat = this.rad( this.waypoints[0].location.lat - this.myLatLng.lat);
    const dLon = this.rad( this.waypoints[0].location.lng - this.myLatLng.lng);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.myLatLng.lat) * Math.cos(this.waypoints[0].location.lat) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    console.log(d.toFixed(3));
  }

  rad(x) {
    return x * Math.PI / 180;
  }

  regresar() {
      this.router.navigate([ '/menu/shareLocation' ]);
    }
}