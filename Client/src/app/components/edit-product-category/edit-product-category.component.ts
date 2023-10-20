import { Component, OnDestroy, OnInit } from '@angular/core';
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
  selector: 'app-edit-product-category',
  templateUrl: './edit-product-category.component.html',
  styleUrls: ['./edit-product-category.component.css'],
  providers: [CategoryService,ProductService,AuthService,UploadImageService]
})
export class EditProductCategoryComponent implements OnInit {
  public Product: Product = {id: "",name: "",category: "",price: 0,stock: 0,description: "",imgUrl: ""}
  public Category: Category = {id: "",category: ""}
  public searchName:string = "";
  public Trolley: Trolley = {
    products: [],
    productsCant: 0
  }
  public Categorys: Category[] = []
  public Products: Product[] = []
  public filesToUpload: Array<File> = [];
  public loading: boolean = true;

  constructor(
    public _Router: Router,
    public _categoryService: CategoryService,
    public _productService: ProductService,
    private _authService: AuthService,
    private _uploadService: UploadImageService,
    ) { }

  ngOnInit(): void {

    setTimeout(()=>{
      $("app-edit-product-category").fadeToggle();
      this.checkApi()
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

  editProductValidate(formProduct: any):void {
    if(this.Product.name.length < 1){
      Swal.fire({
        title:'Error en el nombre!',
        icon: 'error'
      })
    }else if(this.Product.category <='1') {
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
        title:'Stock menor o igual a 0!',
        icon: 'error'
      })
    }else {
      this.editProduct(formProduct);
    }
  }

  editProduct(formProduct: any):void {
    this.loading = true;
    this._productService.updateProduct(this.Product).subscribe(
      response => {
        if(this.filesToUpload.length <= 0) {
          Swal.fire({
            title:'Producto actualizado!',
            icon: 'success'
          })
          this.closeForm()
          this.loading = false;
        } else {
          this.editImage(this.Product.id,formProduct);
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

  editImage(id: any,formProduct: any):void {
    let filesSend = new FormData();

    for(var i=0; i<this.filesToUpload.length;i++){
      filesSend.append('image', this.filesToUpload[i], this.filesToUpload[i].name);
    }

    this._uploadService.sendImage(id,filesSend).subscribe(
      response => {
        Swal.fire({
          title:'Producto actualizado!',
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

  editCategory(formCategory: any):void {
    if(this.Category.category.length > 0){ 
      this.loading = true;
      this._categoryService.updateCategory(this.Category).subscribe(
        responde => {
          Swal.fire({
            title:'Categoria actualizada!',
            icon: 'success'
          })
          this.closeForm()
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

  deleteProduct(id:string):void {
    Swal.fire({
      title: 'Desea borrar el producto?',
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: `No`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.loading = true;
        this._productService.deleteProduct(id).subscribe(
          response => {
            Swal.fire({
              title:'Producto eliminado!',
              icon: 'success'
            })
            this.getProducts();
            this.closeForm()
            this.loading= false;
          },
          err => {
            console.log("-------------------------");
            console.log(err);
            console.log("-------------------------");
            this._authService.checkToken(err.error.error);
          }
        )
      }else if (result.isDenied) {
        
      }
    })
  }

  deleteCategory(id:string):void {
    Swal.fire({
      title: 'Desea borrar la categoria?',
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: `No`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.loading = true;
        this._categoryService.deleteCategory(id).subscribe(
          response => {
            Swal.fire({
              title:'Categoria eliminada!',
              icon: 'success'
            })
            this.getCategorys();
            this.closeForm()
            this.loading= false;
          },
          err => {
            console.log("-------------------------");
            console.log(err);
            console.log("-------------------------");
            this._authService.checkToken(err.error.error);
          }
        )
      }else if (result.isDenied) {
        
      }
    })
  }

  openList(listName:string):void {
    if(listName == "Product"){
      $("#categoryListEdit").fadeOut();
      setTimeout(()=>{
        $("#productsListEdit").fadeIn().css('display', 'flex');
      },300)
      
    }else if(listName == "Category"){
      $("#productsListEdit").fadeOut();
      setTimeout(()=>{
        $("#categoryListEdit").fadeIn().css('display', 'flex');
      },300)

    }
  }

  openForm(formName: string,id:string):void {

    if(formName == "Product"){
      $("#editProduct").fadeToggle();
      var auxProduct = this.Products.find(productEdit => productEdit.id == id);
      if(auxProduct){
        this.Product = auxProduct;
      }

    }else if(formName == "Category"){
      $("#editCategory").fadeToggle();
      var auxCategory = this.Categorys.find(categoryEdit => categoryEdit.id == id);
      if(auxCategory){
        this.Category = auxCategory;
      }
    }
  }

  closeForm():void {
    $(".editProductCategory").fadeOut();
  }

  goOut(direction: string,idProduct:string):void {
    $("app-edit-product-category").fadeToggle();

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

  getProducts():void {
    this._productService.getProductsEdit().subscribe(
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

  onSelect(event:any) {
    this.filesToUpload.push(...event.addedFiles);
  }
  
  onRemove(event:any) {
    this.filesToUpload.splice(this.filesToUpload.indexOf(event), 1);
  }

}
