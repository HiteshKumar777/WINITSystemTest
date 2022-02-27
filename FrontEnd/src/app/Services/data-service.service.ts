import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
  local_Url = 'http://localhost:5000';
  constructor(private httpClient: HttpClient) { }
  getCustomers() {
    return this.httpClient.get(this.local_Url+ '/getCustomers');
  }
  getProducts(){
    return this.httpClient.get(this.local_Url+ '/getProducts');
  }
  insertIntoCart(cartdata:any){
    return this.httpClient.post(this.local_Url+ '/postIntoCart',JSON.stringify(cartdata));
  }
  getCartList(){
    return this.httpClient.get(this.local_Url+ '/getCartList');
  }
  fetchCartGroupBy(){
    return this.httpClient.get(this.local_Url+ '/getCartGroupBy');
  }
  updateQTY(QTY:any,cartId:any){
    return this.httpClient.get(this.local_Url+ '/updateQTY/'+ cartId +'/' +QTY);
  }
  deleteCart(cartId:any){
    return this.httpClient.delete(this.local_Url + '/deleteCart/' + cartId);
  }
  updateOrder(orderData:any){
    return this.httpClient.post(this.local_Url + '/updateOrder', JSON.stringify(orderData));
  }
}
