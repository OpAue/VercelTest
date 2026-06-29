import axios from "axios";

type CartItemRequest = {
  id: number;
  name: string;
  price: number;
};

export const addCartItem = async (item: CartItemRequest) => {
  const res = await axios.post(
    "https://jsonplaceholder.typicode.com/posts",
    item
  );

  return res.data;
};