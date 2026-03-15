import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { PublicSearch } from './app/pages/public-search/public-search';
import { authGuard } from './app/core/guards/auth-guard';

export const appRoutes: Routes = [
    {
        path: '',
        component: PublicSearch
    },
    { 
        path: 'login', 
        loadChildren: () => import('./app/pages/auth/auth.routes') 
    },
    {
        path: 'admin',
        component: AppLayout,
        canActivate: [authGuard],

        children: [
            { path: '', component: Dashboard },
            { path: 'personal', loadComponent: () => import('./app/pages/admin/personal/personal').then(m => m.Personal) },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }
        ]
    },
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: '**', redirectTo: '/notfound' }
];
