import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  
  constructor(public authService: AuthService, 
    private _apiService: ApiService,
    private _router: Router) { }

  onSubmit(form:NgForm){
    this._apiService.postTypeRequest('/user/signin',form.value)
      .subscribe((res:any)=>{
        console.log("front-end",res)
        if(res!==undefined){
          if(res.status===0){ //success log in
            alert(res.message);
            this.authService.setUserDataInLocalStorage("userData",JSON.stringify(res));
            this.authService.setUserDataInLocalStorage("token",res.token);

            this._router.navigate(['user-home']);
            
          }else{//fail log in
            form.reset();
            alert(res.message)
          }
        }
      })
  }
  isLogin(){
    const userData = this.authService.getUserDataFromLocalStorage('userData');
    return !!(userData && userData.id);
  }
  logout(){
    this.authService.clearStorage();
    this._router.navigate(['']);
  }
}
