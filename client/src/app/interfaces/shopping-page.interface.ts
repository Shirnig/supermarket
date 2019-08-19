export interface Category {
  _id: String;
  category_name: String;
}

export interface Product {
  _id: String;
  name: String;
  category_id: Category;
  price: Number;
  img_path: String;
}

export interface NewProduct {
  name: String;
  category_id: Category;
  price: Number;
  img_path: String;
}


export interface Item {
  _id: String;
  name: String;
  product_id: String;
  category: String;
  img_path: String;
  amount: Number;
  total_price: Number;
}

export interface NewItem {
  product_id: String;
  amount: Number;
}
