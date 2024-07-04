import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private baseUrl = 'http://localhost:3000/api/';
  private portfolioUrl = 'portfolio/images';
  private aboutUrl = 'about/images';

  private http = inject(HttpClient)

  getAllPortfolioImages(): Observable<string[]> {
    return this.http.get<string[]>(this.baseUrl + this.portfolioUrl);
  }

  getAllAboutImages(): Observable<string[]> {
    return this.http.get<string[]>(this.baseUrl + this.aboutUrl);
  }
}