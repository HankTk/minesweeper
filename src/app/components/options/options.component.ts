import { Component, OnInit, Input, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MenuService } from '../../services/menu.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
/*
import { ElectronService } from 'ngx-electron';
*/

@Component({
    selector: 'app-options',
    templateUrl: './options.component.html',
    styleUrls: ['./options.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, NgbModule]
})
export class OptionsComponent implements OnInit
{

  @ViewChild('dialog') dialog!: ElementRef;

  @Input() inputTableSize!: number;
  @Output() outputTableSize = new EventEmitter<number>();

  @Input() inputNumberOfMines!: number;
  @Output() outputNumberOfMines = new EventEmitter<number>();

  @Output() saveOptions = new EventEmitter<boolean>();

  public closeResult!: string;

  /**
   * constructor
   *
   * @param {ElectronService} _electronService
   * @param {NgbModal} modalService
   * @param {MenuService} menuService
   */
  constructor(
      /*
    private _electronService: ElectronService,
*/
    private modalService: NgbModal,
    private menuService: MenuService
  )
  {
      const self = this;

      // New Menu Selected
      this.menuService.getEventSelected().subscribe(event =>
      {
          self.open_();
      });
  }

  /**
   * ngOnInit
   *
   */
  ngOnInit()
  {
  }

  /**
   * open
   *
   * @param content
   */
  open_()
  {
      /*
    const win = new this._electronService.remote.BrowserWindow();
    win.setBounds( {
      x: 400, y: 300,
      width: 400,
      height: 300
    });
    win.setTitle('Options');
    win.setResizable(false);

    win.loadURL(url.format({
      protocol: 'file:',
      pathname: path.join(__dirname, '/assets/html/options.html'),
      slashes:  true
    }));
    */
  }

  /**
   * open
   *
   * @param content
   */
  open(content: any)
  {
      // Modal Options
      const options = {
          windowClass: 'createCase'
      };
      this.modalService.open(content, options).result.then((result) =>
      {
          console.log(result);
          if (typeof result !== 'string')
          {
              this.onSubmit(result);
          }
          this.closeResult = `Closed with: ${result}`;
      }, (reason) =>
      {
          console.log(reason);
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
  }


  /**
   * getDismissReason
   *
   * @param reason
   * @returns {string}
   */
  private getDismissReason(reason: any): string
  {
      if (reason === ModalDismissReasons.ESC)
      {
          return 'by pressing ESC';
      }
      else if (reason === ModalDismissReasons.BACKDROP_CLICK)
      {
          return 'by clicking on a backdrop';
      }
      else
      {
          return `with: ${reason}`;
      }
  }

  /**
   * onSubmit
   *
   * @param submittedForm
   */
  onSubmit(submittedForm: { invalid: boolean })
  {
      if (submittedForm.invalid)
      {
          return;
      }

      // Table Size
      this.outputTableSize.emit(this.inputTableSize);

      // Number of Mines
      this.outputNumberOfMines.emit(this.inputNumberOfMines);

      // Emit Save Event
      this.saveOptions.emit(true);
  }

}
