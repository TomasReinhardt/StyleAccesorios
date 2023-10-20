import { Injectable } from "@angular/core";
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Observable, observable } from "rxjs";
import { Global } from "./global";
import { User } from "../models/user";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public url:string;

    constructor(
        private _http: HttpClient,
        private _router: Router
    ){
        this.url = Global.url;
    }

    singUp(user:any):Observable<any> {
        let headers = new HttpHeaders().set('Content-Type','application/json');
        return this._http.post(this.url+'login',user, {headers: headers});
    }

    regsiterUser(User:any):Observable<any> {
        var params = JSON.stringify(User);
        let headers = new HttpHeaders().set('Content-Type','application/json');
        return this._http.post(this.url+'register',params,{headers})
    }

    checkApi(){
        let headers = new HttpHeaders().set('Content-Type','application/json');
        return this._http.get(this.url+'checkapi',{headers:headers});
    }

    getToken() {
        return sessionStorage.getItem('token');
    }

    checkToken(message:String) {
        if(message == 'token no es valido'){
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
            this._router.navigate(['']);
        }
    }

    logOut() {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        this._router.navigate(['login']);
    }

    loggedIn():boolean {
        if (sessionStorage.getItem('token') && sessionStorage.getItem('user')) return true
        else return false;
    }

}