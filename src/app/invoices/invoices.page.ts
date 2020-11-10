import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { AuthService } from '../shared/services/auth.service';
import { CONSTANTS } from '../shared/services/config.service';
import { InvoicesService } from '../shared/services/invoices.service';
import { DetailsComponent } from './details/details.component';
import { FormComponent } from './form/form.component';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.page.html',
  styleUrls: ['./invoices.page.scss'],
})
export class InvoicesPage implements OnInit {

  rows = [];
  loading = true;
  skeletons = [1, 2, 3, 4, 5, 6, 7, 8];
  constants;

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private router: Router,
    private invoiceService: InvoicesService,
    public auth: AuthService
  ) { }

  ngOnInit() {
    this.constants = CONSTANTS;
    // this.auth.checkRole([]);
    this.init();
  }

  async init () {
    await this.getAll(true);
  }

  getAll(reset = false, useLoading = true, next = null) {
    if (reset) this.rows = [];
    this.loading = useLoading;
    return new Promise((resolve, reject) => {
      this.invoiceService.getAll()
        .then(res => {
          console.log(res);
          this.rows = res.data;
          console.log(this.rows);
          this.loading = false;
          resolve(res);
        })
        .catch(err => reject(err));
    });
  }

  async onClick(item) {
    console.log(item);
    
    const modal = await this.modalController.create({
      component: DetailsComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        componentProps: item
      }
    });
    await modal.present();
  }

  async openForm(item, index) {

    // if (item) { item.method = CONSTANTS.PUT; }

    const modal = await this.modalController.create({
      component: FormComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        componentProps: item
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    console.log(data);

    if (data) {
      // const update = item ? this.rows[index] = data : this.rows.push(data);
      this.getAll(true);
    }
  }

  delete(item, index) {
    this.invoiceService.delete(item.id)
      .then(res => {
        console.log(res);
        this.rows.splice(index, 1);
      })
      .catch(err => {
        console.log(err);
      });
  }

  async presentAlertConfirm(item, index) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Are you sure?',
      message: 'You are going to delete this item. This action is <strong>IRREVERSABLE</strong>!!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'DELETE',
          handler: () => {
            console.log('Confirm Okay');
            this.delete(item, index);
          }
        }
      ]
    });

    await alert.present();
  }

  async doRefresh(event) {
    await this.getAll(true);
    event.target.complete();
  }

}
