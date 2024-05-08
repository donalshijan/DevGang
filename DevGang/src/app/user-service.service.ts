import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  private _username: string='';
  private _isLoggedIn: boolean = false;
  private _currentProjectId: string = '';
  setUsername(username: string) {
    this._username = username;
  }

  getUsername(): string {
    return this._username;
  }

  // Optionally, clear user information on logout
  clearUser() {
    this._username = '';
  }
  updateLoggedInStatus(status: boolean){
    this._isLoggedIn=status;
  }
  getLoggedInStatus():boolean{
    return this._isLoggedIn
  }
  setCurrentProjectId(id: string){
    this._currentProjectId=id;
  }
  getCurrentProjectId(){
    return this._currentProjectId
  }
}
