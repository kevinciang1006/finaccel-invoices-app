import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { CONSTANTS } from './config.service';
import { map } from 'rxjs/operators';

const options = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': '' }),
};
const optionsNoToken = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root'
})
export class RestService {

  url = CONSTANTS.API_URL;
  token = null;
  constructor(public http: HttpClient) {
    this.token = localStorage.getItem(CONSTANTS.TOKEN_NAME);
    if (this.token !== null) {
      this.setAuthorizationHeader(this.token);
    }
  }

  setAuthorizationHeader(token) {
    options.headers = options.headers.set('x-access-token', token);
  }

  get(endpoint: string, params?: any, reqOpts?: any) {
    if (!reqOpts) {
      reqOpts = {
        params: new HttpParams()
      };
    }

    // Support easy query params for GET requests
    if (params) {
      reqOpts.params = new HttpParams();
      for (const k in params) {
        if (params[k]) {
          reqOpts.params = reqOpts.params.set(k, params[k]);
        }
      }
    }

    return this.http.get(endpoint, options);
  }

  postNoToken(endpoint: string, body: any) {
    return this.http.post(endpoint, body, optionsNoToken);
  }
  post(endpoint: string, body: any) {
    if (this.token === null) {
      this.token = localStorage.getItem(CONSTANTS.TOKEN_NAME);
      if (this.token !== null) {
        this.setAuthorizationHeader(this.token);
        return this.http.post(endpoint, body, options);
      }
    } else {
      console.log('masuk sini');
      return this.http.post(endpoint, body, options);
    }
    // return this.http.post(endpoint, body, {
    //   reportProgress: true,
    //   observe: 'events'
    // }).pipe(map((event) => {

    //   switch (event.type) {

    //     case HttpEventType.UploadProgress:
    //       const progress = Math.round(100 * event.loaded / event.total);
    //       return { status: 'progress', message: progress };

    //     case HttpEventType.Response:
    //       return event.body;
    //     default:
    //       return `Unhandled event: ${event.type}`;
    //   }
    // })
    // );
  }

  put(endpoint: string, body: any) {
    return this.http.put(endpoint, body, options);
  }

  delete(endpoint: string) {
    return this.http.delete(endpoint, options);
  }

  patch(endpoint: string, body: any) {
    return this.http.patch(endpoint, body, options);
  }

}
