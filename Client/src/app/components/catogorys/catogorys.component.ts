import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from 'src/app/models/category';
import { Trolley } from 'src/app/models/trolley';
import { AuthService } from 'src/app/services/auth.service';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-catogorys',
  templateUrl: './catogorys.component.html',
  styleUrls: ['./catogorys.component.css'],
  providers: [CategoryService,AuthService]
})
export class CatogorysComponent implements OnInit {
  public Categorys: Category[] = []
  public Trolley: Trolley = {
    products: [],
    productsCant: 0
  }
  public loading: boolean = true;

  constructor(
    private _Router: Router,
    private _categoryService: CategoryService,
    private _authService: AuthService
  ) { }

  ngOnInit(): void {
    setTimeout(()=> {
      $("app-catogorys").fadeToggle();
      this.checkApi();
    },100)
  }

  checkApi():void {
    this._authService.checkApi().subscribe(
      response => {
        var auxTrolley = localStorage.getItem('trolley');
        if(auxTrolley){
          this.Trolley = JSON.parse(auxTrolley);
        }
        this.getCategorys();
        this.loading = false;
      },
      err => {
        console.log("-------------------------");
        console.log(err);
        console.log("-------------------------");
      }
    )
  }

  goOut(direction: string,idProduct:string):void {
    $("app-catogorys").fadeToggle();
    setTimeout(() =>{
      
      if(direction=="Product"){
        this._Router.navigate(['product',idProduct]);

      }else if (direction=="Home"){
        this._Router.navigate(['']);

      }else if (direction=="Trolley"){
        this._Router.navigate(['trolley']);

      }else if (direction=="Products"){
        this._Router.navigate(['products','Todos']);

      }else if (direction=="Categorys"){
        this._Router.navigate(['products',idProduct]);

      }

    },300)
  }

  getCategorys():void {
    this._categoryService.getCategorys().subscribe(
      response => {
        this.Categorys = response.result;
      },
      err=> {
        console.log("-------------------------");
        console.log(err);
        console.log("-------------------------");
      }
    )
  }

}
