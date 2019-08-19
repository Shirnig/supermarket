export interface UserData {
  user: User;
  action: Action;
}

export interface User {
  _id: String;
  is_admin: Boolean;
  first_name: String;
  last_name: String;
  city: String;
  street: String;
}


export interface Action {
  type: String;
  details: {
    order?:Order,
    cart?:Cart
  };
}

export interface Order {
  date_of_order: Date;
  final_price: Number;
}

export interface Cart {
  total_cart_price: Number;
  date_created: Date;
  ordered: Boolean;
}

export interface StoreInfo {
  orders: Number;
  products: Number;
}

export interface Login {
  email: String;
  password: String;
}
