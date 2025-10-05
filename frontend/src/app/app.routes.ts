import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((r) => r.AUTH_ROUTES),
  },
  {
    path: 'favorites',
    loadChildren: () =>
      import('./features/favourites/favorite.routes').then((r) => r.FAVORITE_ROUTES),
  },
  {
    path: 'feed',
    loadChildren: () => import('./features/feed/feed.routes').then((r) => r.FEED_ROUTES),
  },
  {
    path: 'route-planner',
    loadChildren: () =>
      import('./features/route-planner/route-planner.routes').then((r) => r.ROUTE_PLANNER_ROUTES),
  },

  { path: '', pathMatch: 'full', redirectTo: 'auth/login' },

  { path: '**', redirectTo: 'auth/login' },
];
