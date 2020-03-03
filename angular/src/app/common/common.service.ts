import { Component, PLATFORM_ID, Injectable, NgZone, APP_ID, Inject } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { BaseComponent } from './../common/commonComponent';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { config } from '../../assets/config/configs';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from "@angular/router";
@Injectable()

export class CommonService {
	authorised: any = false;
	constructor(public _http: HttpClient, @Inject(PLATFORM_ID) platformId: Object,public toastr:ToastrService,public router:Router) {
		this.platformId = platformId;
		this._apiUrl = this.config.apiUrl;
		this._assetUrl = this.config.assetUrl;
	}

	public config = (<any>config)

	public _apiUrl;
	public _assetUrl;
	public platformId;

	public getToken(key) {
		if (isPlatformBrowser(this.platformId)) {
			return window.localStorage.getItem(key);
		}
	}
	public setToken(key, value) {
		if (isPlatformBrowser(this.platformId)) {
			window.localStorage.setItem(key, value);
		}
	}
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

    /*******************************************************************************************
	@PURPOSE      	: 	Call api.
	@Parameters 	: 	{
							url : <url of api>
							data : <data object (JSON)>
							method : String (get, post)
							isForm (Optional) : Boolean - to call api with form data
							isPublic (Optional) : Boolean - to call api without auth header
						}
	/*****************************************************************************************/
	callApi(url, data, method, isForm?, isPublic?): Promise<any> {
		let headers;
		if (isPublic) {
			headers = new HttpHeaders({ 'content-Type': 'application/json' });
		} else {
			headers = new HttpHeaders({ 'content-Type': 'application/json', 'Authorization': this.getToken('accessToken') });
		}
		if (isForm) {
			headers = new HttpHeaders({ 'Authorization': this.getToken('accessToken') });
		}
		return new Promise((resolve, reject) => {
			if (method == 'post') {
				this._http.post(this._apiUrl + 'api/' + url, data, { headers })
					.subscribe(data => { resolve(data) }, error => { this.showServerError(error) })
			} else if (method == 'get') {
				// let params: { appid: 'id1234', cnt: '5' }
				this._http.get(this._apiUrl + 'api/' + url, { headers: headers, params: data })
					.subscribe(data => { resolve(data) }, error => { this.showServerError(error) })
			}
		})
	}

	// getPeople(term: string = null, fieldName): Observable<any[]> {
	// 	let data = {
	//      filter : {}
	//      }
	//      data.filter[fieldName] = term
	//     let items = []
	//     if(term.length > 2){
	//     	this.callApi('search', data, 'post').then(success=>{
	//              success.data.firstName.forEach(a=>{
	//                items.push({name : a})
	//              })
	//         })
	//     }else{
	//     	items = []
	//     }

	//     return of(items).pipe(delay(500));
	// }

	/*****************************************************************************************/
	// @PURPOSE      	: 	To show server error
	/*****************************************************************************************/
	// public swal = swal;
	showServerError(e) {
		// this.swal({
		//   position: 'center',
		//   type: 'error',
		//   text: 'Internal Server Error',
		//   showConfirmButton: false,
		//   timer: 1800,
		//   customClass : 'custom-toaster'
		// })
		console.log('Internal server error', e)
		if(e.status === 401){
			this.popToast('error','Session expired. Please login again');
			if (isPlatformBrowser(this.platformId)) {
				 window.localStorage.clear();
			}
			this.router.navigate(['/authentication/signin'])
		}
	}
	/****************************************************************************/

}


