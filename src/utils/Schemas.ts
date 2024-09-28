// src/utils/Schemas.ts

import { Dayjs } from "dayjs";

export interface User {
  id: string | null;
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
  pastryMaterialAddOnId?: string;
  amount: number;
  stock: number;
}

export interface Shape {
  id: string;
  name: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface Design {
  id: string;
  name: string;
  description: string;
  pictureUrl?: URL;
  pictureData: Blob;
  tags: Tag[];
  shapes: Shape[];
}

export interface Design {
  pastryMaterialId: string;
  variants: DesignVariant[];
}

export interface DesignVariant {
  id: string;
  name: string;
  costEstimate: number;
  inStock: boolean;
  addOns: VariantAddOn[];
}

export interface Order {
  id: string;
  type: "normal" | "rush";
  pickupDateTime: Dayjs;
  payment: "half" | "full";
  suborders: Suborder[];
}

export interface ManagementOrder extends Order {
  customerId: string;
  customerName: string;
}

export interface Suborder {
  id: string;
  orderId?: string;
  designId: string;
  variantId: string;
  size: string;
  flavor: string;
  quantity: number;
}

export interface Notification {
  id: string;
  created: Date;
  message: string;
  isRead: boolean;
}

export interface Message {
  text: string;
  sender: string;
  sender_message_time_sent: Date;
}

export interface Units {
  Mass: readonly string[];
  Volume: readonly string[];
  Count: readonly string[];
}
