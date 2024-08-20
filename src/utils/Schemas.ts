// src/utils/Schemas.ts

export interface User {
  id: string | null;
  email: string | null;
  username: string | null;
  roles: string[] | null;
  phone_number: number | null;
  is_email_confirmed: boolean;
  join_date: string;
}

export interface Ingredient {
  name: string;
  quantity: number;
  measurements: string;
  price: number;
  type: string;
}

export interface Design {
  design_id: string;
  display_name: string;
  cake_description: string;
  //design_picture_url: string;
  display_picture_data: string;
  design_tags: Tag[];
  pastry_material_id: string;
  variants: DesignVariant[];
}

export interface DesignVariant {
  variant_id: string;
  variant_name: string;
  cost_estimate: number;
  in_stock: boolean;
  add_ons: AddOn[];
}

export interface AddOn {
  pastry_material_add_on_id: string;
  add_on_id: number;
  add_on_name: string;
  amount: number;
  stock: number;
  price: number;
}

export interface Tag {
  design_tag_id: string;
  design_tag_name: string;
}

export interface Order {
  orderId: string;
  customerId: string;
  type: string;
  pickup: string;
  suborders: Suborder[];
}

export interface Suborder {
  suborderId: string;
  orderId: string | null;
  customerId: string;
  employeeId: string | null;
  designId: string;
  variantId: string;
  size: string;
  flavor: string;
  quantity: number;
}
