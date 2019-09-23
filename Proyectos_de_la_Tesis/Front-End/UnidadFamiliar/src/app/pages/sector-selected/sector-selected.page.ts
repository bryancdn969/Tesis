import { Component, OnInit,  ViewChild, ElementRef, NgZone  } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../api/user.service';
import { Events } from '@ionic/angular';

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
  panelEle: HTMLElement;
  waypoints: any;
  point: any;

  constructor(
    public geolocation: Geolocation,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: UserService,
    public events: Events,
    private zone: NgZone
  ) {
    /*this.zone.run(() => {
      console.log('force update the screen');
      this.loadMap();
    });*/
    this.directionsService = new google.maps.DirectionsService();
    this.directionsDisplay = new google.maps.DirectionsRenderer();
    this.bounds = new google.maps.LatLngBounds();
    this.loadMap();
    this.responseData = JSON.parse(this.activatedRoute.snapshot.params.sectorSelect);
    this.waypoints = this.responseData;
  }

  ngOnInit() {
    // this.loadMap();
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

    this.mapEle = document.getElementById('map');
    this.panelEle = document.getElementById('panel');

    this.directionsDisplay.setMap(this.map);
    this.directionsDisplay.setPanel(this.panelEle);

    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      this.mapEle.classList.add('show-map');
    });
    this.calcularRuta();
    }).catch((error) => {
      this.authService.presentToast('Error al obtener la posición.');
    });
  }

  private calcularRuta() {
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

    this.mejorRuta(this.lat, this.lng);
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
          alert('No se puede desplegar los pasos a seguir: ' + status);
        }
      });
  }

  rad(x) {
    return x * Math.PI / 180;
  }

  regresar() {
    this.router.navigate([ '/menu/safeSite/tabsSite/searchSite' ]);
  }

  ionViewDidLoad() {
    this.loadMap();
  }

}
