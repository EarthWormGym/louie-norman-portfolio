import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private apiUrl = '/api/images';

  private http = inject(HttpClient)

  getImages(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl);
  }
}