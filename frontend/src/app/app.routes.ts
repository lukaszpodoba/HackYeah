import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((r) => r.AUTH_ROUTES),
  },
  {
    path: 'feed',
    loadChildren: () => import('./features/feed/feed.routes').then((r) => r.FEED_ROUTES),
  },

  { path: '', redirectTo: '/feed', pathMatch: 'full' },
  { path: '**', redirectTo: '/auth' },
];
