import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { Trolley } from 'src/app/models/trolley';
import { AuthService } from 'src/app/services/auth.service';
import { BuyService } from 'src/app/services/buyService.service';
import { Global } from 'src/app/services/global';
import { ProductService } from 'src/app/services/product.service';
import Swal from 'sweetalert2';
declare var MercadoPago:any;

@Component({
  selector: 'app-trolley',
  templateUrl: './trolley.component.html',
  styleUrls: ['./trolley.component.css'],
  providers: [AuthService,BuyService,ProductService]
})
export class TrolleyComponent implements OnInit {
  public Trolley: Trolley = {
    products: [],
    productsCant: 0
  }
  public loading: boolean = true;
  public url: string = Global.url;
  public totalOrder = 0;

  constructor(
    public _Router: Router,
    public _Route: ActivatedRoute,
    private _authService: AuthService,
    private _buyService: BuyService,
    private _productService: ProductService
  ) { 
  }

  ngOnInit(): void {
    setTimeout(()=> {
      $("app-trolley").fadeToggle();
      this.checkApi();
    },100)
  }

  checkApi():void {
    this._authService.checkApi().subscribe(
      response => {

        var auxTrolley = localStorage.getItem('trolley');

        if(auxTrolley){
          this.Trolley = JSON.parse(auxTrolley);
          this.Trolley.products.sort((a, b) => {
            if (a.item.id > b.item.id) {
              return 1;
            }
            if (a.item.id < b.item.id){
              return -1;
            }
            return 0;
          });
          
          this.calcTotal();

          this.loading = false;
        }
      },
      err => {
        console.log("-------------------------");
        console.log(err);
        console.log("-------------------------");
      }
    )
  }

  calcTotal():void {
    this.totalOrder = 0;
    for (let i = 0; i < this.Trolley.products.length; i++) {
      this.totalOrder += this.Trolley.products[i].itemCant*this.Trolley.products[i].item.price;
    }
  }

  deleteItem(id:string):void {
    for (let i = 0; i < this.Trolley.products.length; i++) {
      if(this.Trolley.products[i].item.id == id){
        this.Trolley.productsCant -= this.Trolley.products[i].itemCant;
        this.Trolley.products.splice(i,1);
        break;
      }
    }
    localStorage.setItem('trolley',JSON.stringify(this.Trolley));
    this.calcTotal();
  }

  addItem(id:string):void {
    for (let i = 0; i < this.Trolley.products.length; i++) {
      if(this.Trolley.products[i].item.id == id){
        this.Trolley.productsCant += 1;
        this.Trolley.products[i].itemCant += 1;
        break;
      }
    }
    localStorage.setItem('trolley',JSON.stringify(this.Trolley));
    this.calcTotal();
  }

  removeItem(id:string):void {
    for (let i = 0; i < this.Trolley.products.length; i++) {
      if(this.Trolley.products[i].item.id == id){
        this.Trolley.productsCant -= 1;
        this.Trolley.products[i].itemCant -= 1;

        if( this.Trolley.products[i].itemCant == 0){
          this.Trolley.products.splice(i,1);
        }

        break;
      }
    }
    localStorage.setItem('trolley',JSON.stringify(this.Trolley));
    this.calcTotal();
  }

  goOut(direction: string,idProduct:string):void {
    $("app-trolley").fadeToggle();
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

  stockValidate():void {
    if(this.Trolley.productsCant <= 0){
      Swal.fire({
        title:'No tiene productos',
        icon: 'warning'
      })
    }else {
      this.loading = true;
      this._buyService.validateStock(this.Trolley.products).subscribe(
        async response => {
          //Se valida si el stock y los precios estan correctos
          if(response.price.length > 0 || response.stock.length > 0){
            this.loading = false;
            Swal.fire({
              title: 'Precios o stock incorreto!! \n Actualizar productos?',
              showDenyButton: true,
              confirmButtonText: 'Si',
              denyButtonText: `No`,
            }).then((result) => {
              if (result.isConfirmed) {
                let idList = "";
                for (let i = 0; i < this.Trolley.products.length; i++) {
                  idList += this.Trolley.products[i].item.id+'-'
                }
                this._productService.getProductsValidate(idList).subscribe(
                  response => {  
                    for(let i = 0; i < this.Trolley.products.length; i++){
                      if(this.Trolley.products[i].item.stock != 0){
                        this.Trolley.products[i].item = response.result[i];
                      }
                    }
                    localStorage.setItem('trolley',JSON.stringify(this.Trolley));
                  },
                  err => {
                    this.loading = false;
                    console.log("-------------------------");
                    console.log(err);
                    console.log("-------------------------");
                  }
                )
              }
            })

          }else {
            //Aca se realiza la compra

            var auxOrder = '------------------------------------------%0A';
            var dateOrder: any[] = []
            for (let i = 0; i < this.Trolley.products.length; i++) {
              let auxProduct = '-'+this.Trolley.products[i].item.name+' x'+this.Trolley.products[i].itemCant+' ==> $'+(this.Trolley.products[i].item.price*this.Trolley.products[i].itemCant)+'%0A';
              auxOrder += auxProduct;
            }
            auxOrder += '------------------------------------------%0AEl total del pedido es: $'+this.totalOrder;
          
            const { value: formValues } = await Swal.fire({
              title: 'Será redirigido a WhatsApp \n Rellene los campos',
              html:
                '<input id="nameInput" class="swal2-input" placeholder="Nombre...">' +
                '<input id="direccionInput" class="swal2-input" placeholder="Dirección...">'+
                '<input id="codigoPostalInput" class="swal2-input" placeholder="Codigo postal...">',
              focusConfirm: false,
              showCloseButton: true,
              preConfirm: () => {
                if((document.getElementById('nameInput') as HTMLInputElement).value != '' && (document.getElementById('direccionInput') as HTMLInputElement).value != '' && (document.getElementById('codigoPostalInput') as HTMLInputElement).value != ''){
                  return [
                    (document.getElementById('nameInput') as HTMLInputElement).value,
                    (document.getElementById('direccionInput') as HTMLInputElement).value,
                    (document.getElementById('codigoPostalInput') as HTMLInputElement).value
                  ]
                }else {
                  return false;
                }
              }
            })
            
            if (formValues) {
              if(formValues[0] && formValues[1] && formValues[2]){
                let Order = 'Pedido de: *'+formValues[0]+'*%0A'+'Dirección: *'+formValues[1]+'*%0ACodigo Postal:'+formValues[2]+'%0A'+auxOrder;
                this.verfPay('https://wa.me/543492649194?text='+Order);
              }
            }
          }

          this.loading = false;

        },
        err => {
          this.loading = false;
          console.log("-------------------------");
          console.log(err);
          console.log("-------------------------");
        }
      )
    }
  }

  verfPay(url:string):void {
    this._buyService.updateStock(this.Trolley.products).subscribe(
      response => {
        var auxTrolley = localStorage.removeItem('trolley');
        window.location.href = url;
      },
      err => {
        console.log("-------------------------");
        console.log(err);
        console.log("-------------------------");
      }
    )
  }
}
