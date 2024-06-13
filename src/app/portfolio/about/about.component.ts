import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  aboutItems = [
    'Education',
    'Kingston School of Art',
    'Foundation Diploma (2018-19) - Distinction',
    'Graphic design (BA) (2019-2023) - 1st Class',
    'Skills',
    'Camera Operator',
    'Adobe InDesign',
    'Adobe Photoshop',
    'Adobe Permier Pro',
    'Adobe After Effects',
    'Adobe Lightroom/Classic',
    'DaVinci Resolve'
  ];
}
