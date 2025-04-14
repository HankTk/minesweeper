import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MessageEventService 
{
    public varSubject = new Subject<any>();

    constructor() 
    { }

    sendEvent(event: any) 
    {
        /*
        this.varSubject.next({ name: event.name})
        */
        this.varSubject.next(event);
    }
}
