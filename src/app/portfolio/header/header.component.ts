import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
})
export class HeaderComponent {

  darkMode = input<boolean>();

  isDarkMode(): string {
    return this.darkMode() ? 'dark-mode' : '';
  }

}
