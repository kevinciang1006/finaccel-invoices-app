import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CONSTANTS } from './config.service';
import { RestService } from './rest.service';

const apiUrl = CONSTANTS.API_URL + '/invoices';

@Injectable({
  providedIn: 'root'
})
export class InvoicesService {

  constructor(private restService: RestService) { }

  add(data) {
    return new Promise<any>((resolve, reject) => {
      this.addAPI(data).toPromise().then((result) => {
        resolve(result);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  edit(data, id) {
    return new Promise<any>((resolve, reject) => {
      this.editAPI(data, id).toPromise().then((result) => {
        resolve(result);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  save(data, id) {
    return new Promise<any>((resolve, reject) => {
      this.saveAPI(data, id).toPromise().then((result) => {
        resolve(result);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  delete(id) {
    return new Promise<any>((resolve, reject) => {
      this.deleteAPI(id).toPromise().then((result) => {
        resolve(result);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  getAll() {
    return new Promise<any>((resolve, reject) => {
      this.getAllAPI().toPromise().then((result) => {
        resolve(result);
      }).catch((error) => {
        reject(error);
      });
    });
  }
  
  getReportsAll() {
    return new Promise<any>((resolve, reject) => {
      this.getReportsAllAPI().toPromise().then((result) => {
        resolve(result);
      }).catch((error) => {
        reject(error);
      });
    });
  }
  
  getById(id) {
    return new Promise<any>((resolve, reject) => {
      this.getByIdAPI(id).toPromise().then((result) => {
        resolve(result);
      }).catch((error) => {
        reject(error);
      });
    });
  }
  private getByIdAPI(id): Observable<any> {
    const url = `${apiUrl}/${id}`;
    return this.restService.get(url);
  }
  private getAllAPI(): Observable<any> {
    // const params = new URLSearchParams(filter).toString();
    // const url = next ? next + '&' + params : apiUrl + '?' + params;
    // console.log(url);
    return this.restService.get(apiUrl);
  }
  
  private getReportsAllAPI(): Observable<any> {
    return this.restService.get(apiUrl+ '/reports');
  }
  private addAPI(data: {}): Observable<any> {
    return this.restService.post(apiUrl, data);
  }
  private editAPI(data: {}, id): Observable<any> {
    return this.restService.patch(apiUrl + '/' + id, data);
  }
  private saveAPI(data: {}, id = null): Observable<any> {
    const url = id ? apiUrl + '/' + id : apiUrl;
    return this.restService.post(url, data);
  }
  private deleteAPI(id): Observable<any> {
    return this.restService.delete(apiUrl + '/' + id);
  }
}
