import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { UserService } from '../../api/user.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

declare var google;

@Component({
  selector: 'app-friends-detail',
  templateUrl: './friends-detail.page.html',
  styleUrls: ['./friends-detail.page.scss'],
})
export class FriendsDetailPage implements OnInit {

  @ViewChild('map') mapContainer: ElementRef;
  map: any;
  responseData: any;
  lat: number;
  lng: number;

  constructor(
    private authService: UserService,
    private toastController: ToastController,
    private geolocation: Geolocation,
    private router: Router,
  ) {


   }

   displayGoogleMap(coords) {
     if (true)  {
      this.lat = +coords.latitud_position;
      this.lng = +coords.longitud_position;
      const latLng = new google.maps.LatLng(this.lat, this.lng);
      const mapOptions = {
        center: latLng,
        disableDefaultUI: true,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      this.map = new google.maps.Map(this.mapContainer.nativeElement, mapOptions);
     }
  }

  addMarkersToMap(museum) {
    this.lat = +museum.latitud_position;
    this.lng = +museum.longitud_position;
    const position = new google.maps.LatLng(this.lat, this.lng);
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

  async presentToast( message: string ) {
    const toast = await this.toastController.create({
        message,
        duration: 2000
    });
    toast.present();
  }

  ngOnInit() {
    this.responseData = JSON.parse(localStorage.getItem('friendsDetails'));
    this.displayGoogleMap(this.responseData);
    this.addMarkersToMap(this.responseData);
  }

  regresar() {
    this.router.navigate([ '/menu/viewPositionFreinds' ]); // remember to put this to add the back button behavior
  }
}
