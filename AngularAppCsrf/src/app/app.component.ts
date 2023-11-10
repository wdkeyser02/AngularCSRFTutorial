import { Component, OnInit } from '@angular/core';
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
export class AppComponent implements OnInit {
  title = 'Spring Boot Tutorial!';
  message01 = 'Api has not been called yet';
  message02 = 'Api has not been called yet';
  userinfo01 = '';
  csrfToken: string = '';
  token: string = '';
  isAuthenticated: boolean = false;
  user: User = {
    username: 'ANONYMOUS',
    details: '',
    roles: '',
  };
  testList: string[] = [];

  constructor(
    private httpClient: HttpClient,
    private tokenExtractor: HttpXsrfTokenExtractor
  ) {
    this.refresh();
    setInterval(() => {
      console.info('setInterval() getTestList');
      this.getTestList();
    }, 60000);
    setInterval(() => {
      console.info('setInterval() userinfo');
      this.userinfo();
    }, 120000);
    setInterval(() => {
      console.info('setInterval() logout');
      this.logout();
    }, 3600000);
  }

  ngOnInit() {
    console.info('Oninit');
  }

  refresh() {
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
    });
  }

  button01() {
    this.httpClient
      .get('/resource1/home', { responseType: 'text', withCredentials: true })
      .subscribe({
        next: (response) => (this.message01 = response),
        error: (error) => (this.message01 = 'Error'),
        complete: () => console.info('complete'),
      });
  }

  button02() {
    this.httpClient
      .post<any>('/resource1/home', this.user.username, {
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
    if (!this.isAuthenticated) {
      window.location.href = '/oauth2/authorization/gateway';
    }
  }

  getTestList() {
    if (this.isAuthenticated) {
      this.httpClient
        .get<any>('/resource1/test', { withCredentials: true })
        .subscribe({
          next: (response) => {
            this.testList = response;
          },
          error: (error) => console.info(error),
          complete: () => console.info('complete'),
        });
    }
  }

  postTestList() {
    if (this.isAuthenticated) {
      this.httpClient
        .post<any>(
          '/resource1/test',
          this.user.username + ' ' + this.randomString(),
          {
            withCredentials: true,
          }
        )
        .subscribe({
          next: (response) => {
            this.testList = response;
          },
          error: (error) => console.info(error),
          complete: () => console.info('complete'),
        });
    }
  }

  randomString() {
    const length = 10;
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }

  logout() {
    this.refresh();
    if (this.isAuthenticated) {
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = '/logout';
      const hiddenField = document.createElement('input');
      hiddenField.type = 'hidden';
      hiddenField.name = '_csrf';
      hiddenField.value = this.token;
      form.appendChild(hiddenField);
      document.body.appendChild(form);
      form.submit();
      this.isAuthenticated = false;
    }
  }
}
