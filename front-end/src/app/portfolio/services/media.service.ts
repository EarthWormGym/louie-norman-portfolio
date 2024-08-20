import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { MediaModel } from '../model/media-model';
import { MediaType } from '../model/media-type';
import { environment } from '../../../environments/environment'; // Import environment

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private baseUrl = 'http://louie-norman-studio:3000/api/';
  private portfolioUrl = 'portfolio/images';
  private aboutUrl = 'about/images';

  private http = inject(HttpClient)

  getAllPortfolioMedia(): Observable<MediaModel[]> {
    return this.http.get<string[]>(this.baseUrl + this.portfolioUrl).pipe(
      map(paths => paths.map(path => {
        const media = new MediaModel();
        media.path = path;
        if (path.includes('mp4')) {
          media.type = MediaType.Video;
        } else if (path.includes('pdf')) {
          media.type = MediaType.Pdf;
        } else {
          media.type = MediaType.Image;
        }
        media.project = path.split('/')[5];
        return media;
      }))
    );
  }

  getAllAboutImages(): Observable<string[]> {
    return this.http.get<string[]>(this.baseUrl + this.aboutUrl);
  }
}