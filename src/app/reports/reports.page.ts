import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { InvoicesService } from '../shared/services/invoices.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {

  rows = [];
  loading = true;
  skeletons = [1, 2, 3, 4, 5, 6, 7, 8];

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private router: Router,
    private invoiceService: InvoicesService
  ) { }
    
  ngOnInit() {
    this.init();
  }

  async init () {
    await this.getAll(true);
  }

  getAll(reset = false, useLoading = true, next = null) {
    if (reset) this.rows = [];
    this.loading = useLoading;
    return new Promise((resolve, reject) => {
      this.invoiceService.getReportsAll()
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
  }

  async doRefresh(event) {
    await this.getAll(true);
    event.target.complete();
  }

}
