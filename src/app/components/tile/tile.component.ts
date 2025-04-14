import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { MessageEventService } from '../../services/messageEvent.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-tile',
    templateUrl: './tile.component.html',
    styleUrls: ['./tile.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class TileComponent implements OnInit, OnDestroy, OnChanges
{

  @Input() tile!: {
    index: number;
    row: number;
    col: number;
    blank: boolean;
    hasMine: boolean;
    mineCount: number;
    event: string;
    active: boolean;
    stateClass: string;
  };
  @Output() opened = new EventEmitter<{
    index: number;
    row: number;
    col: number;
    blank: boolean;
    hasMine: boolean;
    mineCount: number;
    event: string;
    active: boolean;
    stateClass: string;
  }>();
  @Output() flagged = new EventEmitter<{
    index: number;
    row: number;
    col: number;
    blank: boolean;
    hasMine: boolean;
    mineCount: number;
    event: string;
    active: boolean;
    stateClass: string;
  }>();

  /**
   * constructor
   *
   */
  constructor(
    private messageEventService: MessageEventService
  )
  {
      const self = this;
      self.messageEventService.varSubject.subscribe(event =>
      {
          if (event.name === 'over')
          {
              self.updateState();
          }
          else if (event.name === 'around')
          {
              self.updateAround(event);
          }
      });
  }

  /**
   * Angular Lifecycle Hooks: OnInit
   */
  ngOnInit(): void
  {
      const self = this;
      /*
    self.stateClass = 'blank';
    */
  }

  /**
   * Angular Lifecycle Hooks: OnDestroy
   */
  ngOnDestroy(): void
  {
  }

  /**
   * ngOnChanges
   *
   */
  ngOnChanges()
  {
      const self = this;
  }

  /**
   * onClick
   *
   */
  onClick()
  {
      const self = this;

      // if tile is not active
      if (!self.tile.active)
      {
          return;
      }

      // Set State
      self.setState();
  }

  /**
   * onRightClick
   *
   * @returns {boolean}
   */
  onRightClick(event: MouseEvent)
  {
      const self = this;

      // if tile is not active
      if (!self.tile.active)
      {
          return;
      }

      // When tile is already opened
      if (!self.tile.blank)
      {
          return;
      }

      if (self.tile.stateClass !== 'bombflagged')
      {
          self.tile.stateClass = 'bombflagged';
      }
      else
      {
          self.tile.stateClass = 'blank';
      }
      self.flagged.emit(self.tile);
  }

  /**
   * onClick
   *
   */
  setState()
  {
      const self = this;

      // Set Covered false
      self.tile.blank = false;

      // When tile has mine
      if (self.tile.hasMine)
      {
          self.tile.stateClass = 'bombdeath';

          // emit event
          self.tile.event = 'bombdeath';
          self.opened.emit(self.tile);
          return;
      }

      // When tile has number
      if (self.tile.mineCount > 0)
      {
          self.tile.stateClass = 'open' + this.tile.mineCount;
          self.tile.event = 'number';
          self.opened.emit(self.tile);
          return;
      }

      // Set open0
      self.tile.event = 'open0';
      self.opened.emit(self.tile);
      self.tile.stateClass = 'open0';
  }

  /**
   * updateState
   *
   */
  updateState()
  {
      const self = this;
      if (!self.tile.active && self.tile.hasMine && self.tile.blank)
      {
          self.tile.stateClass = 'mine';
          self.tile.blank = false;
      }
  }

  /**
   * updateAround
   *
   */
  updateAround(event: { index: number })
  {
      const self = this;
      const index = event.index;

      // When tile index is not match
      if (self.tile.index !== index)
      {
          return;
      }

      // When tile has Mine
      if (self.tile.hasMine)
      {
          return;
      }

      // When tile is already opened
      if (!self.tile.blank)
      {
          return;
      }

      // When tile is flagged
      if (self.tile.stateClass === 'bombflagged')
      {
          return;
      }

      // Set Covered false
      self.tile.blank = false;

      // When tile has number
      if (self.tile.mineCount > 0)
      {
          self.tile.stateClass = 'open' + this.tile.mineCount;
          self.tile.event = 'number';
      }
      else
      {
          // Set open0 and emit event to open adjacent tiles
          self.tile.stateClass = 'open0';
          self.tile.event = 'open0';
          self.opened.emit(self.tile);
      }
  }

}
