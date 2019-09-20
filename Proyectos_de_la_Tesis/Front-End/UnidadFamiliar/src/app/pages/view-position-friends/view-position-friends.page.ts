import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../../api/user.service';
import { IonInfiniteScroll, IonVirtualScroll } from '@ionic/angular';
import { Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
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
  idFriend = { id_user : '' , status_friend : 'A' };
  validationIdFriend = { id_user : '' , email_friend : '', status_friend : 'A' };
  sectorFriend = { id_friend : '' , status_position : 'A' };
  emailFriend = { email : '' , status : 'Active' };
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
  friendEmail: any;
  idComprobationData: any;
  idComprobation: any;
  validationIdData: any;
  traerCoordsId: any;
  existCoordsData: any;

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
    this.idFriend.id_user = this.responseData.id;
    this.validationIdFriend.email_friend = this.responseData.email;
    this.traerEmail();
  }

  traerEmail() {
    this.authService.postData(JSON.stringify(this.idFriend), 'selectidfriend').then((res) => {
      this.sectorFriendEspecificas = res;
      if (this.sectorFriendEspecificas.api_status === 1 && this.sectorFriendEspecificas.data.length > 0) {
        for (let i = 0; i <= this.sectorFriendEspecificas.data.length - 1; i++) {
          this.friendEmail = this.sectorFriendEspecificas.data[i].email_friend;
          this.comprobarEmail(this.friendEmail);
        }
      } else {
        this.authService.presentToast('No existe información compartida.');
      }
    }, (err) => {
      this.authService.presentToast('El servico fallo.');
    });
  }

  comprobarEmail(email) {
    this.emailFriend.email = email;
    this.authService.postData(JSON.stringify(this.emailFriend), 'testuser').then((res) => {
      this.idComprobationData = res;

      if (this.idComprobationData.api_status === 1 && this.idComprobationData.data.length > 0) {
        this.idComprobation = this.idComprobationData.data[0].id;
        this.traerIdForValidation(this.idComprobation);
      }
    }, (err) => {
      this.authService.presentToast('El servico fallo.');
    });
  }

  traerIdForValidation(id) {
    this.validationIdFriend.id_user = id;
    this.authService.postData(JSON.stringify(this.validationIdFriend), 'validationidfriend').then((res) => {
      this.validationIdData = res;
      if (this.validationIdData.api_status === 1 && this.validationIdData.data.length > 0) {
        for (let i = 0; i <= this.validationIdData.data.length - 1; i++) {
          this.traerCoordsId = this.validationIdData.data[i].id;
          this.traerCoordsFriend(this.traerCoordsId);
        }
      }
    }, (err) => {
      this.authService.presentToast('El servico fallo.');
    });
  }

  traerCoordsFriend(id) {
    this.sectorFriend.id_friend = id;
    this.authService.postData(JSON.stringify(this.sectorFriend), 'viewpositionfriendmap').then((res) => {
      this.existCoordsData = res;
      if (this.existCoordsData.api_status === 1 && this.existCoordsData.data.length > 0) {
        for (let i = 0; i <= this.existCoordsData.data.length - 1; i++) {
          this.amigo = this.existCoordsData.data;
        }
      }
    }, (err) => {
      this.authService.presentToast('El servico fallo.');
    });
  }

  optionsFn(auxFriend) {
    this.aux = auxFriend;
    this.lat = +(this.aux.latitud_position);
    this.lng = +(this.aux.longitud_position);
    this.myLatLng = {lat: this.lat, lng: this.lng};
    this.loadMap();
    this.viewMapa = false;
  }


  loadMap() {
    this.geolocation.getCurrentPosition().then((resp) => {
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
      this.authService.presentToast('Error al obtener la posición.');
    });
  }

  getAddressFromCoords(lattitude, longitude) {
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
