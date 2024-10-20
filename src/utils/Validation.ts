import * as yup from "yup";
import dayjs from "dayjs";

yup.addMethod<yup.ObjectSchema<any>>(yup.object, "dayjs", function (message) {
  return this.test("dayjs", message, function (value) {
    if (!value) {
      return true; // Allow undefined or null values
    }
    return dayjs.isDayjs(value); // Check if the value is a valid dayjs object
  });
});

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required("Required")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email address"
    ),
  password: yup.string().required("Required"),
});

export const registerSchema = yup.object().shape({
  username: yup.string().required("Required"),
  email: yup
    .string()
    .required("Required")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email address"
    ),
  contactNumber: yup
    .number()
    .min(9000000000, "Invalid contact number")
    .required("Required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[@$!%*?&#]/,
      "Password must contain at least one special character"
    )
    .required("Required"),
  confirmPassword: yup
    .string()
    .required("Required")
    .test("matches", "Passwords must match", function (value) {
      const { createError } = this;
      return (
        value === this.resolve(yup.ref("password")) ||
        createError({ message: "Passwords must match" })
      );
    }),
});

// Register Admin Schema
export const registerAdminSchema = yup.object().shape({
  username: yup.string().required("Required"),
  email: yup
    .string()
    .required("Required")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email address"
    ),
  contactNumber: yup
    .string()
    .transform((value) => {
      // Remove leading zeros
      const trimmedValue = value.replace(/^0+/, "");
      // Convert to integer and then back to string
      return trimmedValue ? String(trimmedValue) : "";
    })
    .matches(/^\d*$/, "Invalid contact number") // Ensure it's still a valid number or empty
    .max(10, "Invalid contact number") // Ensure the length is valid (adjust as needed)
    .required("Required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[@$!%*?&#]/,
      "Password must contain at least one special character"
    )
    .required("Required"),
  confirmPassword: yup
    .string()
    .required("Required")
    .test("matches", "Passwords must match", function (value) {
      const { createError } = this;
      return (
        value === this.resolve(yup.ref("password")) ||
        createError({ message: "Passwords must match" })
      );
    }),
  type: yup
    .string()
    .oneOf(["customer", "artist", "manager", "admin"], "Invalid type")
    .default("customer"),
  secretKey: yup.string().when("type", {
    is: "admin",
    then: (schema) => schema.required("Secret key is required for Admin"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export const cartSchema = yup.object().shape({
  dedication: yup.string(),
  requests: yup.string(),
  flavor: yup.string().required("Required"),
  size: yup.string().required("Required"),
  color: yup.string().required("Required"),
  customColor: yup.string(),
  quantity: yup.number().positive().integer().required("Required"),
  // addOns: yup
  //   .array()
  //   .of(
  //     yup.object().shape({
  //       id: yup.string().required("Required"),
  //       quantity: yup.number().required("Required"),
  //     })
  //   )
  //   .required("Required"),
});

export const suborderSchema = yup.object().shape({
  quantity: yup.number().positive().integer().required("Required"),
  designName: yup.string().required("Required"),
  description: yup.string(),
  flavor: yup.string().required("Required"),
  size: yup.string().required("Required"),
  color: yup.string().required("Required"),
  shape: yup.string().required("Required"),
  tier: yup.string().required("Required"),
});

export const orderSchema = yup.object().shape({
  type: yup.string().required("Required"),
  pickupDateTime: yup.object().dayjs().required("Required"),
  payment: yup.string().required("Required"),
  // suborderIds: yup.array().of(yup.string()).required(),
});

export const customOrderSchema = yup.object().shape({
  color: yup.string().required("Required"),
  customColor: yup.string(),
  shape: yup.string().required("Required"),
  quantity: yup.number().positive().integer().required("Required"),
  cover: yup.string().required("Required"),
  description: yup.string().required("Required"),
  sizeRound: yup.string(),
  sizeHeart: yup.string(),
  sizeRectangle: yup.string(),
  flavor: yup.string().required("Required"),
  customFlavor: yup.string(),
  picture: yup.string().required("Required"),
  message: yup.string().required("Required"),
  agree: yup.boolean().required("Required"),
});

export const managementOrderSchema = yup.object({
  id: yup.string().required("Order ID is required"),
  type: yup
    .string()
    .oneOf(["normal", "rush"], "Type must be 'normal' or 'rush'")
    .required("Order type is required"),
  pickupDateTime: yup.object().dayjs().required("Required"),
  payment: yup
    .string()
    .oneOf(["half", "full"], "Payment must be 'half' or 'full'")
    .required("Payment status is required"),
  suborders: yup
    .array()
    .of(suborderSchema)
    .min(1, "At least one suborder is required"),
  customerId: yup.string().required("Customer ID is required"),
  customerName: yup.string().required("Customer name is required"),
});

export const ingredientSchema = yup.object().shape({
  id: yup.string().nullable(),
  name: yup.string().required("Required"),
  quantity: yup.number().required("Required"),
  measurement: yup.string().required("Required"),
  price: yup.number().required("Required"),
  type: yup.string().required("Required"),
  good: yup.number().required("Required"),
  bad: yup.number().required("Required"),
});

export const addOnSchema = yup.object().shape({
  id: yup.string(),
  name: yup.string().required("Required"),
  pricePerUnit: yup.number().positive().required("Required"),
  size: yup.number().positive().required("Required"),
});

export const pastryMaterialSchema = yup.object().shape({
  designId: yup
    .string()
    .uuid("Invalid UUID format")
    .required("Design ID is required"),
  mainVariantName: yup.string().required("Main Variant Name is required"),
  ingredients: yup.array().of(
    yup.object().shape({
      itemId: yup.string().required("Item ID is required"),
      ingredientType: yup
        .string()
        .oneOf(["INV", "MAT"])
        .required("Ingredient type is required"),
      amount: yup
        .number()
        .min(0, "Amount must be 0 or greater")
        .required("Amount is required"),
      amountMeasurement: yup
        .string()
        .required("Amount Measurement is required"),
    })
  ),
  otherCost: yup.object().shape({
    additionalCost: yup
      .number()
      .min(0, "Additional cost must be 0 or greater")
      .required("Additional cost is required"),
    ingredientCostMultiplier: yup
      .number()
      .min(0, "Ingredient cost multiplier must be 0 or greater")
      .required("Ingredient cost multiplier is required"),
  }),
  ingredientImportance: yup.array().of(
    yup.object().shape({
      itemId: yup.string().required("Item ID is required"),
      ingredientType: yup
        .string()
        .oneOf(["INV", "MAT"])
        .required("Ingredient type is required"),
      importance: yup.number().min(1).max(5).required("Importance is required"),
    })
  ),
  addOns: yup.array().of(
    yup.object().shape({
      addOnsId: yup.number().min(0).required("Add-on ID is required"),
      amount: yup.number().min(0).required("Amount is required"),
    })
  ),
  subVariants: yup.array().of(
    yup.object().shape({
      subVariantName: yup.string().required("Sub Variant Name is required"),
      subVariantIngredients: yup.array().of(
        yup.object().shape({
          itemId: yup.string().required("Item ID is required"),
          ingredientType: yup
            .string()
            .oneOf(["INV", "MAT"])
            .required("Ingredient type is required"),
          amount: yup
            .number()
            .min(0, "Amount must be 0 or greater")
            .required("Amount is required"),
          amountMeasurement: yup
            .string()
            .required("Amount Measurement is required"),
        })
      ),
      subVariantAddOns: yup.array().of(
        yup.object().shape({
          addOnsId: yup.number().min(0).required("Add-on ID is required"),
          amount: yup.number().min(0).required("Amount is required"),
        })
      ),
    })
  ),
});

export const designSchema = yup.object({
  displayName: yup.string().required("Display Name is required"),
  cakeDescription: yup.string().required("Description is required"),
  designTagIds: yup.array().of(yup.string().required("Tag is required")),
  designShapeNames: yup
    .array()
    .of(yup.string().required("Shape name is required")),
  design_add_ons: yup.array().of(
    yup.object().shape({
      add_on_name: yup.string().required("Add-on name is required"),
      quantity: yup
        .number()
        .min(1, "Quantity must be at least 1")
        .required("Quantity is required"),
      price: yup
        .number()
        .min(0, "Price must be at least 0")
        .required("Price is required"),
    })
  ),
  displayPictureDataEncoded: yup.string().required("Image is required"),
});
