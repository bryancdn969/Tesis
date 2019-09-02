import { Component, OnInit } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { Router, ActivatedRoute } from '@angular/router';

declare var google;

@Component({
  selector: 'app-sector-selected',
  templateUrl: './sector-selected.page.html',
  styleUrls: ['./sector-selected.page.scss'],
})
export class SectorSelectedPage implements OnInit {

  map: any;
    directionsService: any = null;
    directionsDisplay: any = null;
    bounds: any = null;
    myLatLng: any;
    responseData: any;
    distanciaInicio: number;
    distanciaFin: number;
    R = 6371; // km
    distancaiTomada: number;
    lat: number;
    lng: number;

  constructor(
    public geolocation: Geolocation,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.directionsService = new google.maps.DirectionsService();
    this.directionsDisplay = new google.maps.DirectionsRenderer();
    this.bounds = new google.maps.LatLngBounds();
    // this.getPosition();
   }

  ngOnInit() {
    this.responseData = JSON.parse(this.activatedRoute.snapshot.params.sectorSelect);
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
      const dLatI = this.rad( +(this.responseData.latitud_zona) - this.myLatLng.lat);
      const dLonI = this.rad( +(this.responseData.longitud_zona) - this.myLatLng.lng);
      const aI = Math.sin(dLatI / 2) * Math.sin(dLatI / 2) +
      Math.cos(this.myLatLng.lat) * Math.cos(+(this.responseData.latitud_zona)) *
      Math.sin(dLonI / 2) * Math.sin(dLonI / 2);
      const cI = 2 * Math.atan2(Math.sqrt(aI), Math.sqrt(1 - aI));
      const dI = this.R * cI;
      this.distanciaInicio = dI;
      this.lat = +(this.responseData.latitud_zona);
      this.lng = +(this.responseData.longitud_zona);

      const point = new google.maps.LatLng(this.lat, this.lng);
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
          alert('No se puede desplegar los pasos a seguir: ' + status);
        }
      });
    });
    this.router.navigate([ '/menu/safeSite']);
  }

  rad(x) {
    return x * Math.PI / 180;
  }

  regresar() {
    this.router.navigate([ '/menu/safeSite/tabsSite/searchSite' ]);
}

}
