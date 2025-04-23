import { Injectable } from '@angular/core';
import { GameSettings } from './game.service';

export interface HighScore {
  difficulty: string;
  time: number;
  date: Date;
  player: string;
}

@Injectable({
    providedIn: 'root'
})
export class StorageService 
{
    private readonly SETTINGS_KEY = 'minesweeper_settings';
    private readonly HIGH_SCORES_KEY = 'minesweeper_high_scores';

    constructor() 
    {}

    public saveSettings(settings: GameSettings): void 
    {
        localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
    }

    public loadSettings(): GameSettings | null 
    {
        const settings = localStorage.getItem(this.SETTINGS_KEY);
        return settings ? JSON.parse(settings) : null;
    }

    public saveHighScore(score: HighScore): void 
    {
        const scores = this.loadHighScores();
        scores.push(score);
    
        // Sort by time and keep only top 10
        scores.sort((a, b) => a.time - b.time);
        const topScores = scores.slice(0, 10);
    
        localStorage.setItem(this.HIGH_SCORES_KEY, JSON.stringify(topScores));
    }

    public loadHighScores(): HighScore[] 
    {
        const scores = localStorage.getItem(this.HIGH_SCORES_KEY);
        if (!scores) 
        {
            return [];
        }

        const parsedScores = JSON.parse(scores);
        return parsedScores.map((score: any) => ({
            ...score,
            date: new Date(score.date)
        }));
    }

    public getHighScoresByDifficulty(difficulty: string): HighScore[] 
    {
        return this.loadHighScores()
            .filter(score => score.difficulty === difficulty)
            .sort((a, b) => a.time - b.time);
    }

    public clearHighScores(): void 
    {
        localStorage.removeItem(this.HIGH_SCORES_KEY);
    }

    public clearSettings(): void 
    {
        localStorage.removeItem(this.SETTINGS_KEY);
    }

    public clearAll(): void 
    {
        this.clearHighScores();
        this.clearSettings();
    }
} 