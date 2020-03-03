import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import { HttpClientModule } from "@angular/common/http";
// Common
import { CommonService } from "./common/common.service";
import { ErrorMessages } from "./common/errorMessages";
import { BaseComponent } from "./common/commonComponent";
import { ToastrModule } from "ngx-toastr";
import { LoginComponent } from "./login/login.component";

@NgModule({
  declarations: [BaseComponent, AppComponent, LoginComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: "toast-top-right",
      preventDuplicates: true
    })
  ],
  providers: [CommonService, ErrorMessages],
  bootstrap: [AppComponent]
})
export class AppModule {}
