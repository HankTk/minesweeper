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
    private isRunning = false;

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
        this.clearTimer();
    }

    /**
   * clearTimer
   *
   */
    clearTimer() 
    {
        if (this.intervalId) 
        {
            clearInterval(this.intervalId);
            this.intervalId = 0;
        }
        this.isRunning = false;
    }

    /**
   * start
   *
   */
    start() 
    {
        if (this.isRunning) 
        {
            return;
        }
        
        this.clearTimer();
        this.seconds = 0;
        this.updateCounter();
        this.isRunning = true;
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
        this.clearTimer();
        this.seconds = 0;
        this.updateCounter();
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
