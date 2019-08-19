import {Item} from "./shopping-page.interface";

export interface Order {
  city: String;
  street: String;
  date_to_send: String;
  credit_card: Number;
}

export interface ReceiptDetails {
  user: Object;
  order: Object;
  items: Array<Item>;
  total_price: Number;
}
