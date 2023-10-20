import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AuthService]
})
export class LoginComponent implements OnInit {

  public User:User = {name:"",username:"",password:""};
  public loading:boolean = true;
  public activeForm: string = "Login";
  constructor(
    private _authService: AuthService,
    private _Router: Router
    ) { }

  ngOnInit(): void {
    setTimeout(()=> {
      $("app-login").fadeToggle();
      this.checkApi();
    },100)
  }

  checkApi():void {
    this._authService.checkApi().subscribe(
      response => {
        this.loading = false;
        if(this._authService.loggedIn()){
          this.activeForm = "Register";
        }
      },
      err => {
        console.log("-------------------------");
        console.log(err);
        console.log("-------------------------");
      }
    )
  }


  openForm(formName:string):void {
    if(formName == "Login"){
      if(this._authService.loggedIn()){
        Swal.fire({
          title:'Ya esta logeado',
          icon: 'warning'
        })
      }else{
        this.activeForm = "Login"
      }
    }else {
      if(this._authService.loggedIn()){
        this.activeForm = "Register"
      }else{
        Swal.fire({
          title:'No esta logeado',
          icon: 'warning'
        })
      }
    }

  }

  login(form:any):void {
    $("#Login").fadeToggle();
    setTimeout(() =>{
      this.loading = true;
      this.User.username = this.User.username.trim();
      this._authService.singUp(this.User).subscribe(
        response => {
          sessionStorage.setItem('token', response.token)
          sessionStorage.setItem('user', response.user)
          form.reset();
          this._Router.navigate(['']);
        },
        err => {
          console.log("-------------------------");
          console.log(err.error.message);
          console.log("-------------------------");
          Swal.fire({
            title:err.error.message,
            icon: 'error'
          })
          this.loading = false;
        }
      )
    },300)
  }

  loginValidate(form:any):void {
    if(this.User.username.length < 4) {
      Swal.fire({
        title:'Minimo 4 caracteres en el usuario!',
        icon: 'error'
      })
    }else if(this.User.password.length < 8) {
      Swal.fire({
        title:'Minimo 8 caracteres en la constraseña!',
        icon: 'error'
      })
    }else {
      this.login(form);
    }
  }

  register(form:any):void {
    $("#Login").fadeToggle();
    setTimeout(() =>{
      this.loading = true;
      this._authService.regsiterUser(this.User).subscribe(
        response => {
          this.login(form);
        },
        err => {
          console.log("-------------------------");
          console.log(err.error.message);
          console.log("-------------------------");
          this._authService.checkToken(err.error.error);

          Swal.fire({
            title:err.error.message,
            icon: 'error'
          })
          this.loading = false;
        }
      )
    },300)
  }

  registerValidate(form:any):void {
    if(this.User.name.length < 3){
      Swal.fire({
        title:'Minimo 3 caracteres en el nombre!',
        icon: 'error'
      })
    }else if(this.User.username.length < 4) {
      Swal.fire({
        title:'Minimo 4 caracteres en el usuario!',
        icon: 'error'
      })
    }else if(this.User.password.length < 8) {
      Swal.fire({
        title:'Minimo 8 caracteres en la constraseña!',
        icon: 'error'
      })
    }else {
      this.register(form);
    }
  }

  goOut(direction: string,idProduct:string):void {
    $("app-trolley").fadeToggle();
    setTimeout(() =>{
      
      if(direction=="Product"){
        this._Router.navigate(['product',idProduct]);

      }else if (direction=="Home"){
        this._Router.navigate(['']);

      }else if (direction=="Trolley"){
        this._Router.navigate(['trolley']);

      }else if (direction=="Products"){
        this._Router.navigate(['products','Todos']);

      }

    },300)
  }
}
