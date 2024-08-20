import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { HeaderComponent } from './header/header.component';
import { MediaService } from './services/media.service';
import { MediaModel } from './model/media-model';
import { MediaType } from './model/media-type';
import { TextService } from './services/text.service';
import { ProjectLinksModel } from './model/project-links-model';
import { TextModel } from './model/text-model';

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

  protected readonly MediaType = MediaType;

  darkMode = false;
  videoDarkMode = false;
  projectDarkMode = false;
  isLoading = true;

  currentMediaIndex = 0;
  currentMedia: MediaModel = new MediaModel();
  currentProject = '';
  currentTextBox = '';
  projects: { [key: string]: MediaModel[] } = {};

  projectLinks: ProjectLinksModel[] = [];
  textBoxes: TextModel[] = [];

  private router = inject(Router);
  private imageService = inject(MediaService);
  private textService = inject(TextService);

  ngOnInit(): void {
    this.router.navigateByUrl('#from-stone-to-stone');
    this.preloadImages();
    this.setupRouterEvents();
    this.projectLinks = this.textService.projectLinks;
    this.textBoxes = this.textService.textBoxes;
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
    this.currentMediaIndex = 0;
    this.currentMedia = this.projects[projectId][0];
    if (this.currentProject === 'rio-ferdinand-foundation' || this.currentProject === 'un-dance') {
      this.projectDarkMode = true;
    } else {
      this.projectDarkMode = false;
    }
  }

  getBackgroundImage(): string {
    const currentProject = this.projects[this.currentProject];
    if (currentProject[this.currentMediaIndex].type === MediaType.Image) {
      this.videoDarkMode = false;
      return `url(${currentProject[this.currentMediaIndex].path})`;
    } else if (currentProject[this.currentMediaIndex].type === MediaType.Pdf) {
      const fileName = this.getFileName(currentProject[this.currentMediaIndex].path);
      const textBox = this.textBoxes.find(box => box.name === fileName);
      if (textBox) {
        this.currentTextBox = textBox.text;
      }
      this.videoDarkMode = false;
      return '';
    } else {
      this.videoDarkMode = true;
      return '';
    }
  }

  changeBackground(): void {
    this.currentMediaIndex = (this.currentMediaIndex + 1) % this.projects[this.currentProject].length;
    this.currentMedia = this.projects[this.currentProject][this.currentMediaIndex];
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

  private getFileName(path: string): string {
    const segments = path.split('/');
    const fileNameWithExtension = segments[segments.length - 1];
    const fileName = fileNameWithExtension.split('.')[0];
    return fileName;
  }

}
