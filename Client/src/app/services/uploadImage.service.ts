import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders} from "@angular/common/http";
import { Global } from "./global";
import { Observable } from "rxjs";

@Injectable()
export class UploadImageService {
    public url: string = Global.url;

    constructor(
        public _http: HttpClient
    ){

    }

    sendImage(id:string,files:FormData):Observable<any> {
        return this._http.post(this.url+'uploadImage/'+id,files);
    }

}