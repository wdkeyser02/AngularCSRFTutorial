import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpXsrfTokenExtractor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class CsrfInterceptor implements HttpInterceptor {
  constructor(private tokenExtractor: HttpXsrfTokenExtractor) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    console.info('CsrfInterceptor');
    let requestMethod: string = request.method;
    requestMethod = requestMethod.toLowerCase();
    console.info(requestMethod);
    if (
      requestMethod &&
      (requestMethod === 'post' ||
        requestMethod === 'delete' ||
        requestMethod === 'put')
    ) {
      const headerName = 'X-XSRF-TOKEN';
      let token = this.tokenExtractor.getToken() as string;
      console.info('TOKEN: ' + token);
      if (token !== null && !request.headers.has(headerName)) {
        request = request.clone({
          headers: request.headers.set(headerName, token),
        });
        console.info('CsrfInterceptor CSRF Token: ' + token);
      }
    }

    return next.handle(request);
  }
}
