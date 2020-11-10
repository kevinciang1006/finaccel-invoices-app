import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CONSTANTS } from './config.service';
import { RestService } from './rest.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authenticated = new BehaviorSubject<boolean>(false);
  user = new BehaviorSubject<any>({});
  curUser = null;
  userRoles: any;

  constructor(public restService: RestService) {
    this.restService = restService;

    this.authenticated.next(this.isAuthenticated());
  }

  public isAuthenticated(): boolean {
    // const jwtHelper: JwtHelperService = new JwtHelperService();
    const token = localStorage.getItem(CONSTANTS.TOKEN_NAME);
    console.log(token);
    // Check whether the token is expired and return
    // true or false
    return token ? true : false;
  }

  public userData(): any {
    // const jwtHelper: JwtHelperService = new JwtHelperService();
    const user = localStorage.getItem(CONSTANTS.USER);
    // console.log(user);
    // Check whether the token is expired and return
    // true or false
    return JSON.parse(user);
  }


  login(data) {
    console.log('masuk');
    console.log('_restService : ', this.restService);
    const response = this.restService.postNoToken(CONSTANTS.API_URL + '/auth/signin', data);
    console.log('response : ', response);
    return response;
  }

  logout() {
    localStorage.clear();
    this.userRoles = null;
    this.authenticated.next(false);
    // const response = this.restService.post(CONSTANTS.API_URL + '/logout', {});
    // console.log('response : ', response);
    // return response;
  }

  checkRole(compareRoles) {
    return new Promise<any>(async (resolve, reject) => {
      let res = null;
      if (!this.userRoles) {
        res = await this.getRole();
        this.userRoles = res.roles;
      }
      console.log(this.userRoles);

      for (const userRole of this.userRoles) {
        for (const role of compareRoles) {
          if (userRole.name == role) {
            console.log(userRole);
            resolve(true);
          }
        }
      }
      resolve(false);
    });

  }

  compareRole(roles) {
    if (roles.length <= 0 || !this.userRoles) { return true };
    const item = this.userRoles.find(item => roles.indexOf(item.name) > -1);
    return item ? true : false;
  }

  getRole() {
    return new Promise<any>((resolve, reject) => {
      this.geRoleAPI().toPromise().then((result) => {
        resolve(result);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  private geRoleAPI(): Observable<any> {
    return this.restService.post(CONSTANTS.API_URL + '/auth/role', {});
  }
}
