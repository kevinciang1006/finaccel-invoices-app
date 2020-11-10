import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {

  // Data passed in by componentProps
  @Input() componentProps: any;

  details: any;
  subTotal;
  tax;
  total;

  constructor(
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    this.details = this.componentProps.details;
    this.calculate();
  }

  dismiss(data = null) {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss(data);
  }

  calculate() {
    this.subTotal = 0;
    this.total = 0;

    for (const item of this.details) {
      this.subTotal += item.quantity * item.price;
    }

    this.tax = this.subTotal * this.componentProps.tax / 100;
    this.total = this.subTotal + this.tax;
  }


}
