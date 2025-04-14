import {Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-counter',
    templateUrl: './counter.component.html',
    styleUrls: ['./counter.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class CounterComponent implements OnInit, OnDestroy 
{

    private counts = 0;
    public message = '';
    public counterClass1 = 'number-n';
    public counterClass2 = 'number-n';
    public counterClass3 = 'number-n';

    /**
   * ngOnInit
   *
   */
    ngOnInit() 
    {
        this.reset();
    }

    /**
   * ngOnDestroy
   *
   */
    ngOnDestroy() 
    {
    }

    /**
   * reset
   *
   */
    reset() 
    {
        this.counts = 0;
        this.updateCounter();
    }

    /**
   * setNumber
   *
   */
    setNumber(newNumber: number) 
    {
        this.counts = newNumber;
        this.updateCounter();
    }

    /**
   * countUp
   *
   */
    public countUp() 
    {
        this.counts++;
        this.updateCounter();
    }

    /**
   * countDown
   *
   */
    public countDown() 
    {
        this.counts--;
        this.updateCounter();
    }

    /**
   * updateCounter
   *
   */
    private updateCounter() 
    {
        const strCounter = this.paddingZeros(this.counts, 3);
        this.counterClass1 = 'number-' + strCounter.charAt(0);
        this.counterClass2 = 'number-' + strCounter.charAt(1);
        this.counterClass3 = 'number-' + strCounter.charAt(2);
    }

    /**
   * paddingZeros
   *
   * @param num
   * @param size
   * @returns {string}
   */
    private paddingZeros(num: number, size: number): string 
    {
        const s = '000' + num;
        return s.substr(s.length - size);
    }

}
