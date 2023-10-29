import { Component } from '@angular/core';
import { HttpClient, HttpXsrfTokenExtractor } from '@angular/common/http';

export interface User {
  username: string;
  details: string;
  roles: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Spring Boot Tutorial!';
  message01 = 'Api has not been called yet';
  message02 = 'Api has not been called yet';
  userinfo01 = '';
  csrfToken: string = '';
  token: string = '';
  isAuthenticated: boolean = false;
  user: User = { username: '', details: '', roles: '' };

  constructor(
    private httpClient: HttpClient,
    private tokenExtractor: HttpXsrfTokenExtractor
  ) {
    this.token = this.tokenExtractor.getToken() as string;
    this.httpClient.get<User>('/me', { withCredentials: true }).subscribe({
      next: (response: User) => {
        this.user = response;
        if (response.username != 'ANONYMOUS') {
          this.isAuthenticated = true;
        } else {
          this.isAuthenticated = false;
        }
      },

      error: (error) => console.info(error),
      complete: () => console.info('complete'),
    });
  }

  ngOninit(): void {}

  button01() {
    this.httpClient
      .get('/resource1', { responseType: 'text', withCredentials: true })
      .subscribe({
        next: (response) => (this.message01 = response),
        error: (error) => (this.message01 = 'Error'),
        complete: () => console.info('complete'),
      });
  }

  button02() {
    this.httpClient
      .post<any>('/resource1', this.user.username, {
        responseType: 'text' as 'json',
        withCredentials: true,
      })
      .subscribe({
        next: (response) => (this.message02 = response),
        error: (error) => (this.message02 = 'Error'),
        complete: () => console.info('complete'),
      });
  }

  userinfo() {
    this.httpClient
      .get('/me', { responseType: 'text', withCredentials: true })
      .subscribe({
        next: (response) => (this.userinfo01 = response),
        error: (error) => (this.userinfo01 = 'Error'),
        complete: () => console.info('complete'),
      });
  }

  login() {
    window.location.href = '/oauth2/authorization/gateway';
  }
}
