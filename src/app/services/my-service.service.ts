import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MyServiceService {

  constructor(private http: HttpClient) { }
  getUsers() {
    return this.http.get<any>("https://reqres.in/api/users?page=2")
  }
  uploadImg(image) {
    return this.http.post<any>('url', image, { reportProgress: true, observe: 'events' });
  }
}
