import { Routes } from '@angular/router';

export const FAVORITE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./smart-components/favourites-list-component/favourites-list-component').then(
        (c) => c.FavoritesRoutesComponent
      ),
  },
];
