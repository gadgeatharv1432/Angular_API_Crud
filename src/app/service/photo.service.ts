import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PhotoService {

    private readonly STORAGE_KEY = 'userProfilePhoto';

    private photoSubject = new BehaviorSubject<string | null>(
        localStorage.getItem(this.STORAGE_KEY)
    );

    photo$ = this.photoSubject.asObservable();
    setPhoto(base64: string): void {
        localStorage.setItem(this.STORAGE_KEY, base64);
        this.photoSubject.next(base64);
    }

    clearPhoto(): void {
        localStorage.removeItem(this.STORAGE_KEY);
        this.photoSubject.next(null);
    }
    
    getCurrentPhoto(): string | null {
        return this.photoSubject.getValue();
    }
}