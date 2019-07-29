import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../../api/user.service';
import { IonInfiniteScroll, IonVirtualScroll } from '@ionic/angular';
import { Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AnimationFrameScheduler } from 'rxjs/internal/scheduler/AnimationFrameScheduler';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';

declare var google;

@Component({
  selector: 'app-view-position-friends',
  templateUrl: './view-position-friends.page.html',
  styleUrls: ['./view-position-friends.page.scss'],
})
export class ViewPositionFriendsPage implements OnInit {

  amigo: any[] = [ ];
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonVirtualScroll) virtualScroll: IonVirtualScroll;
  sectorFriendEspecificas: any;
  sectorFriend = { id_user : '' , status_position : 'A' };
  responseData: any;
  aux: any;
  directionsService: any = null;
  directionsDisplay: any = null;
  bounds: any = null;
  map: any;
  lat: any;
  lng: any;
  viewMapa = true;
  myLatLng: any;
  @ViewChild('map') mapElement: ElementRef;
  address: string;

  constructor(
    private authService: UserService,
    private router: Router,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
  ) {
    this.directionsService = new google.maps.DirectionsService();
    this.directionsDisplay = new google.maps.DirectionsRenderer();
    this.bounds = new google.maps.LatLngBounds();

    this.responseData = JSON.parse(localStorage.getItem('userDataLogin'));
    this.sectorFriend.id_user = this.responseData.id;
    console.log(this.sectorFriend.id_user);
    this.authService.postData(JSON.stringify(this.sectorFriend), 'viewpositionfriendmap').then((res) => {
      this.sectorFriendEspecificas = res;
      console.log(this.sectorFriendEspecificas);
      for (let i = 0; i <= this.sectorFriendEspecificas.data.length - 1; i++) {
        this.amigo = this.sectorFriendEspecificas.data;
      }
    }, (err) => {
      console.log(err);
      this.authService.presentToast('El servico fallo.');
    });
  }

  optionsFn(auxFriend) {
    this.aux = auxFriend;
    console.log(this.aux);
    this.lat = +(this.aux.latitud_position);
    this.lng = +(this.aux.longitud_position);
    this.myLatLng = {lat: this.lat, lng: this.lng};
    this.loadMap();
    this.viewMapa = false;
  }


  loadMap() {
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log(this.myLatLng);
      const mapOptions = {
        center: this.myLatLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      this.getAddressFromCoords(this.lat, this.lng);

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      this.map.addListener('tilesloaded', () => {
        console.log('accuracy', this.map);
      });

    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  getAddressFromCoords(lattitude, longitude) {
    console.log('getAddressFromCoords ' + lattitude + ' ' + longitude);
    const options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };

    this.nativeGeocoder.reverseGeocode(lattitude, longitude, options)
      .then((result: NativeGeocoderReverseResult[]) => {
        this.address = '';
        const responseAddress = [];
        for (const [key, value] of Object.entries(result[0])) {
          if ( value.length > 0) {
            responseAddress.push(value);
          }
        }
        responseAddress.reverse();
        for (const value of responseAddress) {
          this.address += value + ', ';
        }
        this.address = this.address.slice(0, -2);
        console.log(this.address);
      })
      .catch((error: any) => {
        this.address = 'Address Not Available!';
      });
  }


  ngOnInit() {
  }

  loadData(event) {
    setTimeout(() => {
      // Hide Infinite List Loader on Complete
      event.target.complete();
      // Rerender Virtual Scroll List After Adding New Data
      this.virtualScroll.checkEnd();
      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.amigo.length <= this.sectorFriendEspecificas.data.length) {
        event.target.disabled = true;
      }
    }, 500);

  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

}
