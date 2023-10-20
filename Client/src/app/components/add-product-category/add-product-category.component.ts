import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from 'src/app/models/category';
import { Product } from 'src/app/models/product';
import { Trolley } from 'src/app/models/trolley';
import { AuthService } from 'src/app/services/auth.service';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { UploadImageService } from 'src/app/services/uploadImage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-product-category',
  templateUrl: './add-product-category.component.html',
  styleUrls: ['./add-product-category.component.css'],
  providers: [CategoryService,ProductService,AuthService,UploadImageService]
})
export class AddProductCategoryComponent implements OnInit {
  public Product: Product = {id: "",name: "",category: "",price: 0,stock: 0,description: "",imgUrl: ""}
  public Category: Category = {id: "",category: ""}
  public filesToUpload: Array<File> = [];
  public loading: boolean = true;
  public Trolley: Trolley = {
    products: [],
    productsCant: 0
  }
  public Categorys: Category[] = []

  constructor(
    public _Router: Router,
    private _categoryService: CategoryService,
    private _productService: ProductService,
    private _authService: AuthService,
    private _uploadService: UploadImageService,
    ) { }

  ngOnInit(): void {
    setTimeout(()=> {
      $("app-add-product-category").fadeToggle();
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

  addProductValidate(formProduct: any):void {
    if(this.Product.name.length < 1){
      Swal.fire({
        title:'Error en el nombre!',
        icon: 'error'
      })
    }else if(this.Product.category <='0') {
      Swal.fire({
        title:'Seleccione una categoria!',
        icon: 'error'
      })
    }else if(this.Product.price <= 0) {
      Swal.fire({
        title:'Precio menor a 0!',
        icon: 'error'
      })
    }else if(this.Product.stock < 0 ) {
      Swal.fire({
        title:'Stock menor a 0!',
        icon: 'error'
      })
    }else  {
      this.addProduct(formProduct);
    }
  }

  addProduct(formProduct: any){
    this.loading = true;
    this._productService.addProduct(this.Product).subscribe(
      response => {
        if(this.filesToUpload.length <= 0) {
          Swal.fire({
            title:'Producto cargado!',
            icon: 'success'
          })
          formProduct.reset()
          this.loading= false;
        }else {
          this.uploadImage(response.id,formProduct);
        }

      },
      err => {
        console.log("-------------------------");
        console.log(err);
        console.log("-------------------------");
        this._authService.checkToken(err.error.error);
      }
    )
  }

  uploadImage(id: string,formProduct: any):void {
    let filesSend = new FormData();

    for(var i=0; i<this.filesToUpload.length;i++){
      filesSend.append('image', this.filesToUpload[i], this.filesToUpload[i].name);
    }

    this._uploadService.sendImage(id,filesSend).subscribe(
      response => {
        Swal.fire({
          title:'Producto cargado!',
          icon: 'success'
        })
        formProduct.reset()
        this.loading = false;
      },
      err => {
        console.log("-------------------------");
        console.log(err);
        console.log("-------------------------");
        this._authService.checkToken(err.error.error);
      }
    )

  }

  addCategory(formCategory: any):void {
    if(this.Category.category.length > 0){
      this.loading = true;
      this._categoryService.addCategory(this.Category).subscribe(
        response => {
          Swal.fire({
            title:'Categoria cargada!',
            icon: 'success'
          })
          formCategory.reset()
          this.getCategorys();
          this.loading= false;
        },
        err => {
          console.log("-------------------------");
          console.log(err);
          console.log("-------------------------");
          this._authService.checkToken(err.error.error);
        }
      )
    }else {
      Swal.fire({
        title:'Error en el nombre!',
        icon: 'error'
      })
    }   
  }

  openForm(formName: string):void {

    if(formName == "Product"){
      $("#addProduct").fadeToggle();
      this.Product = {id: "",name: "",category: "",price: 0,stock: 0,description: "",imgUrl: ""};

    }else if(formName == "Category"){
      $("#addCategory").fadeToggle();
      this.Category = {id: "",category: ""};
    }
  }

  closeForm():void {
    $(".addProductCategory").fadeOut();
  }

  goOut(direction: string,idProduct:string):void {
    $("app-add-product-category").fadeToggle();
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

  onSelect(event:any) {
    this.filesToUpload.push(...event.addedFiles);
  }
  
  onRemove(event:any) {
    this.filesToUpload.splice(this.filesToUpload.indexOf(event), 1);
  }

}
