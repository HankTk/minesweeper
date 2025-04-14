import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MenuService 
{
    // Subject - Selected Case
    private selectedItem: any = new Subject<void>();

    /**
     * constructor
     *
     */
    constructor() 
    { }

    /**
     * sendEventSelected
     *
     * @param event
     */
    sendEventSelected(event: any) 
    {
        const self = this;
        /*
            self.selectedItem.next({ selectedItem: event.selectedItem });
        */
        console.log(event);
        self.selectedItem.next({ selectedItem: event });
        /*
            self.selectedItem = event.selectedItem;
        */
        self.selectedItem = event;
    }

    /**
     * getEventSelected
     *
     * @returns {Observable<any>}
     */
    getEventSelected(): Observable<any> 
    {
        const self = this;
        return self.selectedItem.asObservable();
    }
}
