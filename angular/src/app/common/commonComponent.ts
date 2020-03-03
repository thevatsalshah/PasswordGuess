import { Component, OnInit, PLATFORM_ID, Injector, NgZone, APP_ID } from '@angular/core';
import { TransferState, makeStateKey, Title, Meta } from '@angular/platform-browser';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Router, ActivatedRoute } from "@angular/router";
import { CommonService } from './common.service';
import { ErrorMessages } from './errorMessages';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
// import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
// import swal from 'sweetalert';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
@Component({
  selector: 'parent-comp',
  template: ``,
  providers: []
})

export class BaseComponent {

  constructor(injector: Injector) {
    this.router = injector.get(Router)
    this.platformId = injector.get(PLATFORM_ID)
    this.appId = injector.get(APP_ID)
    this.commonService = injector.get(CommonService)
    this.errorMessage = injector.get(ErrorMessages)
    // this.http = injector.get(HttpClient)
    this.titleService = injector.get(Title)
    this.metaService = injector.get(Meta)
    this.activatedRoute = injector.get(ActivatedRoute)
    this.baseUrl = this.commonService._apiUrl;
    this.assetUrl = this.commonService._assetUrl;
    this.toastr = injector.get(ToastrService);
    //console.log('Your current Environment is :', environment)

  }
  public Verticalscrollbar = { axis: 'y', theme: 'light' };
  public horizontalscrollbar = { axis: 'x', theme: 'light' };
  public activatedRoute: ActivatedRoute;
  public errorMessage: ErrorMessages
  // public swal = swal;
  public titleService: Title
  public metaService: Meta
  public platformId: any;
  public appId: any;
  // public http = this.http
  public router: Router;
  public commonService: CommonService;
  public baseUrl;
  public assetUrl;
  public toastr: ToastrService;
  ngOnInit() {

  }
  ngAfterViewInit() {
    //  this.$(".datatable-columnsorting .dropdown-menu").click(function(e) {
    //     e.stopPropagation();
    //   });​
  }
  // *************************************************************//
  //@Purpose : We can use following function to use localstorage
  //*************************************************************//
  setToken(key, value) {
    if (isPlatformBrowser(this.platformId)) {
      window.localStorage.setItem(key, value);
    }
  }
  getToken(key) {
    if (isPlatformBrowser(this.platformId)) {
      return window.localStorage.getItem(key);
    }
  }
  removeToken(key) {
    if (isPlatformBrowser(this.platformId)) {
      window.localStorage.removeItem(key);
    }
  }
  clearToken() {
    if (isPlatformBrowser(this.platformId)) {
      window.localStorage.clear()
    }
  }
  //*************************************************************//

  //*************************************************************//
  //@Purpose : We can use following function to use Toaster Service.
  //*************************************************************//
  popToast(type, title) {
    this.toastr[type](title, '');
    // swal('', title, type);
    // swal({
    //   position: 'center',
    //   type: type,
    //   text: title,
    //   showConfirmButton: false,
    //   timer: 1800,
    //   customClass : 'custom-toaster'
    // })
  }

  /****************************************************************************
  @PURPOSE      : To restrict or allow some values in input.
  @PARAMETERS   : $event
  @RETURN       : Boolen
  ****************************************************************************/
  RestrictSpace(e) {
    if (e.keyCode == 32) {
      return false;
    } else {
      return true;
    }
  }

  AllowNumbers(e) {
    var input;
    if (e.metaKey || e.ctrlKey) {
      return true;
    }
    if (e.which === 32) {
      return false;
    }
    if (e.which === 0) {
      return true;
    }
    if (e.which < 33) {
      return true;
    }
    if (e.which === 43 || e.which === 45) {
      return true;
    }
    input = String.fromCharCode(e.which);
    return !!/[\d\s]/.test(input);
  }

  AllowChar(e) {
    if ((e.keyCode > 64 && e.keyCode < 91) || (e.keyCode > 96 && e.keyCode < 123) || e.keyCode == 8) {
      return true
    } else {
      return false
    }
  }
  /****************************************************************************/

  logout() {
    this.clearToken()
    //this.removeCookie('authToken')
    console.log('logout called ') //call logout api here.
    this.router.navigate(["/login"]);
  }

  /****************************************************************************
  @PURPOSE      : To show validation message
  @PARAMETERS   : <field_name, errorObj?>
  @RETURN       : error message.
  ****************************************************************************/
  showError(field, errorObj?) {
    return this.errorMessage.getError(field, errorObj)
  }
  /****************************************************************************/
  getProfile() {
    var url = this.getToken('profilePic');
    if (url == null || url == ' ') {
      return this.baseUrl + 'assets/images/no-image.jpg'
    } else {
      return url;
    }
  }
}