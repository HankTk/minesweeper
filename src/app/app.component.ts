import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MinesweeperComponent } from './pages/minesweeper/minesweeper.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, TranslateModule, MinesweeperComponent, RouterOutlet],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent
{
    private readonly translate = inject(TranslateService);

    constructor()
    {
        // Initialize Translation
        this.translate.setDefaultLang('en');
        this.translate.use('en');
    }
}
