import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routing, ModuleRoutingProviders } from './app.routing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxDropzoneModule } from 'ngx-dropzone';

import { AppComponent } from './app.component';
import { ProductsComponent } from './components/products/products.component';
import { TrolleyComponent } from './components/trolley/trolley.component';
import { ProductComponent } from './components/product/product.component';
import { CatogorysComponent } from './components/catogorys/catogorys.component';
import { LoginComponent } from './components/login/login.component';
import { AddProductCategoryComponent } from './components/add-product-category/add-product-category.component';
import { EditProductCategoryComponent } from './components/edit-product-category/edit-product-category.component';
import { AuthGuard } from './auth.guard';
import { TokenInterceptorService } from './services/token-interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    ProductsComponent,
    TrolleyComponent,
    ProductComponent,
    CatogorysComponent,
    LoginComponent,
    AddProductCategoryComponent,
    EditProductCategoryComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    Routing,
    NgxDropzoneModule
  ],
  providers: [
    ModuleRoutingProviders,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
