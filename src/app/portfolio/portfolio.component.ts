import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { HeaderComponent } from './header/header.component';
import { ImageService } from './image-service.service';

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
  providers: [ImageService]
})
export class PortfolioComponent implements OnInit {
  currentImageIndex = 0;
  images: string[] = [];
  baseUrl: string = 'http://localhost:3000/assets/';

  projects = [
    { name: 'From Stone to Stone', link: 'from-stone-to-stone' },
    { name: 'Bangers', link: 'bangers' },
    { name: 'Jimmy and Jill', link: 'jimmy-and-jill' },
    { name: 'UnDance', link: 'undance' },
    { name: 'Rio Ferdinand Foundation', link: 'rio-ferdinand-foundation' },
    { name: 'Interface', link: 'interface' },
  ];

  private router = inject(Router);
  private imageService = inject(ImageService);

  // Add to PortfolioComponent
  ngOnInit() {
    this.preloadImages();
    this.setupRouterEvents();
  }

  preloadImages() {
    this.imageService.getAllImages().subscribe(paths => {
      this.images = paths.map(path => this.baseUrl + path);
      // Preload images into browser cache
      this.images.forEach(imagePath => {
        const img = new Image();
        img.src = imagePath;
      });
    });
  }

  setupRouterEvents() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.url.includes('#')) {
          const elementId = event.url.split('#')[1];
          const element = document.getElementById(elementId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
  }

  changeBackground(): void {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
  }

  getBackgroundImage(): string {
    return `url(${this.images[this.currentImageIndex]})`;
  }
}
