import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { HeaderComponent } from './header/header.component';
import { MediaService } from './media.service';
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

  darkMode = false;
  videoDarkMode = false;
  projectDarkMode = false;
  isLoading = true;

  currentImageIndex = 0;
  currentMedia: MediaModel = new MediaModel();
  currentProject = '';
  projects: { [key: string]: MediaModel[] } = {};

  projectNames = [
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
    this.router.navigateByUrl('#from-stone-to-stone');
    this.preloadImages();
    this.setupRouterEvents();
  }

  preloadImages(): void {
    this.imageService.getAllPortfolioMedia().subscribe(media => {
      this.currentMedia = media[0];
      this.projects = this.groupMediaByProject(media);
      this.isLoading = false;
    });
  }

  groupMediaByProject(mediaArray: MediaModel[]): { [key: string]: MediaModel[] } {
    let groupedByProject: { [key: string]: MediaModel[] } = {};
    for (let media of mediaArray) {
      if (!groupedByProject[media.project]) {
        groupedByProject[media.project] = [];
      }
      groupedByProject[media.project].push(media);
    }
    return groupedByProject;
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
    this.currentProject = projectId;
    this.currentImageIndex = 0;
    this.currentMedia = this.projects[projectId][0];
    if (this.currentProject === 'rio-ferdinand-foundation' || this.currentProject === 'un-dance') {
      this.projectDarkMode = true;
    } else {
      this.projectDarkMode = false;
    }
  }

  getBackgroundImage(): string {
    if (this.projects[this.currentProject][this.currentImageIndex].type !== 'video') {
      this.videoDarkMode = false;
      return `url(${this.projects[this.currentProject][this.currentImageIndex].path})`;
    } else {
      this.videoDarkMode = true;
      return '';
    }
  }

  changeBackground(): void {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.projects[this.currentProject].length;
    this.currentMedia = this.projects[this.currentProject][this.currentImageIndex];
  }

  isDarkMode(): string {
    if (this.videoDarkMode || this.projectDarkMode) {
      this.darkMode = true;
      return 'dark-mode';
    } else {
      this.darkMode = false;
      return '';
    };
  }

  handleProjectClick(event: MouseEvent): void {
    event.stopPropagation();
  }

}
