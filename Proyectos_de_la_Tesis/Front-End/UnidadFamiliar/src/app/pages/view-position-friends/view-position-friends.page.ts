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
  idUser = { id_user : '' , status_position : 'A' };
  amigosAgregados = { telefono_user : '' , status_friend : 'A' };
  traeridsamigos = { email : '' , status : 'Active' };
  prueba11 = {id_user : '', cms_users_id : 0, status_position : 'A', app_friend_telefono_user : ''};
  amigos1: any[] = [ ];
  idAmigosResult: any[] = [ ];
  coordsAmigosResult: any[] = [ ];
  infoAmigos: any;
  infoAmigosid: any;
  idsAmigos: any[] = [ ];
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
    this.amigosAgregados.telefono_user = this.responseData.telefono;
    this.prueba11.app_friend_telefono_user = this.amigosAgregados.telefono_user;
    this.traerAmigos();
    this.idFriend.id_user = this.responseData.id;
    this.idUser.id_user = this.responseData.id;
    this.validationIdFriend.email_friend = this.responseData.email;
   // this.traerEmail();
   // this.traerCoordsFriend();
  }

  traerAmigos() {
    this.authService.postData(JSON.stringify(this.amigosAgregados), 'retornaramigosagregados').then((res) => {
      this.infoAmigos = res;
      if (this.infoAmigos.api_status === 1 && this.infoAmigos.data.length > 0) {
      //  for (let i = 0; i <= this.infoAmigos.data.length - 1; i++) {
          this.amigos1 = this.infoAmigos.data;
          console.log(this.amigos1);
      //  }
          this.traeridporcorreo(this.amigos1);
      }
    }, (err) => {
      this.authService.presentToast('El servico fallo.');
    });
  }


  traeridporcorreo(idsAmigos) {
    for (let i = 0; i <= idsAmigos.length - 1; i++) {
      this.traeridsamigos.email = idsAmigos[i].email_friend;
      this.authService.postData(JSON.stringify(this.traeridsamigos), 'traeridsamigos').then((res) => {
        this.infoAmigosid = res;
        if (this.infoAmigosid.api_status === 1 && this.infoAmigosid.data.length > 0) {
        //  for (let i = 0; i <= this.infoAmigos.data.length - 1; i++) {
            this.idAmigosResult = this.infoAmigosid.data;
            this.idsAmigos = this.idsAmigos.concat(this.idAmigosResult);
            if (this.idsAmigos.length === idsAmigos.length) {
              console.log(this.idsAmigos);
              this.traercoordenadas(this.idsAmigos);
            }
        //  }
        }
      }, (err) => {
        this.authService.presentToast('El servico fallo.');
      });
    }
  }

  traercoordenadas(aux1) {
    let aux: any[] = [ ];
    for (let i = 0; i <= aux1.length - 1; i++) {
      this.prueba11.id_user = aux1[i].id;
      this.prueba11.cms_users_id = aux1[i].id;
      this.authService.postData(JSON.stringify(this.prueba11), 'prueba1').then((res) => {
        this.existCoordsData = res;
        if (this.existCoordsData.api_status === 1 && this.existCoordsData.data.length > 0) {
        //  for (let j = 0; j <= this.existCoordsData.data.length - 1; j++) {
            this.coordsAmigosResult = this.existCoordsData.data;
            if (this.coordsAmigosResult.length > 1) {
              aux = aux.concat(this.coordsAmigosResult[0]);
              console.log(aux);
              this.amigo = aux;
            }
            aux = aux.concat(this.coordsAmigosResult);
            if (aux.length === aux1.length) {
              console.log(aux);
              this.amigo = aux;
            }
        //  }
        }
      }, (err) => {
        this.authService.presentToast('El servico fallo.');
      });
    }
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
        zoom: 18,
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
      if (this.amigo.length <= this.infoAmigosid.data.length) {
        event.target.disabled = true;
      }
    }, 500);

  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

}
