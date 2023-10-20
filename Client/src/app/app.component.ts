import { Component, HostListener, OnInit } from '@angular/core';
import { Trolley } from './models/trolley';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AuthService]
})
export class AppComponent implements OnInit {
  title = 'StyleAccess';
  
  public logged: boolean = false;
  public Trolley: Trolley = {
    products: [],
    productsCant: 0,
  }
  constructor(
    private _authService: AuthService
  ) {}

  ngOnInit(): void {
    if(!localStorage.getItem('trolley')){
      localStorage.setItem('trolley',JSON.stringify(this.Trolley));
    }
    this.logged = this._authService.loggedIn();
  }

  @HostListener('document:click', ['$event'])
  clickout():void {
    this.logged = this._authService.loggedIn();
  }

  ngDoCheck():void {
    this.logged = this._authService.loggedIn();
  }

  scrollTop():void {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  logout():void {
    this._authService.logOut();
  }
}
