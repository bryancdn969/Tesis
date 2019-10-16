import { Component, OnInit,  ViewChild, ElementRef} from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../api/user.service';
import { MenuController } from '@ionic/angular';

declare var google;

@Component({
  selector: 'app-sector-selected',
  templateUrl: './sector-selected.page.html',
  styleUrls: ['./sector-selected.page.scss'],
})
export class SectorSelectedPage implements OnInit {

  @ViewChild('map') mapElement: ElementRef;
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
  latitude: number;
  longitude: number;
  mapEle: HTMLElement;
  panelEleq: HTMLElement;
  point: any;

  constructor(
    public geolocation: Geolocation,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: UserService,
    public menu: MenuController,
  ) {
    this.directionsService = new google.maps.DirectionsService();
    this.directionsDisplay = new google.maps.DirectionsRenderer();
    this.bounds = new google.maps.LatLngBounds();
    this.responseData = JSON.parse(this.activatedRoute.snapshot.params.sectorSelect);
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
    this.latitude = position.coords.latitude;
    this.longitude = position.coords.longitude;
    this.myLatLng = {lat: this.latitude, lng: this.longitude};

    const mapOptions = {
      center: this.myLatLng,
      zoom: 19,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);


    this.mapEle = document.getElementById('map');
    this.panelEleq = document.getElementById('panelq');
    console.log(this.panelEleq);
    this.directionsDisplay.setMap(this.map);
    this.directionsDisplay.setPanel(this.panelEleq);
    console.log(this.directionsDisplay.setPanel(this.panelEleq));
    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      this.mapEle.classList.add('show-map');
    });
    this.calcularRuta();
  }

  private calcularRuta() {
    const dLatI = this.rad( +(this.responseData.latitud_zona) - this.myLatLng.lat);
    const dLonI = this.rad( +(this.responseData.longitud_zona) - this.myLatLng.lng);
    const aI = Math.sin(dLatI / 2) * Math.sin(dLatI / 2) +  Math.cos(this.myLatLng.lat) * Math.cos(+(this.responseData.latitud_zona)) *
    Math.sin(dLonI / 2) * Math.sin(dLonI / 2);
    const cI = 2 * Math.atan2(Math.sqrt(aI), Math.sqrt(1 - aI));
    const dI = this.R * cI;
    this.distanciaInicio = dI;
    this.lat = +(this.responseData.latitud_zona);
    this.lng = +(this.responseData.longitud_zona);
    this.mejorRuta(this.lat, this.lng);
  }

  mejorRuta(lati, long) {
    this.bounds.extend(this.myLatLng);
    this.point = new google.maps.LatLng(lati, long);
    this.bounds.extend(this.point);

    this.map.fitBounds(this.bounds);
    this.directionsService.route({
      origin: new google.maps.LatLng(this.myLatLng.lat, this.myLatLng.lng),
      destination: new google.maps.LatLng(lati, long),
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.WALKING,
      avoidTolls: true
    }, (response, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        // console.log(response);
        this.mostrar(response);
        // this.directionsDisplay.setDirections(response);
      } else {
        this.authService.presentToast('No se puede desplegar los pasos a seguir');
      }
    });
  }

  async mostrar(res) {
    return this.directionsDisplay.setDirections(res);
  }

  rad(x) {
    return x * Math.PI / 180;
  }

  regresar() {
    this.router.navigate([ '/menu/safeSite/tabsSite/searchSite' ]);
  }

}
