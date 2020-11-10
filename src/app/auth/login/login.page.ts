import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CONSTANTS } from 'src/app/shared/services/config.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { RestService } from 'src/app/shared/services/rest.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  // SIGN IN FORM
  form: FormGroup;
  email: FormControl;
  password: FormControl;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private menuCtrl: MenuController,
    private restService: RestService,
    private utility: UtilitiesService
  ) {
    this.menuCtrl.enable(false);

    this.email = new FormControl('', Validators.required);
    this.password = new FormControl('', Validators.required);

    this.form = this.formBuilder.group({
      email: this.email,
      password: this.password
    });

    const tokenCheck = localStorage.getItem(CONSTANTS.TOKEN_NAME);
    if (tokenCheck) {
      this.router.navigate(['/invoices']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
  }

  async login() {
    console.log('login: ', this.form.value);
    // this.utility.presentLoading();

    this.auth.login(this.form.value).subscribe(
      (next: any) => {

        console.log(next);
        if (next.accessToken) {
          localStorage.setItem(CONSTANTS.TOKEN_NAME, next.accessToken);
          localStorage.setItem(CONSTANTS.USER, JSON.stringify(next.user));
          this.auth.user.next(next.user);
          this.auth.authenticated.next(true);
          this.restService.setAuthorizationHeader(next.accessToken);
          this.router.navigate(['/invoices']);
          this.menuCtrl.enable(true);
          this.utility.presentToast('Welcome to App Invoices ' + next.user.name);
        }
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
