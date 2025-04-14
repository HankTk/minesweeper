import {Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-timer',
    templateUrl: './timer.component.html',
    styleUrls: ['./timer.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class TimerComponent implements OnInit, OnDestroy 
{

    public intervalId = 0;
    private seconds = 0;

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
    }

    /**
   * ngOnDestroy
   *
   */
    ngOnDestroy() 
    {
        this.clearTimer();
    }

    /**
   * clearTimer
   *
   */
    clearTimer() 
    {
        clearInterval(this.intervalId);
    }

    /**
   * start
   *
   */
    start() 
    {
        this.seconds = 0;
        this.countUp();
    }

    /**
   * stop
   *
   */
    stop() 
    {
        this.clearTimer();
        this.updateCounter();
    }

    /**
   * reset
   *
   */
    reset() 
    {
        this.seconds = 0;
    }

    /**
   * countUp
   *
   */
    private countUp() 
    {
        this.intervalId = window.setInterval(() => 
        {
            this.seconds++;
            this.updateCounter();
        }, 1000);
    }

    /**
   * updateCounter
   *
   */
    private updateCounter() 
    {
        const strCounter = this.paddingZeros(this.seconds, 3);
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
