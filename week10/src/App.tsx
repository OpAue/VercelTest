import { useReducer } from "react";

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

type State = {
  items: CartItem[];
};

type Action =
  | { type: "ADD"; payload: { id: number; name: string; price: number } }
  | { type: "REMOVE"; payload: number }
  | { type: "INCREASE"; payload: number }
  | { type: "DECREASE"; payload: number }
  | { type: "CLEAR" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD": {
      const existing = state.items.find((item) => item.id === action.payload.id);
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };
    }
    case "REMOVE":
      return {
        items: state.items.filter((item) => item.id !== action.payload),
      };
    case "INCREASE":
      return {
        items: state.items.map((item) =>
          item.id === action.payload
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };
    case "DECREASE":
      return {
        items: state.items
          .map((item) =>
            item.id === action.payload
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
          .filter((item) => item.quantity > 0),
      };
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

const SHOP = [
  { id: 1, name: "아메리카노", price: 4500 },
  { id: 2, name: "카페라떼", price: 5000 },
  { id: 3, name: "초코케이크", price: 6500 },
];

function App() {
  const [state, dispatch] = useReducer(reducer, { items: [] });

  const totalPrice = state.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div>
      <h2>상품</h2>
      {SHOP.map((product) => (
        <div key={product.id}>
          <span>{product.name} - {product.price.toLocaleString()}원</span>
          <button onClick={() => dispatch({ type: "ADD", payload: product })}>
            담기
          </button>
        </div>
      ))}

      <hr />

      <h2>장바구니</h2>
      {state.items.length === 0 ? (
        <p>장바구니가 비어있어요!</p>
      ) : (
        state.items.map((item) => (
          <div key={item.id}>
            <span>{item.name} ({item.quantity}개)</span>
            <button onClick={() => dispatch({ type: "DECREASE", payload: item.id })}>-</button>
            <button onClick={() => dispatch({ type: "INCREASE", payload: item.id })}>+</button>
            <button onClick={() => dispatch({ type: "REMOVE", payload: item.id })}>삭제</button>
          </div>
        ))
      )}

      <h3>총 금액: {totalPrice.toLocaleString()}원</h3>
      <button onClick={() => dispatch({ type: "CLEAR" })}>전체 비우기</button>
    </div>
  );
}

export default App;