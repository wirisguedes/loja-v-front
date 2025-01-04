import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class InterceptorLojaInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

   var autorization = ''+ localStorage.getItem('Authorization');

   if(autorization !== ''){

    console.info('Token JWT: ' + autorization);

    const autRequ = request.clone({
      headers: request.headers.set('Authorazition', autorization)
    });

    return next.handle(autRequ);
   }else{
    return next.handle(request);
   }

    
  }
}
