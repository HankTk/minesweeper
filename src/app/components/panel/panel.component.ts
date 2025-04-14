import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-panel',
    templateUrl: './panel.component.html',
    styleUrls: ['./panel.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class PanelComponent implements OnInit 
{

  @Input() axTitle = 'Panel title';
  @Input() axShowTitle = 'true';

  /**
   * constructor
   *
   */
  constructor() 
  {
  }

  /**
   * ngOnInit
   *
   */
  ngOnInit() 
  {
  }

}
