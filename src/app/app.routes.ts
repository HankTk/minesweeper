import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'menu',
        pathMatch: 'full'
    },
    {
        path: 'menu',
        loadComponent: () => import('./pages/menu/menu.component').then(m => m.MenuComponent)
    },
    {
        path: 'game',
        loadComponent: () => import('./pages/minesweeper/minesweeper.component').then(m => m.MinesweeperComponent)
    },
    {
        path: 'settings',
        loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent)
    },
    {
        path: 'high-scores',
        loadComponent: () => import('./pages/high-scores/high-scores.component').then(m => m.HighScoresComponent)
    },
    {
        path: '**',
        redirectTo: 'menu'
    }
];
