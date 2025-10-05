import { Routes } from '@angular/router';

export const ROUTE_PLANNER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./smart-components/route-planner-component/route-planner-component').then(
        (c) => c.RoutePlannerComponent
      ),
  },
];
