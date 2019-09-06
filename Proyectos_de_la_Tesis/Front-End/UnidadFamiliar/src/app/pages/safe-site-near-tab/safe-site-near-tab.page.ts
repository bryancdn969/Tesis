import { Component, OnInit} from '@angular/core';
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
    waypoints: any;
    responseData: any;
    distanciaInicio: number;
    distanciaFin: number;
    R = 6371; // km
    distancaiTomada: number;
    lat: number;
    lng: number;
    latAux: number;
    lngAux: number;

  constructor(
    public geolocation: Geolocation,
    private router: Router,
  ) {
    this.directionsService = new google.maps.DirectionsService();
    this.directionsDisplay = new google.maps.DirectionsRenderer();
    this.bounds = new google.maps.LatLngBounds();
    this.responseData = JSON.parse(localStorage.getItem('zonaUser'));
    this.waypoints = this.responseData;
    this.getPosition();
  }

  ngOnInit() {
    this.getPosition();
  }

  /* ionViewWillEnter() {
    this.getPosition();
  } */

/*   doRefresh(event) {
    console.log('Begin async operation');
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  } */

  getPosition(): any {
    this.geolocation.getCurrentPosition()
    .then(response => {
      this.loadMap(response);
    })
    .catch(error => {
      alert('Error de servicio de google maps');
    });
  }

  ionViewWillEnter() {
    // this.loadMap();
    this.getPosition();
  }

  loadMap(position: Geoposition) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    // create a new map by passing HTMLElement
    const mapEle: HTMLElement = document.getElementById('map');
    const panelEle: HTMLElement = document.getElementById('panel');

    // create LatLng object
    this.myLatLng = {lat: latitude, lng: longitude};

    const mapOptions = {
      center: this.myLatLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(mapEle, mapOptions);

    this.directionsDisplay.setMap(this.map);
    this.directionsDisplay.setPanel(panelEle);

    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      this.map.addListener('tilesloaded', () => {
        mapEle.classList.add('show-map');
      });
      this.calculateRoute();
    });
  }

  private calculateRoute() {
      const dLatI = this.rad( +(this.waypoints.data[0].latitud_zona) - this.myLatLng.lat);
      const dLonI = this.rad( +(this.waypoints.data[0].longitud_zona) - this.myLatLng.lng);
      const aI = Math.sin(dLatI / 2) * Math.sin(dLatI / 2) +
      Math.cos(this.myLatLng.lat) * Math.cos(+(this.waypoints.data[0].latitud_zona)) *
      Math.sin(dLonI / 2) * Math.sin(dLonI / 2);
      const cI = 2 * Math.atan2(Math.sqrt(aI), Math.sqrt(1 - aI));
      const dI = this.R * cI;
      this.distanciaInicio = dI;
      this.lat = +(this.waypoints.data[0].latitud_zona);
      this.lng = +(this.waypoints.data[0].longitud_zona);

      this.mejorSector(this.distanciaInicio);
  }

  mejorRuta(latitud, longitud) {
    this.bounds.extend(this.myLatLng);
    const point = new google.maps.LatLng(latitud, longitud);
    this.bounds.extend(point);

    this.map.fitBounds(this.bounds);
    this.directionsService.route({
        origin: new google.maps.LatLng(this.myLatLng.lat, this.myLatLng.lng),
        destination: new google.maps.LatLng(latitud, longitud),
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.WALKING,
        avoidTolls: true
      }, (response, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.directionsDisplay.setDirections(response);
        } else {
          alert('No se pueden desplegar los pasos a seguir: ' + status);
        }
      });
  }

  mejorSector(dInicio) {
    this.distancaiTomada = dInicio;
    let i: number;
    for (i = 1; i <= this.responseData.data.length - 1; i++) {
      this.latAux = +(this.waypoints.data[i].latitud_zona);
      this.lngAux = +(this.waypoints.data[i].longitud_zona);
      const dLatF = this.rad( +(this.waypoints.data[i].latitud_zona) - this.myLatLng.lat);
      const dLonF = this.rad( +(this.waypoints.data[i].longitud_zona) - this.myLatLng.lng);

      const aF = Math.sin(dLatF / 2) * Math.sin(dLatF / 2) +
      Math.cos(this.myLatLng.lat) * Math.cos(+(this.waypoints.data[i].latitud_zona)) *
      Math.sin(dLonF / 2) * Math.sin(dLonF / 2);
      const cF = 2 * Math.atan2(Math.sqrt(aF), Math.sqrt(1 - aF));
      const dF = this.R * cF;
      this.distanciaFin = dF;

      if (this.distanciaFin < this.distancaiTomada) {
        this.distancaiTomada = this.distanciaFin;
        this.lat = +(this.waypoints.data[i].latitud_zona);
        this.lng = +(this.waypoints.data[i].longitud_zona);
        this.mejorRuta(this.lat, this.lng);
      }
    }
  }

  rad(x) {
    return x * Math.PI / 180;
  }

  regresar() {
    this.router.navigate([ '/menu/shareLocation' ]);
  }
}
