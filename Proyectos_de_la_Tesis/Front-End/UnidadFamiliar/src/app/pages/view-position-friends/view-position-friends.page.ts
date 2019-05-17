import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../../api/user.service';
import { ToastController } from '@ionic/angular';
import { createOfflineCompileUrlResolver } from '@angular/compiler';
import { Geolocation } from '@ionic-native/geolocation/ngx';

declare var google;

@Component({
  selector: 'app-view-position-friends',
  templateUrl: './view-position-friends.page.html',
  styleUrls: ['./view-position-friends.page.scss'],
})
export class ViewPositionFriendsPage implements OnInit {

  museumData = [];
  filteredMuseum = [];
  isfiltered: boolean;

  public items: Array<any>;
  responseData: any;
  responseDataAux: any;
  responseDataViewFreindCoords: any;
  responseDataExito: any;
  telefonoCoords: any;

  map: any;
  coords: any = { lat: 0, lng: 0 };
  @ViewChild('map') mapContainer: ElementRef;

  responseDataViewFreindPosition = {id_user : '',   status_position : 'A', id_user_v : '', telefono_friend_v : ''};
  responseDataTelefonoCoords = {telefono : ''};
  userData = {id_user: '', status_friend: 'A'};

  constructor(
    private authService: UserService,
    private toastController: ToastController,
   // private googleMaps: GoogleMaps,
    private geolocation: Geolocation,
  ) {
    this.responseData = JSON.parse(localStorage.getItem('userDataLogin'));
    // console.log(this.responseData);
    this.userData.id_user = this.responseData.id;
    this.authService.postData(JSON.stringify(this.userData), 'auxgetcoords').then((res) => {
    this.responseDataAux = res;
    if (this.responseDataAux.api_status ===  1 && this.responseDataAux.api_http === 200) {
      this.responseDataViewFreindPosition.id_user = this.userData.id_user;
      this.responseDataViewFreindPosition.id_user_v = this.userData.id_user;
      this.responseDataViewFreindPosition.telefono_friend_v = this.responseDataAux.telefono_friend;

      this.authService.postData(JSON.stringify(this.responseDataViewFreindPosition), 'viewpositionfriend').then((result) =>  {
        this.responseDataViewFreindCoords = result;
        // console.log( this.responseDataViewFreindCoords);
        if (this.responseDataViewFreindCoords.api_status === 1 && this.responseDataViewFreindCoords.api_http === 200 &&
          this.responseDataViewFreindCoords.data.length > 0) {
          for (let i = 0; i <= this.responseDataViewFreindCoords.data.length - 1; i++) {
            this.telefonoCoords = this.responseDataViewFreindCoords.data[i].telefono_friend;
            this.responseDataTelefonoCoords.telefono = this.telefonoCoords;
            // console.log(this.responseDataTelefonoCoords);
            this.authService.postData(JSON.stringify(this.responseDataTelefonoCoords), 'telefonocoords').then((resu) =>  {
              this.responseDataExito = resu;
              // console.log(this.responseDataExito) ;
              if (this.responseDataExito.api_status === 0 && this.responseDataExito.api_http === 200) {
                this.presentToast('Check your messages!.');
              } else if (this.responseDataExito.api_status === 1 && this.responseDataExito.api_http === 200) {
                // console.log(this.responseDataViewFreindCoords);
                this.coords.lat = this.responseDataViewFreindCoords.data[i].latitud_position;
                this.coords.lng = this.responseDataViewFreindCoords.data[i].longitud_position;

                this.museumData = this.responseDataViewFreindCoords.data;
                // console.log(this.coords);
                this.displayGoogleMap(this.responseDataViewFreindCoords.data);
                this.getMarkers(this.responseDataViewFreindCoords.data);
                // console.log(this.coords);
                this.items = [
                  { title: this.responseDataViewFreindCoords.data[i].nombre_friend,
                    description: this.responseDataViewFreindCoords.data[i].direccion_position }
                ];
              }
            });
          }
        }
      });
    } else {
      this.presentToast('All quiet!.');
    }
    });
  }

  async presentToast( message: string ) {
    const toast = await this.toastController.create({
        message,
        duration: 2000
    });
    toast.present();
  }

  ngOnInit() {
    // this.museumData = this.museumSerivice.getMuseums();
  }

  displayGoogleMap(dataCoords) {
    // console.log(dataCoords);
    for (let j = 0; j < dataCoords.length; j++) {
      const latLng = new google.maps.LatLng(dataCoords[j].latitud_position, dataCoords[j].longitud_position);

      const mapOptions = {
        center: latLng,
        disableDefaultUI: true,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      this.map = new google.maps.Map(this.mapContainer.nativeElement, mapOptions);
    }
  }

  getMarkers(cantidad) {
    console.log(cantidad);
    for (let i = 0; i < cantidad.length; i++) {
      if (i >= 0) {
        this.addMarkersToMap(cantidad[i]);
      }
    }
  }

  /*addMarkersToMap(museum) {
    const position = new google.maps.LatLng(museum.latitud_position, museum.longitud_position);
    const museumMarker = new google.maps.Marker({ position, title: museum.name_user });
    museumMarker.setMap(this.map);
  }*/

  addMarkersToMap(museum) {
    const position = new google.maps.LatLng(museum.latitud_position, museum.longitud_position);
    /*const marker = new google.maps.Marker({
      title: museum.name_user,
      animation: google.maps.Animation.DROP,
      position
    });*/
    const marker = new google.maps.Marker({ position, title: museum.nombre_friend, animation: google.maps.Animation.DROP });
    marker.setMap(this.map);
    const content = museum.nombre_friend;
    this.addInfoWindow(marker, content);
  }

  addInfoWindow(marker, cont) {
    const infoWindow = new google.maps.InfoWindow({ content: cont });
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }

}
