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
  ngOnInit(): void {
    this.preloadImages();
    this.setupRouterEvents();
  }

  preloadImages(): void {
    this.imageService.getAllImages().subscribe(paths => {
      this.images = paths.map(path => this.baseUrl + path);
      // Preload images into browser cache
      this.images.forEach(imagePath => {
        const img = new Image();
        img.src = imagePath;
      });
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
    // Assuming your images array or the way you fetch images allows you to associate each image with a project ID
    const projectImageIndex = this.images.findIndex(imagePath => imagePath.includes(projectId));
    if (projectImageIndex !== -1) {
      this.currentImageIndex = projectImageIndex;
      // Optionally, update the background immediately
      this.changeBackground();
    }
  }

  changeBackground(): void {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
  }

  getBackgroundImage(): string {
    return `url(${this.images[this.currentImageIndex]})`;
  }
}
