import { Component, OnInit } from '@angular/core';

import { AlertController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router, RouterEvent } from '@angular/router';
import { AuthService } from './shared/services/auth.service';
import { CONSTANTS } from './shared/services/config.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Invoices',
      url: '/invoices',
      icon: 'document',
      roles: [],
    },
    {
      title: 'Reports',
      url: '/reports',
      icon: 'newspaper',
      roles: [CONSTANTS.DIRECTOR],
    }
  ];
  // public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  public labels = [];
  selectedPath = this.appPages[0].url;

  constants;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private alertController: AlertController,
    public auth: AuthService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
    
    this.router.events.subscribe((event: RouterEvent) => {
      if (event && event.url && event.url !== '/') {
        this.selectedPath = event.url;
        // console.log(this.selectedPath);
        // console.log(this.selectedPath.startsWith(event.url));
      }
    });

    this.auth.checkRole([]);
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Perhatian',
      message: 'Apa anda ingin keluar?',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Keluar',
          cssClass: 'danger',
          handler: () => {
            this.auth.logout();
            this.router.navigate(['/login']);
          }
        }
      ]
    });

    await alert.present();
  }
}
