import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { InvoicesService } from 'src/app/shared/services/invoices.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

export class Invoice {
  id = null;
  customer_name = '';
  customer_address = '';
  customer_phone = '';
  tax = '';
  invoiceDetails: any;

  constructor(init?) {
    if (init) {
      this.id = init.id;
      this.customer_name = init.customer_name;
      this.customer_address = init.customer_address;
      this.customer_phone = init.customer_phone;
      this.tax = init.tax;
      this.invoiceDetails = init.details;
    }
  }
}

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {

  // Data passed in by componentProps
  @Input() componentProps: any;

  form: FormGroup;
  subTotal;
  tax;
  total;

  invoice: any;

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private invoicesService: InvoicesService,
    private utility: UtilitiesService
  ) { }

  ngOnInit() {
    this.invoice = new Invoice(this.componentProps);
    this.createForm();

    this.calculate(this.form.value);

    this.form.valueChanges.subscribe(res => {
      // console.log(res);
      this.calculate(res);
    });
  }

  createForm() {
    this.form = this.formBuilder.group({
      id: new FormControl(this.invoice.id),
      customer_name: new FormControl(this.invoice.customer_name, Validators.required),
      customer_address: new FormControl(this.invoice.customer_address, Validators.required),
      customer_phone: new FormControl(this.invoice.customer_phone, Validators.required),
      tax: new FormControl(this.invoice.tax, Validators.required),
      invoiceDetails: new FormArray([])
    });

    if (!this.invoice.id) {
      this.addTransaction();
    } else {
      for (const item of this.invoice.invoiceDetails) {
        this.addTransactionEdit(item);
      }
    }
    console.log(this.form.value);
  }

  // convenience getters for easy access to form fields
  get f() { return this.form.controls; }
  get t() { return this.form.get('invoiceDetails') as FormArray; }

  addTransaction() {
    this.t.push(this.formBuilder.group({
      name: ['', Validators.required],
      quantity: ['', Validators.required],
      price: ['', Validators.required],
    }));
  }

  addTransactionEdit(item) {
    this.t.push(this.formBuilder.group({
      id: [item.id],
      name: [item.name, Validators.required],
      quantity: [item.quantity, Validators.required],
      price: [item.price, Validators.required],
    }));
  }

  removeTransaction(i) {
    this.t.removeAt(i);
  }

  clearTransactions() {
    this.t.clear();
  }

  calculate(data) {
    this.subTotal = 0;
    this.total = 0;

    for (const item of data.invoiceDetails) {
      this.subTotal += item.quantity * item.price;
    }

    this.tax = this.subTotal * data.tax / 100;
    this.total = this.subTotal + this.tax;
  }

  save() {
    // const formData: FormData = this.getFormData(this.form.value);
    const formData = JSON.stringify(this.form.value);
    console.log(formData);

    // return;
    if (this.invoice.id) {

      this.invoicesService.edit(formData, this.invoice.id)
        .then(res => {
          console.log(res);
          this.dismiss(res);
          this.utility.presentToast(res.messages);
        })
        .catch(err => {
          console.log(err);
          this.utility.presentToast(err.error.message);
        });

    } else {

      this.invoicesService.save(formData, this.invoice.id)
        .then(res => {
          console.log(res);
          this.dismiss(res);
          this.utility.presentToast(res.messages);
        })
        .catch(err => {
          console.log(err);
          this.utility.presentToast(err.error.message);
        });
    }
  }

  dismiss(data = null) {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss(data);
  }
}
