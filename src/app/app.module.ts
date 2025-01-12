import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { InterceptorLojaInterceptor } from './interceptor/interceptor-loja.interceptor';
import { HomeComponent } from './home/home/home.component';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login/login.component';
import { guardiaoGuard } from './guard/guardiao.guard';
import { NavbarComponent } from './navbar/navbar.component';
import { CategoriaProdutoComponent } from './components/categoria-produto/categoria-produto.component';
import { MarcaProdutoComponent } from './components/marca-produto/marca-produto.component';

export const appRoutes : Routes = [

  {path: 'login', component: LoginComponent},
  {path: '', component: AppComponent},
  {path: 'home', component: HomeComponent, canActivate:[guardiaoGuard], data: {role:['ROLE_ADMIN', 'ROLE_USER']}},
  {path: 'categoria-produto', component: CategoriaProdutoComponent, canActivate:[guardiaoGuard], data: {role:['ROLE_ADMIN', 'ROLE_USER']}},
  {path: 'marca-produto', component: MarcaProdutoComponent, canActivate:[guardiaoGuard], data: {role:['ROLE_ADMIN', 'ROLE_USER']}}
];

export const routes = RouterModule.forRoot(appRoutes);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    NavbarComponent,
    CategoriaProdutoComponent,
    MarcaProdutoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    routes
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: InterceptorLojaInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
