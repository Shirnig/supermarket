import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";
import { NgbModule, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { LoginComponent } from './components/main-page/login/login.component';
import { AboutComponent } from './components/main-page/about/about.component';
import { InfoComponent } from './components/main-page/info/info.component';
import { SignupPageComponent } from './components/signup-page/signup-page.component';
import { StepOneComponent } from './components/signup-page/step-one/step-one.component';
import { StepTwoComponent } from './components/signup-page/step-two/step-two.component';
import { CustomizeInfoComponent } from './components/main-page/customize-info/customize-info.component';
import { ShoppingPageComponent } from './components/shopping-page/shopping-page.component';
import { CategoriesBarComponent } from './components/shopping-page/categories-bar/categories-bar.component';
import { CartComponent } from './components/shopping-page/cart/cart.component';
import { CatalogComponent } from './components/shopping-page/catalog/catalog.component';
import { OrderPageComponent } from './components/order-page/order-page.component';
import { OrderFormComponent } from './components/order-page/order-form/order-form.component';
import { ProductFormComponent } from './components/shopping-page/product-form/product-form.component';
import { ReceiptModalComponent } from './components/order-page/receipt-modal/receipt-modal.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MainPageComponent,
    LoginComponent,
    AboutComponent,
    InfoComponent,
    SignupPageComponent,
    StepOneComponent,
    StepTwoComponent,
    CustomizeInfoComponent,
    ShoppingPageComponent,
    CategoriesBarComponent,
    CartComponent,
    CatalogComponent,
    OrderPageComponent,
    OrderFormComponent,
    ProductFormComponent,
    ReceiptModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    RouterModule.forRoot([
      {path: '', component: MainPageComponent},
      {path: 'sign-up', component: SignupPageComponent},
      {path: 'shopping/members', component: ShoppingPageComponent},
      {path: 'shopping/admin', component: ShoppingPageComponent},
      {path: 'order', component: OrderPageComponent}
    ])
  ],
  providers: [NgbActiveModal],
  bootstrap: [AppComponent],
  entryComponents: [ReceiptModalComponent]
})
export class AppModule { }
