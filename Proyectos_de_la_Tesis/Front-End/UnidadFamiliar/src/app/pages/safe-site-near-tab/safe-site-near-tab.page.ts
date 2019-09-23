import { Component, OnInit,  ViewChild, ElementRef } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { Router } from '@angular/router';
import { UserService } from '../../api/user.service';

declare var google;

@Component({
  selector: 'app-safe-site-near-tab',
  templateUrl: './safe-site-near-tab.page.html',
  styleUrls: ['./safe-site-near-tab.page.scss'],
})
export class SafeSiteNearTabPage implements OnInit {

  @ViewChild('map') mapElement: ElementRef;
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
  latitude: number;
  longitude: number;
  mapEle: HTMLElement;
  panelEle: HTMLElement;
  sectorUser = { sector_zona : 0, status_zona : 'A', sector_persona : 0, estado_persona : 'A'};
  zonaUser: any;
  point: any;

  constructor(
    private geolocation: Geolocation,
    private router: Router,
    private authService: UserService,
  ) {
    this.directionsService = new google.maps.DirectionsService();
    this.directionsDisplay = new google.maps.DirectionsRenderer();
    this.bounds = new google.maps.LatLngBounds();
    this.loadMap();
    // this.responseData = JSON.parse(localStorage.getItem('zonaUser'));
    // this.waypoints = this.responseData;
    for (let i = 3; i >= 1; i--) {
      this.sectorUser.sector_persona = i;
      this.sectorUser.sector_zona = i;
      this.authService.postData(JSON.stringify(this.sectorUser), 'sectorxzona').then((res) => {
      // this.zonaUser = JSON.stringify(res);
      this.zonaUser = res;
      // console.log(this.responseData.data);
      // this.waypoints = this.responseData.data;
      this.responseData = this.zonaUser;
      this.todoSector(this.responseData);
      }, (err) => {
        this.authService.presentToast('Falla del servicio.');
      });
    }
  }

  ngOnInit() {
    // this.loadMap();
  }

  todoSector(data) {
    this.calculateRoute(data);
  }

  loadMap() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      this.myLatLng = {lat: this.latitude, lng: this.longitude};

      const mapOptions = {
        center: this.myLatLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      this.map.addListener('tilesloaded', () => {
        console.log('accuracy', this.map);
      });

    // create a new map by passing HTMLElement
      this.mapEle = document.getElementById('map');
      this.panelEle = document.getElementById('panel');

      this.directionsDisplay.setMap(this.map);
      this.directionsDisplay.setPanel(this.panelEle);

      google.maps.event.addListenerOnce(this.map, 'idle', () => {
        this.mapEle.classList.add('show-map');
      });
      // this.calculateRoute();
    }).catch((error) => {
      this.authService.presentToast('Error al obtener la posición.');
    });
  }

  /*private calculateRoute() {
    console.log(this.waypoints);
    const dLatI = this.rad( +(this.waypoints.data[0].latitud_zona) - this.myLatLng.lat);
    const dLonI = this.rad( +(this.waypoints.data[0].longitud_zona) - this.myLatLng.lng);
    const aI = Math.sin(dLatI / 2) * Math.sin(dLatI / 2) +
    Math.cos(this.myLatLng.lat) * Math.cos(+(this.waypoints.data[0].latitud_zona)) *
    Math.sin(dLonI / 2) * Math.sin(dLonI / 2);
    const cI = 2 * Math.atan2(Math.sqrt(aI), Math.sqrt(1 - aI));
    const dI = this.R * cI;
    this.distanciaInicio = dI;
    console.log(this.distanciaInicio);
    this.lat = +(this.waypoints.data[0].latitud_zona);
    this.lng = +(this.waypoints.data[0].longitud_zona);

    this.mejorSector(this.distanciaInicio);
  }*/
  private calculateRoute(sectores) {
    const dLatI = this.rad( +(sectores.data[0].latitud_zona) - this.myLatLng.lat);
    const dLonI = this.rad( +(sectores.data[0].longitud_zona) - this.myLatLng.lng);
    const aI = Math.sin(dLatI / 2) * Math.sin(dLatI / 2) +
    Math.cos(this.myLatLng.lat) * Math.cos(+(sectores.data[0].latitud_zona)) *
    Math.sin(dLonI / 2) * Math.sin(dLonI / 2);
    const cI = 2 * Math.atan2(Math.sqrt(aI), Math.sqrt(1 - aI));
    const dI = this.R * cI;
    this.distanciaInicio = dI;
    console.log(this.distanciaInicio);
    this.lat = +(sectores.data[0].latitud_zona);
    this.lng = +(sectores.data[0].longitud_zona);

    this.mejorSector(this.distanciaInicio);
  }

  mejorRuta(latitud, longitud) {
    this.bounds.extend(this.myLatLng);
    this.point = new google.maps.LatLng(latitud, longitud);
    this.bounds.extend(this.point);

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

  /*mejorSector(dInicio) {
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
  }*/

  mejorSector(dInicio) {
    this.distancaiTomada = dInicio;
    let i: number;
    for (i = 1; i <= this.responseData.data.length - 1; i++) {
      this.latAux = +(this.responseData.data[i].latitud_zona);
      this.lngAux = +(this.responseData.data[i].longitud_zona);
      const dLatF = this.rad( +(this.responseData.data[i].latitud_zona) - this.myLatLng.lat);
      const dLonF = this.rad( +(this.responseData.data[i].longitud_zona) - this.myLatLng.lng);

      const aF = Math.sin(dLatF / 2) * Math.sin(dLatF / 2) +
      Math.cos(this.myLatLng.lat) * Math.cos(+(this.responseData.data[i].latitud_zona)) *
      Math.sin(dLonF / 2) * Math.sin(dLonF / 2);
      const cF = 2 * Math.atan2(Math.sqrt(aF), Math.sqrt(1 - aF));
      const dF = this.R * cF;
      this.distanciaFin = dF;

      if (this.distanciaFin < this.distancaiTomada) {
        this.distancaiTomada = this.distanciaFin;
        this.lat = +(this.responseData.data[i].latitud_zona);
        this.lng = +(this.responseData.data[i].longitud_zona);
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
