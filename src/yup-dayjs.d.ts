// src/yup.d.ts
import { ObjectSchema, StringSchema } from "yup";
import { Dayjs } from "dayjs";

declare module "yup" {
  interface ObjectSchema<TShape, TContext, TDefault, TFlags> {
    dayjs(message?: string): this;
  }

  interface StringSchema<TContext = any, TDefault = any, TFlags = any> {
    dayjs(message?: string): this;
  }
}
