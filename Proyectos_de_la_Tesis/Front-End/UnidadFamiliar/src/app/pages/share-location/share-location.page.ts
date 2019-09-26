import { Component, OnInit,  ViewChild, ElementRef } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { UserService } from '../../api/user.service';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

declare var google;

@Component({
  selector: 'app-share-location',
  templateUrl: './share-location.page.html',
  styleUrls: ['./share-location.page.scss'],
})
export class ShareLocationPage implements OnInit {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  address: string;
  responseData: any;
  responseDataTesting: any;
  responseDataRegisterFriend: any;
  aux: any;
  status = 'A';
  lat: any;
  lng: any;
  nameButton: any;
  estadoEnvioUbicacion: any;
  userData = { id_user: '', id_friend : '', name_user : '', latitud_position : this.lat , longitud_position : this.lng,
               direccion_position : '', nombre_friend : '' , status_position : this.status };
  verificarEstadoEnvioUbicacion = { id_user : '', status_position : 'A' };
  dataVerification = { id_user : ''};
  id: any;
  updatStatePosition = {id: '', id_user: '', status_position: 'I' };
  updatePosition: any;
  myLatLng: any;
  directionsService: any = null;
  directionsDisplay: any = null;
  bounds: any = null;

  constructor(
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private authService: UserService,
    private router: Router,
    public menu: MenuController,
  ) {
    this.directionsService = new google.maps.DirectionsService();
    this.directionsDisplay = new google.maps.DirectionsRenderer();
    this.bounds = new google.maps.LatLngBounds();
   }

  ngOnInit() {
    this.getPosition();
    this.verificarEstadoUbicacion();
  }

  verificarEstadoUbicacion() {
    this.responseData = localStorage.getItem('userDataLogin');
    // tomo el id del usaurio logeuado
    this.aux = JSON.parse(this.responseData);
    this.dataVerification.id_user = this.aux.id;
    this.verificarEstadoEnvioUbicacion.id_user = this.aux.id;
    this.authService.postData(JSON.stringify(this.verificarEstadoEnvioUbicacion), 'estadoenvioubicacion').then((result) => {
      this.estadoEnvioUbicacion = result;
      console.log(this.estadoEnvioUbicacion);
      if (this.estadoEnvioUbicacion.api_status === 1 && this.estadoEnvioUbicacion.data.length > 0) {
        this.nameButton = 'Dejar de enviar ubicación';
        this.updatStatePosition.id = this.estadoEnvioUbicacion.data[0].id;
        this.updatStatePosition.id_user = this.estadoEnvioUbicacion.data[0].id_user;
      } else {
        this.nameButton = 'Enviar mi ubicación';
      }
    }, (err) => {
      console.log(err);
      this.authService.presentToast('El servico fallo.');
    });
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

    // create LatLng object
    this.myLatLng = {lat: latitude, lng: longitude};

    const mapOptions = {
      center: this.myLatLng,
      zoom: 18,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    // create map
    this.map = new google.maps.Map(mapEle, mapOptions);

    this.map.addListener('tilesloaded', () => {
      console.log('accuracy', this.map);
    });

    this.getAddressFromCoords(position.coords.latitude, position.coords.longitude);
    this.lat = position.coords.latitude; this.lng = position.coords.longitude;
    this.userData.latitud_position = this.lat;
    this.userData.longitud_position = this.lng;

    this.directionsDisplay.setMap(this.map);

    google.maps.event.addListener(this.map, 'tilesloaded', () => {
      mapEle.classList.add('show-map');

      this.lat = +(this.responseData.latitud_zona);
      this.lng = +(this.responseData.longitud_zona);
    });

    this.map.addListener('tilesloaded', () => {
      this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng());
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
        this.userData.direccion_position = this.address;
      })
      .catch((error: any) => {
        this.userData.direccion_position = 'No se puede enviar la ubicación';
        this.address = 'Dirección no disponible!';
      });
  }

  shareLocation() {
    this.authService.postData(JSON.stringify(this.dataVerification), 'testing').then((result) => {
      // si la respuesta es 0 navega hacia la pagina de asignacion de amigos
      this.responseDataTesting = result;
      // si no existe datos
      if (this.responseDataTesting.api_status === 1 && this.responseDataTesting.data.length <= 0) {
        // this.responseDataTesting.api_http === 200 && this.responseDataTesting.data.length <= 0) {
          this.authService.presentToast('No tiene amigos agregados, agregue uno porfavor.');
          this.router.navigate([ '/menu/addFriends' ]);
      } else if (this.responseDataTesting.api_status === 0 &&
        this.responseDataTesting.api_http === 401) {
        this.authService.presentToast('No tiene amigos agregados, agregue uno porfavor.');
        this.router.navigate([ '/menu/addFriends' ]);
      } else {
        this.enviarDireccion();
      }
  }, (err) => {
    this.authService.presentToast('El servicio fallo.');
    });
  }

  enviarDireccion() {
    if (this.nameButton === 'Dejar de enviar ubicación') {
      this.authService.postData(JSON.stringify(this.updatStatePosition), 'dejarenviarubicacion').then((res) => {
        this.updatePosition = res;
        if (this.updatePosition.api_status === 1) {
          this.authService.presentToast('Se dejó de compartir ubicación.');
          this.router.navigate([ '/menu/shareLocation' ]);
          this.nameButton = 'Enviar mi ubicación';
        }
      }, (err) => {
        console.log(err);
        this.authService.presentToast('El servicio fallo.');
    });
    } else if (this.nameButton === 'Enviar mi ubicación') {
      // Si si tiene amigos envie la poscion
      let i: number;

      for (i = 0; i <= this.responseDataTesting.data.length - 1; i++) {
        // tomo los ids y nombres de mis amigos
        this.userData.id_user = this.dataVerification.id_user;
        this.userData.name_user = this.aux.name;
        this.userData.nombre_friend = this.responseDataTesting.data[i].nombre_friend;
        this.traerId(this.dataVerification);
      }
    } else {
      this.authService.presentToast('El servicio fallo.');
    }
  }

  traerId(id) {
    this.authService.postData(JSON.stringify(id), 'verificaridfriend').then((result) => {
      this.id = result;
      if (this.id.api_status === 1 ) {
        this.userData.id_friend = this.id.data[0].id;
        this.authService.postData(JSON.stringify(this.userData), 'sendaddress').then((res) => {
          this.responseDataRegisterFriend = res;
          if (this.responseDataRegisterFriend.api_status === 1 ) {
              localStorage.setItem('userDataAddress', JSON.stringify(this.responseDataRegisterFriend));
              this.authService.presentToast('Dirección enviada correctamente.');
              this.router.navigate([ '/menu/shareLocation' ]);
              this.nameButton = 'Dejar de enviar ubicación';
            } else  if (this.responseDataRegisterFriend.api_status === 0 ) {
            this.authService.presentToast('Error al enviar dirección.');
         } else  if (this.responseDataRegisterFriend.api_status === 0 ) {
            this.authService.presentToast('Error al enviar dirección.');
          }
      }, (err) => {
          this.authService.presentToast('El servicio fallo.');
      });
      }
    }, (err) => {
        console.log(err);
        this.authService.presentToast('El servicio fallo.');
    });
}

  ionViewWillEnter() {
    this.menu.enable(true);
  }

}
