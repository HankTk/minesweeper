import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TileComponent } from '../../components/tile/tile.component';
import { MessageEventService } from '../../services/messageEvent.service';
import { TimerComponent } from '../../components/timer/timer.component';
import { CounterComponent } from '../../components/counter/counter.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OptionsComponent } from '../../components/options/options.component';

declare global {
  interface Window {
    electronAPI: {
      getBrowserWindow: () => any;
    }
  }
}

interface Tile {
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

@Component({
    selector: 'app-minesweeper',
    templateUrl: './minesweeper.component.html',
    styleUrls: ['./minesweeper.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, NgbModalModule, NgbModule, TileComponent, CounterComponent, TimerComponent, OptionsComponent]
})
export class MinesweeperComponent implements OnInit
{

  @ViewChild('timer', { static: true }) timer!: TimerComponent;
  @ViewChild('counter', { static: true }) counter!: CounterComponent;

  // Table Size
  public tableSize = 9;
  public numberOfMines = 10;

  // Square, Width and Height
  public tableWidth = (this.tableSize * 24) + 'px';
  public tableHeight = (this.tableSize * 24) + 'px';

  // Tiles
  public tilesMatrix: Tile[][] = [];
  public tilesArray: Tile[] = [];

  // Message
  public message = '';

  private timerStarted = false;

  public stateClass = 'facesmile';

  /**
   * constructor
   *
   * @param {ElementRef} elRef
   * @param {MessageEventService} messageEventService
   */
  constructor(
    private elRef: ElementRef,
    private messageEventService: MessageEventService
  )
  {}

  /**
   * ngOnInit
   *
   */
  ngOnInit()
  {

      const self = this;

      // Initialize
      self.initialize();
  }

  /**
   * onClickNewGame
   *
   */
  onClickNewGame()
  {
      const self = this;

      // Initialize
      self.initialize();
  }

  /**
   * initialize
   *
   */
  initialize()
  {

      const self = this;

      self.stateClass = 'facesmile';

      // Initialize
      self.resetTilesTable();

      // Create Tiles
      self.createTilesTable();

      // Add Mines
      self.addMines();

      // Calculate Mine Numbers
      self.calculateAllNumbers();
  }

  /**
   * resetTilesTable
   *
   */
  resetTilesTable()
  {
      const self = this;

      // Table size
      self.tableWidth = (this.tableSize * 24) + 'px';
      self.tableHeight = (this.tableSize * 24) + 'px';

      // Initialize message area
      self.message = '';
      self.tilesMatrix = [];
      self.tilesArray = [];

      // Counter Reset/Start
      self.counter.reset();
      /*
    self.counter.setNumber(this.numberOfMines);
    */

      // Timer Reset/Start
      self.timer.reset();
      self.timer.stop();
      self.timerStarted = false;

      // Set Window Size
      try
      {
          const win = window.electronAPI?.getBrowserWindow();
          if (win)
          {
              win.setBounds({
                  // x: 300, y: 200,
                  // width: (this.tableSize * 24) + 74,
                  // height: (this.tableSize * 24) + 118,
                  width: (this.tableSize * 24) + 4,
                  height: (this.tableSize * 24) + 92,
              });
          }
      }
      catch (error)
      {
          console.error('Failed to set window bounds:', error);
      }
  }

  /**
   * createTilesTable
   *
   */
  createTilesTable()
  {
      const self = this;
      let ix = 0;
      const rowElement = [];
      for (let i = 0; i < this.tableSize; i++)
      {
          const colElement = [];
          for (let j = 0; j < this.tableSize; j++)
          {
              const tileObject = {
                  index: ix,
                  row: i,
                  col: j,
                  blank: true,
                  hasMine: false,
                  mineCount: 0,
                  event: '',
                  active: true,
                  stateClass: 'blank'
              };
              colElement.push(tileObject);
              self.tilesArray.push(tileObject);
              ix++;
          }
          rowElement.push(colElement);
      }
      self.tilesMatrix = rowElement;
  }

  /**
   * addMines
   *
   */
  addMines()
  {
      const self = this;
      const totalCells = this.tableSize * this.tableSize;
      
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
      for (let i = 0; i < this.numberOfMines; i++) 
      {
          const position = positions[i];
          self.tilesArray[position].hasMine = true;
      }
  }

  /**
   * calculateAllNumbers
   *
   */
  calculateAllNumbers()
  {
      const self = this;
      for (let i = 0; i < (this.tableSize * this.tableSize  - 1); i++)
      {
          if (!self.tilesArray[i].hasMine)
          {
              self.tilesArray[i].mineCount = self.calculateNumber(i);
          }
      }
  }

  /**
   * calculateNumber
   *
   */
  calculateNumber(ix: number)
  {
      const self = this;
      const row = Math.floor(ix / this.tableSize);
      const col = ix % this.tableSize;
      let count = 0;

      // Check all 8 adjacent positions
      for (let i = -1; i <= 1; i++) 
      {
          for (let j = -1; j <= 1; j++) 
          {
              if (i === 0 && j === 0) 
              {
                  continue; // Skip the current position
              }
              
              const newRow = row + i;
              const newCol = col + j;
              
              // Check if the new position is within bounds
              if (newRow >= 0 && newRow < this.tableSize && 
                  newCol >= 0 && newCol < this.tableSize) 
              {
                  const position = newRow * this.tableSize + newCol;
                  if (self.tilesArray[position].hasMine) 
                  {
                      count++;
                  }
              }
          }
      }
      return count;
  }

  /**
   * onOpened
   *
   * @param event
   */
  onOpened(event: any)
  {
      const self = this;

      // Start timer if not already started
      if (!self.timerStarted)
      {
          self.timer.start();
          self.timerStarted = true;
          self.stateClass = 'faceclock';
      }

      // Check Has Won
      if (self.checkHasWon(event))
      {
          return;
      }

      // Check HasLose
      if (self.checkHasLose(event))
      {
          return;
      }

      // Only check adjacent squares if the clicked tile is blank (mineCount === 0)
      if (event.mineCount === 0)
      {
          self.checkAdjacentSquares(event);
      }
  }

  /**
   * onFlagged
   *
   * @param event
   */
  onFlagged(event: any)
  {
      const self = this;

      // Check Has Won
      if (event.stateClass === 'bombflagged')
      {
          self.counter.countUp();
      }
      else
      {
          self.counter.countDown();
      }
  }

  /**
   * checkHasWon
   *
   * @param event
   */
  checkHasWon(event: { stateClass: string })
  {
      const self = this;
      const filteredResult = self.tilesArray.filter(function(item, index, array)
      {
          return (!item.hasMine && !item.blank);
      });
      const totalTiles = self.tableSize * self.tableSize;
      const remainingTiles = totalTiles - filteredResult.length;
      if (remainingTiles === this.numberOfMines)
      {
          self.message = 'You won!';
          self.stateClass = 'facewin';

          // Stop Timer
          self.timer.stop();
          return true;
      }
      return false;
  }

  /**
   * checkHasLose
   *
   * @param event
   */
  checkHasLose(event: { stateClass: string, event?: string })
  {
      const self = this;
      const filteredResult = self.tilesArray.filter(function(item, index, array)
      {
          return (item.hasMine && !item.blank);
      });
      if (filteredResult.length > 0)
      {
          self.message = 'You Lose!';
          self.stateClass = 'facedead';


          // When hit mine
          if (event.event === 'bombdeath')
          {

              // Stop Timer
              self.timer.stop();

              // Open remaining mines
              self.openRemaining();

              return true;
          }
      }
      return false;
  }

  /**
   * openRemaining
   *
   */
  openRemaining()
  {
      const self = this;

      // Set active false
      for (let i = 0; i < self.tilesArray.length; i++)
      {
          self.tilesArray[i].active = false;
      }

      // Emit event
      self.messageEventService.sendEvent({name: 'over'})
  }

  /**
   * checkAdjacentSquares
   *
   */
  checkAdjacentSquares(event: { index: number })
  {
      const self = this;
      const row = Math.floor(event.index / this.tableSize);
      const col = event.index % this.tableSize;

      // Check all 8 adjacent positions
      for (let i = -1; i <= 1; i++) 
      {
          for (let j = -1; j <= 1; j++) 
          {
              if (i === 0 && j === 0) 
              {
                  continue; // Skip the current position
              }
              
              const newRow = row + i;
              const newCol = col + j;
              
              // Check if the new position is within bounds
              if (newRow >= 0 && newRow < this.tableSize && 
                  newCol >= 0 && newCol < this.tableSize) 
              {
                  const position = newRow * this.tableSize + newCol;
                  const tile = self.tilesArray[position];
                  
                  // Only open if the tile is blank and not a mine
                  if (tile.blank && !tile.hasMine) 
                  {
                      // Open the tile
                      tile.blank = false;
                      
                      // If the tile is a blank tile (mineCount === 0), recursively open adjacent tiles
                      if (tile.mineCount === 0) 
                      {
                          tile.stateClass = 'open0';
                          tile.event = 'open0';
                          // Recursively open adjacent tiles
                          self.checkAdjacentSquares({ index: position });
                      }
                      // If the tile has a number, just show the number
                      else 
                      {
                          tile.stateClass = 'open' + tile.mineCount;
                          tile.event = 'number';
                      }
                  }
              }
          }
      }
  }

  /**
   * onSaveOptions
   *
   * @param event
   */
  onSaveOptions(event: any)
  {
      const self = this;
      // Initialize
      self.initialize();
  }

}
