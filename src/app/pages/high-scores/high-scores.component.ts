import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';

interface HighScore {
  difficulty: string;
  time: number;
  date: Date;
  player: string;
}

@Component({
    selector: 'app-high-scores',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatButtonModule,
        MatCardModule,
        MatTableModule,
        MatTabsModule
    ],
    templateUrl: './high-scores.component.html',
    styleUrls: ['./high-scores.component.scss']
})
export class HighScoresComponent 
{
    displayedColumns: string[] = ['rank', 'player', 'time', 'date'];
  
    // Sample data - replace with actual data from a service
    beginnerScores: HighScore[] = [
        { difficulty: 'beginner', time: 45, date: new Date(), player: 'Player 1' },
        { difficulty: 'beginner', time: 52, date: new Date(), player: 'Player 2' },
        { difficulty: 'beginner', time: 58, date: new Date(), player: 'Player 3' }
    ];

    intermediateScores: HighScore[] = [
        { difficulty: 'intermediate', time: 120, date: new Date(), player: 'Player 1' },
        { difficulty: 'intermediate', time: 135, date: new Date(), player: 'Player 2' },
        { difficulty: 'intermediate', time: 142, date: new Date(), player: 'Player 3' }
    ];

    expertScores: HighScore[] = [
        { difficulty: 'expert', time: 240, date: new Date(), player: 'Player 1' },
        { difficulty: 'expert', time: 255, date: new Date(), player: 'Player 2' },
        { difficulty: 'expert', time: 262, date: new Date(), player: 'Player 3' }
    ];
} 