import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DataServiceService } from '../Services/data-service.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  customers:any;
  products:any;
  cartlist:any;
  CartForm: FormGroup = new FormGroup({});
  OrderForm:FormGroup = new FormGroup({});
  customerorder:any;
  formArray:any = [];
  constructor(private Service:DataServiceService,private fb:FormBuilder) { }

  ngOnInit(): void {
    this.CartForm = this.fb.group({
      customerid:[''],
      productsid:new FormArray([])
    });
    this.OrderForm = this.fb.group({
      customerid:new FormArray([])
    });
    this.getCustomer();
    this.getProducts();
    this.getCardList();
    this.fetchCartGroupBy();
}
  getCustomer(){
    this.Service.getCustomers().subscribe(res =>{
      console.log(res);
      this.customers = JSON.parse(JSON.stringify(res)) ;
    },
    error => {
      console.log(error);
    });
  }
  getProducts(){
    this.Service.getProducts().subscribe(res =>{
      console.log(res);
      this.products = JSON.parse(JSON.stringify(res));
      this.getCardList();
    },
    error => {
      console.log(error);
    });
  }
  addToCart(){
    console.log('Working', this.CartForm.value);
    this.Service.insertIntoCart(this.CartForm.value).subscribe(res =>{
      console.log('Inserted into cart');
      this.getCardList();
      this.fetchCartGroupBy();
      this.refresh();
    }, error =>{
      console.log(error);
    })
    this.CartForm.reset();
  }
  refresh(): void {
    window.location.reload();
}
  onCheckChange(event:any) {
    this.formArray = this.CartForm.get('productsid') as FormArray;
  
    /* Selected */
    if(event.target.checked){
      this.formArray.push(new FormControl(event.target.value));
    }
    else{
      // find the unselected element
      let i: number = 0;
  
      this.formArray.controls.forEach((ctrl: { value: any; }) => {
        if(ctrl.value == event.target.value) {
          this.formArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }
  onCheckChangeOrder(event:any) {
    console.log('CheckChangeOrder is calling',event);
    const formArray: FormArray = this.OrderForm.get('customerid') as FormArray;
  
    /* Selected */
    if(event.target.checked){
      formArray.push(new FormControl(event.target.value));
    }
    else{
      // find the unselected element
      let i: number = 0;
  
      formArray.controls.forEach((ctrl) => {
        if(ctrl.value == event.target.value) {
          formArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }
  getCardList(){
    this.Service.getCartList().subscribe(res =>{
      console.log('Cart Data', res);
      this.cartlist = JSON.parse(JSON.stringify(res));
    },error=>{
      console.log(error);
    })
  }
  updateQTY(QTY:any, cartId:any){
    this.Service.updateQTY(QTY,cartId).subscribe(res =>{
      console.log(res);
      this.getCardList();
    }, error => {
      console.log(error);
    })
  }
  deleteCart(cartId:any){
    this.Service.deleteCart(cartId).subscribe(res =>{
      console.log(res);
      this.getCardList();
      this.fetchCartGroupBy();
    },error =>{
      console.log(error);
    })
  }
  fetchCartGroupBy(){
    this.Service.fetchCartGroupBy().subscribe(res =>{
      console.log('Group by data',res);
      this.customerorder = JSON.parse(JSON.stringify(res));
    },error =>{
      console.log(error)
    })
  }
  order(){
    console.log('calling',this.OrderForm.value);
    this.Service.updateOrder(this.OrderForm.value).subscribe(res =>{
      console.log(res);
      this.getCardList();
      this.fetchCartGroupBy();
      this.refresh();
    }, error =>{
      console.log(error);
    })
    this.OrderForm.reset();
  }
}
