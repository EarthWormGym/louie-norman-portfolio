import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { HeaderComponent } from './header/header.component';
import { MediaService } from './media-service.service';
import { MediaModel } from './model/media-model';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent
  ],
  providers: [
    MediaService
  ]
})
export class PortfolioComponent implements OnInit {

  isLoading = true;
  currentImageIndex = 0;
  currentMedia: MediaModel = new MediaModel();
  allMedia: MediaModel[] = [];

  projects = [
    { name: 'From Stone to Stone', link: 'from-stone-to-stone' },
    { name: 'Bangers', link: 'bangers' },
    { name: 'Jimmy and Jill', link: 'jimmy-and-jill' },
    { name: 'UnDance', link: 'un-dance' },
    { name: 'Rio Ferdinand Foundation', link: 'rio-ferdinand-foundation' },
    { name: 'Interface', link: 'interface' },
  ];

  private router = inject(Router);
  private imageService = inject(MediaService);

  ngOnInit(): void {
    this.preloadImages();
    this.setupRouterEvents();
  }

  preloadImages(): void {
    this.imageService.getAllPortfolioMedia().subscribe(media => {
      this.currentMedia = media[0];
      this.allMedia = media;
      this.isLoading = false;
    });
  }

  setupRouterEvents(): void {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.url.includes('#')) {
          const projectId = event.url.split('#')[1];
          this.selectProject(projectId);
        }
      });
  }
  
  selectProject(projectId: string): void {
    const projectImageIndex = this.allMedia.findIndex(media => media.path.includes(projectId));
    if (projectImageIndex !== -1) {
      this.currentImageIndex = projectImageIndex - 1;
    }
  }

  changeBackground(): void {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.allMedia.length;
    this.currentMedia = this.allMedia[this.currentImageIndex];
  }

  getBackgroundImage(): string {
    if (this.allMedia[this.currentImageIndex].type !== 'video') {
      return `url(${this.allMedia[this.currentImageIndex].path})`;
    }
    return '';
  }
}
