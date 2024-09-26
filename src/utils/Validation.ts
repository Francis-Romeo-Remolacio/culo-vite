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
  secret_key: yup.string().when("type", {
    is: (type) => type === "admin",
    then: yup.string().required("Secret key is required for Admin"),
    otherwise: yup.string().notRequired(),
  }),
});

export const cartSchema = yup.object().shape({
  dedication: yup.string().required("Required"),
  requests: yup.string(),
  flavor: yup.string().required("Required"),
  size: yup.string().required("Required"),
  color: yup.string().required("Required"),
  customColor: yup.string(),
  quantity: yup.number().positive().integer().required("Required"),
  /*addOns: yup.array().of(yup.object().shape({ addOn: yup.string })),*/
});

export const suborderSchema = yup.object().shape({
  quantity: yup.number().positive().integer().required("Required"),
  designName: yup.string().required("Required"),
  description: yup.string().required("Required"),
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
  suborderIds: yup.array().of(yup.string()).required(),
});

export const customOrderSchema = yup.object().shape({
  color: yup.string().required("Required"),
  customColor: yup.string(),
  shape: yup.string().required("Required"),
  tier: yup.number().positive().integer().required("Required"),
  quantity: yup.number().positive().integer().required("Required"),
  cover: yup.string().required("Required"),
  description: yup.string().required("Required"),
  size: yup.string().required("Required"),
  customSize: yup.string(),
  flavor: yup.string().required("Required"),
  customFlavor: yup.string(),
  picture: yup.string().required("Required"),
  message: yup.string().required("Required"),
  type: yup.string().required("Required"),
  pickupDateTime: yup.object().dayjs().required("Required"),
});

export const ingredientSchema = yup.object().shape({
  name: yup.string().required("Required"),
  quantity: yup.number().required("Required"),
  measurements: yup.string().required("Required"),
  price: yup.number().required("Required"),
  type: yup.string().required("Required"),
});

export const addOnSchema = yup.object().shape({
  id: yup.string(),
  name: yup.string().required("Required"),
  pricePerUnit: yup.number().positive().required("Required"),
  size: yup.number().positive().required("Required"),
});

export const pastryMaterialSchema = yup.object().shape({});

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
