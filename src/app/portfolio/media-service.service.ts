import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { MediaModel } from './model/media-model';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private baseUrl = 'http://localhost:3000/api/';
  private portfolioUrl = 'portfolio/images';
  private aboutUrl = 'about/images';

  private http = inject(HttpClient)

  getAllPortfolioMedia(): Observable<MediaModel[]> {
    return this.http.get<string[]>(this.baseUrl + this.portfolioUrl).pipe(
      map(paths => paths.map(path => {
        const media = new MediaModel();
        media.path = path;
        if (path.includes('mp4')) {
          media.type = 'video';
        } else {
          media.type = 'image';
        }
        media.project = '';
        return media;
      }))
    );
  }

  getAllAboutImages(): Observable<string[]> {
    return this.http.get<string[]>(this.baseUrl + this.aboutUrl);
  }
}