import {
  Button,
  Checkbox,
  Group,
  TextInput,
  Select,
  MultiSelect,
  Textarea,
  FileInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { DatePicker } from "@mantine/dates";

function CakeOrderForm() {
  const form = useForm({
    initialValues: {
      dateOfPickup: null,
      cakeTier: "",
      cakeSize: [],
      otherCakeSize: "",
      cakeShape: "",
      cakeFlavor: "",
      cakeCover: "",
      eventDetails: "",
      cakeMessage: "",
      referenceImage: null,
      name: "",
      phoneNumber: "",
      email: "",
      socialMedia: "",
      businessName: "",
    },

    validate: {
      dateOfPickup: (value) => (value ? null : "Please select a pickup date"),
      cakeTier: (value) => (value ? null : "Please select a cake tier"),
      cakeSize: (value) =>
        value.length ? null : "Please select at least one cake size",
      cakeShape: (value) => (value ? null : "Please select a cake shape"),
      cakeFlavor: (value) => (value ? null : "Please select a cake flavor"),
      cakeCover: (value) => (value ? null : "Please select a cake cover"),
      eventDetails: (value) =>
        value.length ? null : "Please provide event details",
      cakeMessage: (value) =>
        value.length ? null : "Please provide a message for the cake",
      name: (value) => (value.length ? null : "Please enter your name"),
      phoneNumber: (value) =>
        /^\+?\d{10,15}$/.test(value) ? null : "Invalid phone number",
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      socialMedia: (value) =>
        value.length ? null : "Please provide a social media account",
    },
  });

  return (
    <form onSubmit={form.onSubmit((values) => console.log(values))}>
      <DatePicker
        withAsterisk
        label="Date of pickup"
        placeholder="Select a date"
        key={form.key("dateOfPickup")}
        {...form.getInputProps("dateOfPickup")}
      />

      <Select
        withAsterisk
        label="Select cake tier"
        placeholder="Choose a tier"
        data={["1 Tier", "2 Tiers", "3 Tiers"]}
        key={form.key("cakeTier")}
        {...form.getInputProps("cakeTier")}
      />

      <MultiSelect
        withAsterisk
        label="Select cake size (diameter x height)"
        placeholder="Select sizes"
        data={['6"x4"', '8"x6"', '10"x8"', '12"x10"']}
        key={form.key("cakeSize")}
        {...form.getInputProps("cakeSize")}
      />

      <TextInput
        label="Type other cake size"
        placeholder="Custom size"
        key={form.key("otherCakeSize")}
        {...form.getInputProps("otherCakeSize")}
      />

      <Select
        withAsterisk
        label="Select cake shape"
        placeholder="Choose a shape"
        data={["Round", "Square", "Rectangle"]}
        key={form.key("cakeShape")}
        {...form.getInputProps("cakeShape")}
      />

      <Select
        withAsterisk
        label="Select cake flavor"
        placeholder="Choose a flavor"
        data={["Vanilla", "Chocolate", "Red Velvet", "Strawberry"]}
        key={form.key("cakeFlavor")}
        {...form.getInputProps("cakeFlavor")}
      />

      <Select
        withAsterisk
        label="Select cake cover"
        placeholder="Choose a cover"
        data={["Fondant", "Buttercream", "Whipped Cream"]}
        key={form.key("cakeCover")}
        {...form.getInputProps("cakeCover")}
      />

      <Textarea
        withAsterisk
        label="Type your event's theme/color palette/important notes/requests (if it will be given as a gift)"
        placeholder="Event details"
        key={form.key("eventDetails")}
        {...form.getInputProps("eventDetails")}
      />

      <Textarea
        withAsterisk
        label="Type your message on the cake"
        placeholder="Message on the cake"
        key={form.key("cakeMessage")}
        {...form.getInputProps("cakeMessage")}
      />

      <FileInput
        label="Add Image for reference (cake peg)"
        placeholder="Upload image"
        accept="image/*"
        key={form.key("referenceImage")}
        {...form.getInputProps("referenceImage")}
      />

      <TextInput
        withAsterisk
        label="Your Name"
        placeholder="First Name Last Name"
        key={form.key("name")}
        {...form.getInputProps("name")}
      />

      <TextInput
        withAsterisk
        label="Phone Number"
        placeholder="+1234567890"
        key={form.key("phoneNumber")}
        {...form.getInputProps("phoneNumber")}
      />

      <TextInput
        withAsterisk
        label="Email"
        placeholder="your@email.com"
        key={form.key("email")}
        {...form.getInputProps("email")}
      />

      <TextInput
        withAsterisk
        label="Social Media Accounts (Instagram/Facebook Username or Viber #)"
        placeholder="Your social media handle"
        key={form.key("socialMedia")}
        {...form.getInputProps("socialMedia")}
      />

      <TextInput
        label="Business/Company Name (for corporate events)"
        placeholder="Company Name"
        key={form.key("businessName")}
        {...form.getInputProps("businessName")}
      />

      <Group justify="flex-end" mt="md">
        <Button type="submit">Submit</Button>
      </Group>
    </form>
  );
}

export default CakeOrderForm;
