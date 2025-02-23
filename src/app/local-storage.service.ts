import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  // Érték beállítása a local storage-ban
  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  // Érték megszerzése a local storage-ból
  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  // Meghatározott érték eltávolítása a local storage-ból
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  // Összes érték eltávolítása a local storage-ból
  clear(): void {
    localStorage.clear();
  }
}
