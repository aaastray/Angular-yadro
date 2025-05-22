import {Routes} from '@angular/router';

export const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: '/welcome'},
  {path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.routes').then(m => m.WELCOME_ROUTES)},
  {path: 'users', loadChildren: () => import('./pages/users/users.routes').then(m => m.USERS_ROUTES)},
  {path: 'users/:id', loadChildren: () => import('./pages/userInfo/userInfo.routes').then(m => m.USER_INFO_ROUTES)},
  {
    path: 'users/create/new',
    loadChildren: () => import('./pages/userCreate/userCreate.routes').then(m => m.USER_CREATE_ROUTES)
  },
  {path: 'users/:id/edit', loadChildren: () => import('./pages/userEdit/userEdit.routes').then(m => m.USER_EDIT_ROUTES)}
];
