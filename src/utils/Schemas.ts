// src/utils/Schemas.ts

import { Dayjs } from "dayjs";
import * as TimePeriods from "./TimePeriods";

export interface User {
  id: string;
  email: string;
  username: string;
  roles: string[];
  phoneNumber?: number;
  isEmailConfirmed: boolean;
  joinDate: Dayjs;
}

export interface Employee {
  id: string;
  userId: string;
  employed: Dayjs;
}

export interface Customer {
  id: string;
  userId: string;
  timesOrdered: number;
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

export interface ManagementAddOn {
  measurement: string;
  created: Dayjs;
  lastModified: Dayjs;
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

export interface PastryMaterial {
  pastryMaterialId: string;
  designId: string;
  designName: string;
  dateAdded: string;
  lastModifiedDate: string;
  otherCost: OtherCost;
  costEstimate: number;
  ingredients: Array<{ itemName: string }>;
  subVariants: Array<{ subVariantName: string }>;
  mainVariantName: string;
}
export interface OtherCost {
  pastryMaterialAdditionalCostId: string,
  additionalCost: number
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
  pastryId: string;
  description: string;
  size: string;
  color: string;
  flavor: string;
  quantity: number;
}

export interface ManagementSuborder extends Required<Suborder> {
  customerId: string;
  employeeId: string;
  employeeName: string;
  customerName: string;
  pastryId: string;
  created: Date;
  lastModified: Date;
  lastModifiedBy: string;
  isActive: boolean;
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
  day: typeof TimePeriods.Days | number;
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
  day: typeof TimePeriods.Days | number;
}

export interface SalesOnMonth extends Sales {
  month: typeof TimePeriods.Months;
}

export interface ChartData {
  id: string | number;
  value: number;
}

//Pastry Material Input schemas
export interface PastryMaterialAddForm {
  designId: string;
  otherCost: PastryMaterialAddFormOtherCost;
  ingredients: PastryMaterialAddFormIngredients[];
  addOns: PastryMaterialAddFormAddOns[];
  subVariants: PastryMaterialAddFormSubVariants[];
}
export interface PastryMaterialAddFormOtherCost {
  additionalCost : number
}
export interface PastryMaterialAddFormIngredients {
  ingredientType: string;
  itemId: string;
  itemName: string;
  amountMeasurement : string;
  amount: number;
  forInsertion: string;
}
export interface PastryMaterialAddFormAddOns {
  addOnsId: number;
  addOnsName: string;
  amount: number;
  forInsertion: string;
}
export interface PastryMaterialAddFormSubVariants {
  subVariantName? : string;
  forInsertion?: string;
  subVariantIngredients?: PastryMaterialAddFormIngredients[];
  subVariantAddOns? : PastryMaterialAddFormAddOns[]
}