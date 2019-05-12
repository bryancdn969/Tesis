import { Component, OnInit,  ViewChild, ElementRef } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { UserService } from '../../api/user.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

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
  responseDataid: any;
  responseDataTesting: any;
  responseDataRegisterFriend: any;

  userData = { id_user : '', id_friend : '', name_user : '', latitud_position : 0.00 ,
  longitud_position : 0.00, direccion_position : '', nombre_friend : '' , status_position : 'Active' };

  constructor(
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private authService: UserService,
    private router: Router,
    private toastController: ToastController
  ) { }

  async presentToast( message: string ) {
    const toast = await this.toastController.create({
        message,
        duration: 2000
    });
    toast.present();
  }

  ngOnInit() {
    this.loadMap();
  }

  loadMap() {
    this.geolocation.getCurrentPosition().then((resp) => {
      const latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      const mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);
      this.userData.latitud_position = resp.coords.latitude;
      this.userData.longitud_position = resp.coords.longitude;

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      this.map.addListener('tilesloaded', () => {
        console.log('accuracy', this.map);
        this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng());
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
        this.userData.direccion_position = this.address;
      })
      .catch((error: any) => {
        this.address = 'Address Not Available!';
      });

  }

  shareLocation() {
    // primero consultamos si el usaurio tiene contactos agregados
    this.responseDataid = localStorage.getItem('userDataLogin');
    // tomo el id del usaurio logeuado
    this.userData.id_user = JSON.parse(this.responseDataid).id;
    console.log(this.userData.id_user);
    this.authService.postFormData(JSON.parse(this.responseDataid).id, 'testing').then((result) => {
      this.responseDataTesting = result;
      console.log(this.responseDataTesting);
      // si no existe datos
      if (this.responseDataTesting.api_status === 0 && this.responseDataTesting.api_http === 401) {
        this.presentToast('You do not have friends added, add one please.');
        this.router.navigate([ '/menu/addFriends' ]);
      } else {
        // Si si tiene amigos envie la poscion
        let i: number;

        for (i = 0; i <= this.responseDataTesting.data.length - 1; i++) {
          // tomo los ids y nombres de mis amigos
          this.userData.id_friend = this.responseDataTesting.data[i].id_friend;
          this.userData.nombre_friend = this.responseDataTesting.data[i].nombre_friend;

          this.authService.postData(JSON.stringify(this.userData), 'sendAddress').then((res) => {
            this.responseDataRegisterFriend = res;
            console.log(this.responseDataRegisterFriend);
            if (this.responseDataRegisterFriend.api_status === 1 && this.responseDataRegisterFriend.api_http === 200) {
                localStorage.setItem('userDataAddress', JSON.stringify(this.responseDataRegisterFriend));
                this.presentToast('Send address successful.');
            } else  if (this.responseDataRegisterFriend.api_status === 0 && this.responseDataRegisterFriend.api_http === 200) {
                this.presentToast('Invalid to send address.');
            } else  if (this.responseDataRegisterFriend.api_status === 0 && this.responseDataRegisterFriend.api_http === 401) {
                this.presentToast('Invalid to send address.');
            }
        }, (err) => {
            console.log(err);
            this.presentToast('The service is failed.');
        });
        }
      }
  }, (err) => {
    console.log(err);
    this.presentToast('The service is failed.');
    });
}

}
