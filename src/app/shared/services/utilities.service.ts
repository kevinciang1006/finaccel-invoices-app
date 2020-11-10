import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  constructor(
    private toastController: ToastController,
    private loadingController: LoadingController
  ) { }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      buttons: [{
        text: 'Close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }
      ]
    });
    toast.present();
  }
}
