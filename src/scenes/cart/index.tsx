import { Container } from "@mui/material";
import { Helmet } from "react-helmet-async";
import CartList from "./CartList.jsx";

const Cart = () => {
  return (
    <>
      <Helmet>
        <title>Cart - Cake Studio</title>
      </Helmet>

      <Container maxWidth="md">
        <CartList />
      </Container>
    </>
  );
};

export default Cart;
