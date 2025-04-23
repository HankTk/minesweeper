import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface GameSettings {
  difficulty: 'beginner' | 'intermediate' | 'expert' | 'custom';
  boardSize: number;
  numberOfMines: number;
}

export interface GameState {
  settings: GameSettings;
  isGameOver: boolean;
  isGameWon: boolean;
  time: number;
  flagsRemaining: number;
  tiles: Tile[][];
}

export interface Tile {
  index: number;
  row: number;
  col: number;
  blank: boolean;
  hasMine: boolean;
  mineCount: number;
  event: string;
  active: boolean;
  stateClass: string;
}

@Injectable({
    providedIn: 'root'
})
export class GameService 
{
    private readonly DEFAULT_SETTINGS: GameSettings = {
        difficulty: 'beginner',
        boardSize: 9,
        numberOfMines: 10
    };

    private gameStateSubject = new BehaviorSubject<GameState>(this.createInitialState());
    public gameState$ = this.gameStateSubject.asObservable();

    constructor() 
    {}

    private createInitialState(): GameState 
    {
        return {
            settings: { ...this.DEFAULT_SETTINGS },
            isGameOver: false,
            isGameWon: false,
            time: 0,
            flagsRemaining: this.DEFAULT_SETTINGS.numberOfMines,
            tiles: this.createTilesTable(this.DEFAULT_SETTINGS.boardSize)
        };
    }

    private createTilesTable(size: number): Tile[][] 
    {
        const tiles: Tile[][] = [];
        let index = 0;

        for (let i = 0; i < size; i++) 
        {
            const row: Tile[] = [];
            for (let j = 0; j < size; j++) 
            {
                row.push({
                    index: index++,
                    row: i,
                    col: j,
                    blank: true,
                    hasMine: false,
                    mineCount: 0,
                    event: '',
                    active: true,
                    stateClass: 'blank'
                });
            }
            tiles.push(row);
        }

        return tiles;
    }

    public updateSettings(settings: Partial<GameSettings>): void 
    {
        const currentState = this.gameStateSubject.value;
        const newSettings = { ...currentState.settings, ...settings };
    
        this.gameStateSubject.next({
            ...currentState,
            settings: newSettings,
            flagsRemaining: newSettings.numberOfMines,
            tiles: this.createTilesTable(newSettings.boardSize)
        });
    }

    public startNewGame(): void 
    {
        const state = this.gameStateSubject.value;
        const tiles = this.createTilesTable(state.settings.boardSize);
        this.addMines(tiles, state.settings.numberOfMines);
        this.calculateMineNumbers(tiles);

        this.gameStateSubject.next({
            ...state,
            isGameOver: false,
            isGameWon: false,
            time: 0,
            flagsRemaining: state.settings.numberOfMines,
            tiles
        });
    }

    private addMines(tiles: Tile[][], numberOfMines: number): void 
    {
        const size = tiles.length;
        const totalCells = size * size;
        
        // Create an array of all possible positions
        const positions: number[] = [];
        for (let i = 0; i < totalCells; i++) 
        {
            positions.push(i);
        }
        
        // Shuffle the positions array
        for (let i = positions.length - 1; i > 0; i--) 
        {
            const j = Math.floor(Math.random() * (i + 1));
            [positions[i], positions[j]] = [positions[j], positions[i]];
        }
        
        // Place mines in the first numberOfMines positions
        for (let i = 0; i < numberOfMines; i++) 
        {
            const position = positions[i];
            const row = Math.floor(position / size);
            const col = position % size;
            tiles[row][col].hasMine = true;
        }
    }

    private calculateMineNumbers(tiles: Tile[][]): void 
    {
        const size = tiles.length;

        for (let i = 0; i < size; i++) 
        {
            for (let j = 0; j < size; j++) 
            {
                if (!tiles[i][j].hasMine) 
                {
                    tiles[i][j].mineCount = this.countAdjacentMines(tiles, i, j);
                }
            }
        }
    }

    private countAdjacentMines(tiles: Tile[][], row: number, col: number): number 
    {
        const size = tiles.length;
        let count = 0;

        // Define all possible adjacent positions
        const adjacentPositions = [
            { row: row - 1, col: col - 1 }, // top-left
            { row: row - 1, col: col },     // top
            { row: row - 1, col: col + 1 }, // top-right
            { row: row, col: col - 1 },     // left
            { row: row, col: col + 1 },     // right
            { row: row + 1, col: col - 1 }, // bottom-left
            { row: row + 1, col: col },     // bottom
            { row: row + 1, col: col + 1 }  // bottom-right
        ];

        // Check each adjacent position
        for (const pos of adjacentPositions) 
        {
            if (pos.row >= 0 && pos.row < size && pos.col >= 0 && pos.col < size) 
            {
                if (tiles[pos.row][pos.col].hasMine) 
                {
                    count++;
                }
            }
        }

        // Debug log
        console.log(`Cell at (${row}, ${col}) has ${count} adjacent mines`);
        console.log('Adjacent cells:', adjacentPositions.map(pos => ({
            position: `(${pos.row}, ${pos.col})`,
            hasMine: pos.row >= 0 && pos.row < size && pos.col >= 0 && pos.col < size ? 
                tiles[pos.row][pos.col].hasMine : 'out of bounds'
        })));

        return count;
    }

    public updateTile(row: number, col: number, updates: Partial<Tile>): void 
    {
        const state = this.gameStateSubject.value;
        const tiles = [...state.tiles];
        tiles[row][col] = { ...tiles[row][col], ...updates };

        this.gameStateSubject.next({
            ...state,
            tiles
        });
    }

    public updateTime(time: number): void 
    {
        const state = this.gameStateSubject.value;
        this.gameStateSubject.next({
            ...state,
            time
        });
    }

    public updateFlagsRemaining(count: number): void 
    {
        const state = this.gameStateSubject.value;
        this.gameStateSubject.next({
            ...state,
            flagsRemaining: count
        });
    }

    public setGameOver(isWon: boolean): void 
    {
        const state = this.gameStateSubject.value;
        this.gameStateSubject.next({
            ...state,
            isGameOver: true,
            isGameWon: isWon
        });
    }
} 