import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UtilitiesService } from '../services/utilities.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private auth: AuthService, private utility: UtilitiesService) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise(async (resolve, reject) => {
      if (this.auth.isAuthenticated()) {
        const authorized = await this.auth.checkRole(next.data.roles);

        if (next.data.roles.length > 0) {

          if (authorized) {
            resolve(true);
          } else {
            this.utility.presentToast('You dont have access to that page');
            this.router.navigate(['/invoices']);
            resolve(false);
          }
        } else {
          resolve(true);
        }
      } else {
        console.log('not log in')
        this.router.navigate(['/login']);
        resolve(false);
      }
    });
  }

}
