import {
  Alert,
  Button,
  Group,
  PasswordInput,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import api from "../../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import cookies from "js-cookie";

interface LoginFormValues {
  email: string;
  password: string;
}

const Login = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) => (value.length > 0 ? null : "Password is required"),
    },
  });

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      const response = await api.post("/login", values);

      if (response.status === 200) {
        // Save token and expiration as cookies
        const { token, expiration } = response.data;
        cookies.set("sessionToken", token, { expires: new Date(expiration) });

        // Make an API call to get the current user
        const userResponse = await api.get("/user/current");

        if (userResponse.status === 200) {
          // Save current user information as a cookie
          cookies.set("currentUser", JSON.stringify(userResponse.data), {
            expires: new Date(expiration),
          });
        }

        // Redirect to home page
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Title>Login</Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Email"
          placeholder="your@email.com"
          key={form.key("email")}
          {...form.getInputProps("email")}
        />
        <PasswordInput
          label="Password"
          placeholder="********"
          key={form.key("password")}
          {...form.getInputProps("password")}
        />

        <Group justify="flex-end" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </>
  );
};

export default Login;
