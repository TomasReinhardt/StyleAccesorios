import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/models/category';
import { Product } from 'src/app/models/product';
import { Trolley } from 'src/app/models/trolley';
import { TrolleyItem } from 'src/app/models/trolleyItem';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';
import { Global } from 'src/app/services/global';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  providers: [ProductService,AuthService]
})
export class ProductComponent implements OnInit {
  public Product: Product = {id: "",name: "",category: "",price: 0,stock: 0,description: "",imgUrl: ""}
  public cant:number = 1;
  public Trolley: Trolley = {
    products: [],
    productsCant: 0
  }
  public loading: boolean = true;
  public url: string = Global.url;

  constructor(
    public _Router: Router,
    public _Route: ActivatedRoute,
    public _productService: ProductService,
    private _authService: AuthService
  ) {
  }

  ngOnInit(): void {
    setTimeout(()=> {
      $("app-product").fadeToggle();
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
    
        this._Route.params.subscribe(params => {
          let id = params['id'];
          this.getProduct(id);
        });
        this.loading = false;
      },
      err => {
        console.log("-------------------------");
        console.log(err);
        console.log("-------------------------");
      }
    )
  }

  goTrolley():void  {
    if(this.Product.stock >= this.cant && this.cant >= 1){

      var auxProduct: TrolleyItem = {
        item: this.Product,
        itemCant: this.cant
      }
  
      if(this.Trolley.products.length==0){
        this.Trolley.products.push(auxProduct);
      }else {
        for (let i = 0; i < this.Trolley.products.length; i++) {
          if(this.Trolley.products[i].item.id == auxProduct.item.id){
            this.Trolley.products[i].itemCant += auxProduct.itemCant
            break;
          }else if (i==this.Trolley.products.length-1){
            this.Trolley.products.push(auxProduct);
            break;
          }
        }
      }
      
      this.Trolley.productsCant += this.cant;
  
      localStorage.setItem('trolley',JSON.stringify(this.Trolley));
  
      this.goOut('Trolley','');

    }else {
      Swal.fire({
        title:'Stock insuficiente!',
        icon: 'warning'
      })
    }
  }

  goOut(direction: string,idProduct:string):void {
    $("app-product").fadeToggle();
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

  getProduct(id:string):void {
    this._productService.getProduct(id).subscribe(
      response => {
        this.Product = response.result[0];
      },
      err => {
        console.log("-------------------------");
        console.log(err);
        console.log("-------------------------");
      }
    )
  }
}
