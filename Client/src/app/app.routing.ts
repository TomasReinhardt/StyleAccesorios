import { ModuleWithProviders } from "@angular/core";
import { Routes,RouterModule } from "@angular/router";

import { ProductsComponent } from "./components/products/products.component";
import { ProductComponent } from "./components/product/product.component";
import { TrolleyComponent } from "./components/trolley/trolley.component";
import { CatogorysComponent } from "./components/catogorys/catogorys.component";
import { LoginComponent } from "./components/login/login.component";
import { AddProductCategoryComponent } from "./components/add-product-category/add-product-category.component";
import { EditProductCategoryComponent } from "./components/edit-product-category/edit-product-category.component";
import { AuthGuard } from "./auth.guard";

const appRoutes: Routes = [
    {path:"", component:CatogorysComponent},
    {path:"products/:category", component:ProductsComponent},
    {path:"product/:id", component:ProductComponent},
    {path:"trolley", component:TrolleyComponent},
    {path:"login", component:LoginComponent},
    {path:"addData", component:AddProductCategoryComponent,canActivate: [AuthGuard]},
    {path:"editData", component:EditProductCategoryComponent,canActivate: [AuthGuard]},
]

export const ModuleRoutingProviders:any = [];
export const Routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoutes);