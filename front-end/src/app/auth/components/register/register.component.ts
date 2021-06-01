import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  
  constructor(private _apiService:ApiService,
              private _router:Router) { }

  onSubmit(form: NgForm){
    this._apiService.postTypeRequest('/user/register', form.value)
      .subscribe((res:any)=>{
        if(res.status!==undefined){
          if(res.status===0){
            alert(res.message)
            form.reset();
          }else{
            alert(res.message);
            this._router.navigate(['login']);
          }
        }
      })  
  }

}
