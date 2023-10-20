import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders} from "@angular/common/http";
import { Observable } from "rxjs";
import { Global } from "./global";
import { Product } from "../models/product";

@Injectable()
export class ProductService {
    public url: string;

    constructor(
        public _http: HttpClient
    ){
        this.url = Global.url;
    }

    getProduct(id:string):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/json');
        return this._http.get(this.url+'product/'+id, {headers: headers});
    }

    getProducts():Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/json');
        return this._http.get(this.url+'products', {headers: headers});
    }

    getProductsEdit():Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/json');
        return this._http.get(this.url+'productsEdit', {headers: headers});
    }

    getProductsValidate(ids:string):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/json');
        return this._http.get(this.url+'productsValidate/'+ids,{headers: headers});
    }

    addProduct(product: Product):Observable<any>{
        var params = JSON.stringify(product);
        let headers = new HttpHeaders().set('Content-Type','application/json');
        return this._http.post(this.url+'addProduct',params,{headers: headers});
    }

    updateProduct(product: Product):Observable<any>{
        var params = JSON.stringify(product);
        let headers = new HttpHeaders().set('Content-Type','application/json');
        return this._http.put(this.url+'updateProduct/'+product.id,params,{headers: headers});
    }

    deleteProduct(id:string):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/json');
        return this._http.delete(this.url+'deleteProduct/'+id, {headers: headers});
    }
    
}