// src/utils/Schemas.ts

export interface User {
  user_id: string | null;
  email: string | null;
  username: string | null;
  roles: string[];
  phoneNumber: number | null;
  isEmailConfirmed: boolean;
  joinDate: Date;
}

export interface Ingredient {
  name?: string;
  quantity: number;
  measurements?: string;
  price: number;
  type: string;
  good: number;
  bad: number;
}

export interface AddOn {
  id: number;
  name: string;
  price: number;
  size?: string;
}

export interface VariantAddOn extends AddOn {
  pastryMaterialAddOnId: string;
  amount: number;
  stock: number;
}

export interface Tag {
  designTagId: string;
  designTagName: string;
}

export interface Design {
  designId: string;
  displayName: string;
  cakeDescription: string;
  designPictureUrl: URL;
  displayPictureData: Blob;
  designTags: Tag[];
}

export interface Design {
  pastryMaterialId: string;
  variants: DesignVariant[];
}

export interface DesignVariant {
  variantId: string;
  variantName: string;
  costEstimate: number;
  inStock: boolean;
  addOns: VariantAddOn[];
}

export interface Order {
  type: string;
  pickupDate: string;
  pickupTime: string;
  payment: string;
  orderItem: Suborder;
}

export interface Suborder {
  suborderId: string;
  orderId: string | null;
  designId: string;
  variantId: string;
  size: string;
  flavor: string;
  quantity: number;
}

export interface Notification {
  notifId: string;
  dateCreated: Date;
  message: string;
  isRead: boolean;
}

export interface Message {
  text: string;
  sender: string;
  sender_message_time_sent: Date;
}
