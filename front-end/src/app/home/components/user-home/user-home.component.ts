import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';




@Component({
  selector: 'user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.scss']
})
export class UserHomeComponent {
  name:string;
  constructor(private authService:AuthService) {
    const userData = this.authService.getUserDataFromLocalStorage('userData');
    this.name=userData.username;
  }
  

  

}
