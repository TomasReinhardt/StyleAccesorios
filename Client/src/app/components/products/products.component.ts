import { Component, OnDestroy, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category';
import * as $ from 'jquery';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { Trolley } from 'src/app/models/trolley';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { AuthService } from 'src/app/services/auth.service';
import { Global } from 'src/app/services/global';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  providers: [CategoryService,ProductService]
})
export class ProductsComponent implements OnInit {
  public Categorys: Category[] = []
  public Products: Product[] = []
  public Trolley: Trolley = {
    products: [],
    productsCant: 0
  }
  public actualCategory:string = "";
  public serachCategory:string = "";
  public loading: boolean = true;
  public url: string = Global.url;

  constructor(
    public _Router: Router,
    public _Route: ActivatedRoute,
    public _categoryService: CategoryService,
    public _productService: ProductService,
    private _authService: AuthService,
    
  ) {
  }

  ngOnInit(): void {
    setTimeout(()=> {
      $("app-products").fadeToggle();
      this.checkApi();
    },100)
  }

  checkApi():void {
    this._authService.checkApi().subscribe(
      response => {
        this._Route.params.subscribe(params => {
          let category = params['category'];
          this.actualCategory = category;
    
          if(this.actualCategory == "Todos"){
            this.serachCategory = "";
          }else {
            this.serachCategory = this.actualCategory;
          }
          
        });
    
        window.addEventListener('click', function(e){
          let actualElement = e.target as Element;
          if(actualElement.className != "categoryLink" && actualElement.className != "titleText"){
            $("#floatingMenu").fadeOut();
            $("#productsList").fadeIn();
          }
        });
    
        var auxTrolley = localStorage.getItem('trolley');
        if(auxTrolley){
          this.Trolley = JSON.parse(auxTrolley);
        }
    
        this.getCategorys();
        this.getProducts();
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
    $("app-products").fadeToggle();
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

  toggleFloatingMenu():void {
    $("#floatingMenu").fadeToggle();
    $("#productsList").fadeToggle();
  }

  goCategory(newCategory:string):void {
    this.actualCategory = newCategory
    this._Router.navigate(['products',newCategory]);
    $("#floatingMenu").fadeToggle();
    $("#productsList").fadeToggle();
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

  getProducts():void {
    this._productService.getProducts().subscribe(
      response => {
        this.Products = response.result;
      },
      err=> {
        console.log("-------------------------");
        console.log(err);
        console.log("-------------------------");
      }
    )
  }

}
