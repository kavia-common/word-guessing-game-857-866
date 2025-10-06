import { Routes } from '@angular/router';
import { AppComponent } from './app.component';

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    pathMatch: 'full',
    // Basic route metadata
    title: 'Ocean Wordle'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
