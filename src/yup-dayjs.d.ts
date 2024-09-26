// src/yup-dayjs.d.ts
import * as yup from "yup";
import dayjs from "dayjs";

// Extend the Yup ObjectSchema to include the custom 'dayjs' method
declare module "yup" {
  interface ObjectSchema<
    TIn extends {},
    TContext = any,
    TOut = TIn,
    TFlags = any
  > {
    dayjs(message?: string): this;
  }
}
