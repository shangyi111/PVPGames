import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AuthModule } from './auth/auth.module';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { HomeModule } from './home/home.module';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';


import { AppComponent } from './app.component';
import { AuthService } from './services/auth.service';
import { ApiService } from './services/api.service';
import { AuthGuardService } from './services/auth-guard.service';
import { WebSocketService } from './services/web-socket.service';

const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HomeModule,
    AuthModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [
    AuthService,
    ApiService,
    AuthGuardService,
    WebSocketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
