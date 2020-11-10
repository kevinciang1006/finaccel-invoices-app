import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InvoicesPageRoutingModule } from './invoices-routing.module';

import { InvoicesPage } from './invoices.page';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FormComponent } from './form/form.component';
import { DetailsComponent } from './details/details.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    InvoicesPageRoutingModule,
    FlexLayoutModule
  ],
  declarations: [InvoicesPage, FormComponent, DetailsComponent]
})
export class InvoicesPageModule {}
