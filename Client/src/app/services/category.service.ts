import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders} from "@angular/common/http";
import { Observable } from "rxjs";
import { Global } from "./global";
import { Category } from "../models/category";

@Injectable()
export class CategoryService {
    public url: string;

    constructor(
        public _http: HttpClient
    ){
        this.url = Global.url;
    }

    getCategorys():Observable<any> {
        let headers = new HttpHeaders().set('Content-Type','application/json');
        return this._http.get(this.url+'categorys', {headers: headers});
    }

    addCategory(category: Category):Observable<any> {
        var params = JSON.stringify(category);
        let headers = new HttpHeaders().set('Content-Type','application/json');
        return this._http.post(this.url+'addCategory',params,{headers: headers});
    }

    updateCategory(category: Category):Observable<any> { 
        var params = JSON.stringify(category);
        let headers = new HttpHeaders().set('Content-Type','application/json');
        return this._http.put(this.url+'updateCategory/'+category.id,params,{headers: headers});
    }

    deleteCategory(id:string):Observable<any> {
        let headers = new HttpHeaders().set('Content-Type','application/json');
        return this._http.delete(this.url+'deleteCategory/'+id, {headers: headers});
    }
}