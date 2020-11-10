import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CONSTANTS } from 'src/app/shared/services/config.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { RestService } from 'src/app/shared/services/rest.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  // SIGN IN FORM
  form: FormGroup;
  name: FormControl;
  email: FormControl;
  password: FormControl;
  role: FormControl;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private menuCtrl: MenuController,
    private restService: RestService,
    private utility: UtilitiesService
  ) {
    this.menuCtrl.enable(false);

    this.name = new FormControl('', Validators.required);
    this.email = new FormControl('', Validators.required);
    this.password = new FormControl('', Validators.required);
    this.role = new FormControl('', Validators.required);

    this.form = this.formBuilder.group({
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role,
    });

    const tokenCheck = localStorage.getItem(CONSTANTS.TOKEN_NAME);
    if (tokenCheck) {
      this.router.navigate(['/invoices']);
    } else {
    }
  }

  ngOnInit(): void {
  }

  login() {
    this.router.navigate(['/login']);    
  }

  async register() {

    const data = this.form.value;
    data.roles = [data.role];
    console.log('register: ', data);
    // this.utility.presentLoading();
    // return;
    this.auth.register(data).subscribe(
      (next: any) => {

        console.log(next);
        this.router.navigate(['/login']);
        this.utility.presentToast('Successfully registered');
      },
      (error: any) => {
        console.log(error);
        this.utility.presentToast(error.error.errors);
        // this.utility.dismissLoading();
      },
      () => {
        console.log('COMPLETE');
        // this.utility.dismissLoading();
      }
    );
  }
}
