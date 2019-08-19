import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import html2pdf from 'html2pdf.js';
import {Item} from "../../../interfaces/shopping-page.interface";
import {User} from "../../../interfaces/main-page.interface";
import {Order} from "../../../interfaces/order-page.interface";


@Component({
  selector: 'app-receipt-modal',
  templateUrl: './receipt-modal.component.html',
  styleUrls: ['./receipt-modal.component.css']
})
export class ReceiptModalComponent implements OnInit {
  @Input() inReceiptDetails: {
    user: User,
    order: Order,
    items: Array<Item>,
    total_price: Number,
  };
  receipt_date: Date;
  receipt_number: Number;


  constructor(public activeModal: NgbActiveModal) {
    this.receipt_date = new Date();
    this.receipt_number = Math.floor((Math.random() * 100) + 1);
  }


  convertToPDF() {
    html2pdf().from(document.getElementById('to-download')).set({
      margin: 2,
      filename: 'ShopShop Receipt',
      html2canvas: {allowTaint: false, useCORS: true}
    }).save()
  }


  ngOnInit() {
  }

}
