import { Routes } from '@angular/router';

export const FEED_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./container/feed-container/feed-container').then((c) => c.FeedContainer),
  },
];
