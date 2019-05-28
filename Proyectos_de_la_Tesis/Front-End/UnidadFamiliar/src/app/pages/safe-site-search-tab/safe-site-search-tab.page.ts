import { Component, OnInit, ViewChild  } from '@angular/core';
import { UserService } from '../../api/user.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { IonInfiniteScroll, IonVirtualScroll } from '@ionic/angular';

@Component({
  selector: 'app-safe-site-search-tab',
  templateUrl: './safe-site-search-tab.page.html',
  styleUrls: ['./safe-site-search-tab.page.scss'],
})
export class SafeSiteSearchTabPage implements OnInit {

  zones: any[] = [ ];
  sector: any[] = [ ];
  selectedSingleZone: any;
  selectZone =  {};
  comboZones: any;
  sectorEspecificas: any;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonVirtualScroll) virtualScroll: IonVirtualScroll;
  sectorZone = { sector_zona : 0 , status_zona : 'A' };
  habilitarLista = true;

  constructor(
    private authService: UserService,
    private router: Router,
    private toastController: ToastController,
  ) { }

  ngOnInit() {
    this.authService.postData(JSON.stringify(this.selectZone), 'selectzones').then((res) => {
      this.comboZones = res;
      // console.log(this.comboZones);
      for (let i = 0; i <= this.comboZones.data.length - 1; i++) {
        this.zones = this.comboZones.data;
      }
    });
  }

  compareFn(e1, e2): boolean {
    return e1 && e2 ? e1.nombre_sector === e2.nombre_sector : e1 === e2;
  }

  singleChange() {
    console.log(this.selectedSingleZone);
    this.habilitarLista = false;
    this.sectorZone.sector_zona = this.selectedSingleZone.id_sector;
    this.authService.postData(JSON.stringify(this.sectorZone), 'selectzonesespecificas').then((res) => {
      this.sectorEspecificas = res;
      // console.log(this.comboZones);
      for (let i = 0; i <= this.sectorEspecificas.data.length - 1; i++) {
        this.sector = this.sectorEspecificas.data;
        this.habilitarLista = false;
      }
    });
  }

  loadData(event) {
    setTimeout(() => {
      // Hide Infinite List Loader on Complete
      event.target.complete();
      // Rerender Virtual Scroll List After Adding New Data
      this.virtualScroll.checkEnd();
      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.sector.length <= this.sectorEspecificas.data.length) {
        event.target.disabled = true;
      }
    }, 500);
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

}
