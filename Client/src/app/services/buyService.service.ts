import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders} from "@angular/common/http";
import { Observable } from "rxjs";
import { Global } from "./global";
import { TrolleyItem } from "../models/trolleyItem";

@Injectable()
export class BuyService {
    public url: string;

    constructor(
        public _http: HttpClient
    ){
        this.url = Global.url;
    }

    validateStock(Products:TrolleyItem[]):Observable<any> {
        var params = JSON.stringify(Products);
        let headers = new HttpHeaders().set('Content-Type','application/json');
        return this._http.post(this.url+'validateStock',params,{headers})
    }

    updateStock(Products:TrolleyItem[]):Observable<any> {
        var params = JSON.stringify(Products);
        let headers = new HttpHeaders().set('Content-Type','application/json');
        return this._http.post(this.url+'updateStock',params,{headers})
    }
}