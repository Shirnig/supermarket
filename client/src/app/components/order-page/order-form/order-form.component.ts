import {Component, Input, OnInit} from '@angular/core';
import { OrderPageService } from "../../../services/order-page.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReceiptModalComponent } from "../receipt-modal/receipt-modal.component";
import {Order, ReceiptDetails} from "../../../interfaces/order-page.interface";
import {Item} from "../../../interfaces/shopping-page.interface";
import {User} from "../../../interfaces/main-page.interface";


@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css']
})
export class OrderFormComponent implements OnInit {
  @Input() inUserDetails: User;
  @Input() inCartItems: Array<Item>;
  @Input() inTotalPrice: Number;
  private service;
  order: Order;
  error: String;
  ordered: Boolean;
  receipt_details: ReceiptDetails;

  constructor(service: OrderPageService, private modalService: NgbModal) {
    this.service = service;
    this.order = {city: '', street: '', date_to_send: '', credit_card: null};
    this.error = '';
    this.ordered = false;

  }

  open() {
    const modalRef = this.modalService.open(ReceiptModalComponent, { size: 'lg' });
    modalRef.componentInstance.inReceiptDetails = this.receipt_details;
  }

  populateInputs(){
    if(this.inUserDetails){
      this.order.city = this.inUserDetails.city;
      this.order.street = this.inUserDetails.street;
    }
  }

  validateFields(){
    const {city,street,date_to_send,credit_card} = this.order
    return city&&street&&date_to_send&&credit_card;
  }

  createOrder(){
    if(this.validateFields()){this.service.createOrder(this.order).subscribe(()=>{
      this.error = '';
      this.ordered = true;
      this.receipt_details = {user: this.inUserDetails, order: this.order, items: this.inCartItems, total_price: this.inTotalPrice};
      this.service.onCreateOrder();
    }, err => this.error = err.error);
    }else{
      this.error = 'field is empty'
    }
  }


  ngOnInit() {

  }

}
