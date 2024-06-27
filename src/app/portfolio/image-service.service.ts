import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private apiUrl = '/api/images';

  private http = inject(HttpClient)

  // In your ImageService
  getAllImages(): Observable<string[]> {
    return this.http.get<string[]>('http://localhost:3000/api/images');
  }
}