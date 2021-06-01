import { Injectable } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService{
  isLoggedIn:boolean;
  id:number;
  constructor(private route:ActivatedRoute, private router: Router) {
    route.params.subscribe(
      params =>{
          this.id = parseInt(params['id']);
      }
    );
    
  }
  
  checkLogInStatus(){
    const userData = this.getUserDataFromLocalStorage('userData');
    this.isLoggedIn = !!(userData && userData.id);
    return this.isLoggedIn;
  }
  setUserDataInLocalStorage(variableName: any,data: any){
    localStorage.setItem(variableName,data);
  }

  getUserDataFromLocalStorage(variableName:any){
   return JSON.parse(localStorage.getItem(variableName));
  }
  clearStorage(){
    localStorage.clear();
  }

}
