import { Routes } from '@angular/router';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { AboutComponent } from './portfolio/about/about.component';
import { ContactComponent } from './portfolio/contact/contact.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: PortfolioComponent },
    { path: 'about', component: AboutComponent },
    { path: 'contact', component: ContactComponent }];
