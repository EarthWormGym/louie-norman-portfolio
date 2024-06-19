import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent
  ]
})
export class PortfolioComponent implements OnInit {

  currentImageIndex = 0;
  stoneImages: string[] = Array.from({length: 6}, (_, i) => `assets/from-stone-to-stone/stoneFrame${i + 1}.png`);

  projects = [
    { name: 'From Stone to Stone', link: 'from-stone-to-stone' },
    { name: 'Bangers', link: 'bangers' },
    { name: 'Jimmy and Jill', link: 'jimmy-and-jill' },
    { name: 'UnDance', link: 'undance' },
    { name: 'Rio Ferdinand Foundation', link: 'rio-ferdinand-foundation' },
    { name: 'Interface', link: 'interface' },
  ];

  private router = inject(Router);

  ngOnInit() {
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
    this.currentImageIndex = (this.currentImageIndex + 1) % this.stoneImages.length;
  }

}
