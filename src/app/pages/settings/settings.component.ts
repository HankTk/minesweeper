import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatSliderModule
    ],
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent 
{
    difficulty: string = 'beginner';
    boardSize: number = 9;
    numberOfMines: number = 10;

    get maxMines(): number 
    {
        return Math.floor((this.boardSize * this.boardSize) * 0.9);
    }

    saveSettings() 
    {
    // TODO: Implement settings save logic
        console.log('Saving settings:', {
            difficulty: this.difficulty,
            boardSize: this.boardSize,
            numberOfMines: this.numberOfMines
        });
    }
} 