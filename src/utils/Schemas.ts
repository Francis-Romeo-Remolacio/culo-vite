// src/utils/Schemas.ts

import { Dayjs } from "dayjs";
import * as TimePeriods from "./TimePeriods";
import { number } from "yup";

export interface User {
  id: string;
  email: string;
  username: string;
  roles: string[];
  phoneNumber?: number;
  isEmailConfirmed: boolean;
  joinDate: Date;
}

export interface Employee extends User {
  employed: Date;
}

export interface Customer extends User {
  timesOrdered: number;
}

export interface Ingredient {
  id?: string;
  name: string;
  quantity: number;
  measurement?: string;
  price: number;
  type: string;
  good: number;
  bad: number;
  isActive: boolean;
}

export interface Batch {
  id: string;
  itemId: string;
  price: number;
  quantity: number;
  lot: string;
  expiration: Date;
  created: Date;
  lastModified: Date;
  lastModifiedBy: string;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
  size?: string;
}

export interface ManagementAddOn extends AddOn {
  measurement: string;
  created: Date;
  lastModified: Date;
}

export interface OrderAddOn extends Omit<AddOn, "price"> {
  quantity: number;
}

// export interface Shape {
//   id: string;
//   name: string;
// }

export interface Tag {
  id: string;
  name: string;
}

export interface Design {
  id: string;
  name: string;
  description: string;
  shape: "round" | "heart" | "rectangle" | "custom";
  customShape?: string;
  tags: Tag[];
}

export interface Design {
  pastryMaterialId: string;
  variants: DesignVariant[];
}

export interface DesignVariant
  extends Omit<PastryMaterialVariant, "ingredients"> {
  cost: number;
  inStock: boolean;
}

export interface PastryMaterial {
  id?: string;
  designId?: string;
  designName?: string;
  otherCost: {
    additionalCost: number;
    multiplier: number;
  };
  variants: PastryMaterialVariant[];
  created?: Date;
  lastModified?: Date;
}

export interface PastryMaterialVariant {
  id?: string;
  name: string;
  costEstimate?: number;
  costExactEstimate?: number;
  ingredients: PastryMaterialIngredient[];
  ingredientImportance?: [];
  addOns: PastryMaterialAddOn[];
  inStock?: boolean;
  created?: Date;
  lastModified?: Date;
  sizeHeart?: number; // For heart shape
  rectangleX?: number; // For rectangle width
  rectangleY?: number; // For rectangle height
  tiers?: string[]; // For tiers
}

export interface PastryMaterialIngredient
  extends Pick<Ingredient, "id" | "name" | "type" | "measurement"> {
  relationId?: string;
  amount: number;
  ingredientType: "INV";
  created?: Date;
  lastModified?: Date;
}

export interface PastryMaterialAddOn extends Pick<AddOn, "id" | "name"> {
  relationId?: string;
  amount: number;
  created?: Date;
  lastModified?: Date;
}

export interface Order {
  id: string;
  type: "normal" | "rush";
  pickupDateTime: Dayjs | Date;
  payment: "full" | "half";
  price: { full: number; half?: number };
  status: string;
  listItems: { suborders: Suborder[]; customOrders: CustomOrder[] };
}

export interface ManagementOrder extends Omit<Order, "listItems"> {
  customerId: string;
  customerName: string;
  status: string;
  isActive: boolean;
  listItems: {
    suborders: ManagementSuborder[];
    customOrders: ManagementCustomOrder[];
  };
}

export interface Suborder {
  id: string;
  orderId?: string;
  designId: string;
  designName?: string;
  pastryId: string;
  description: string;
  size: string;
  color: string;
  flavor: string;
  quantity: number;
  price: number;
  addOns: OrderAddOn[];
}

export interface CustomOrder extends Omit<Suborder, "pastryId"> {
  cover: string;
}

export interface ManagementSuborder extends Required<Suborder> {
  customerId: string;
  employeeId: string;
  employeeName: string;
  customerName: string;
  created: Date;
  lastModified: Date;
  lastModifiedBy: string;
  isActive: boolean;
}

export interface ManagementCustomOrder extends Required<CustomOrder> {
  customerId: string;
  employeeId: string;
  employeeName: string;
  customerName: string;
  created: Date;
  lastModified: Date;
  lastModifiedBy: string;
  isActive: boolean;
}

export interface Transaction {
  id: string;
  orderId: string;
  status: string;
  totalPrice: number;
  totalPaid: number;
  date: Date;
}

export interface Paymongo {
  id: string;
  type: string;
  attributes: {
    amount: number;
    taxAmount: number;
    checkoutUrl: string;
    payments: any[];
    referenceNumber: string;
    status: string;
  };
}

export interface Notification {
  id: string;
  created: Date;
  message: string;
  isRead: boolean;
}

export interface Units {
  Mass: readonly string[];
  Volume: readonly string[];
  Count: readonly string[];
}

// BOM

export interface BreakdownIngredient extends Ingredient {
  itemId: string;
  itemName: string;
  inventoryPrice: number;
  inventoryQuantity: number;
  inventoryAmountUnit: string;
  amountQuantityType: string;
  amount: number;
  amountUnit: string;
  calculatedPrice: number;
}

export interface Breakdown {
  totalIngredientPrice: number;
  totalIngredientPriceWithOtherCostIncluded: number;
  totalIngredientPriceWithOtherCostIncludedRounded: number;
  ingredientCostBreakdown: [
    {
      itemId: string;
      itemName: string;
      inventoryPrice: number;
      inventoryQuantity: number;
      inventoryAmountUnit: string;
      amountQuantityType: string;
      amount: number;
      amountUnit: string;
      calculatedPrice: number;
    }
  ];
  otherCostBreakdown: {
    additionalCost: number;
    ingredientCostMultiplier: number;
  };
}

// Live Chat
export interface DirectMessage {
  id?: string;
  sender: string;
  receiver?: string;
  timestamp: Date;
  message: string;
}

// Data Analysis
export interface ItemOccurence {
  asCakeIngredient: string[];
  asMaterialIngredient: string[];
  item: Partial<Ingredient>;
  numOfUsesCakeIngredient: number;
  numOfUsesMaterialIngredient: number;
  ratioOfUsesCakeIngredient: number;
  ratioOfUsesMaterialIngredient: number;
}

export interface TagOccurence {
  tag: Tag;
  occurenceCount: number;
  ratio: number;
}

export interface SeasonalOccurence {
  dateStart: Dayjs;
  dateEnd: Dayjs;
  itemList: TagOccurence[];
}

export interface TotalOrders {
  tag: Tag;
  occurenceCount: number;
  ratio: number;
}

export interface OrderTotal {
  totalOrders: number;
}

export interface OrdersOnDay extends OrderTotal {
  day: typeof TimePeriods.Days;
  totalOrders: number;
}

export interface OrdersOnMonth extends OrderTotal {
  month: typeof TimePeriods.Months;
}

export interface Total {
  total: number;
}

export interface Sales {
  name?: string;
  total?: number;
  totalSales?: number;
}

export interface FullSales extends Sales {
  id: string;
  number?: string;
  email?: string;
  price: number;
  date: Dayjs;
}

export interface SalesOnDay extends Sales {
  day: typeof TimePeriods.Days;
  totalSales: number;
}

export interface SalesOnMonth extends Sales {
  month: typeof TimePeriods.Months;
}

export interface ChartData {
  id: string | number;
  value: number;
}
