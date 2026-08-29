import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import API from "../../api/axiosConfig";
import type {
  Order,
  OrderRequestDTO,
  OrderStatus,
  UpdateOrderStatusDTO,
} from "../../interfaces/Order";

interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  isSubmitting: boolean;
  errorMessage: string | null;
}

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
  successMessage: null,
  isSubmitting: false,
  errorMessage: null,
};

export const createOrderThunk = createAsyncThunk<
  Order,
  OrderRequestDTO,
  { rejectValue: string }
>("order/createOrder", async (orderPayload, { rejectWithValue }) => {
  try {
    const response = await API.post<Order>("/orders", orderPayload);
    return response.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      const backendMessage =
        typeof err.response?.data === "string"
          ? err.response.data
          : err.response?.data?.message;
      return rejectWithValue(backendMessage || "Impossibile inviare l'ordine");
    }
    return rejectWithValue("Errore di connessione al server");
  }
});

export const updateOrderStatusThunk = createAsyncThunk<
  Order,
  { orderId: number; status: OrderStatus },
  { rejectValue: string }
>(
  "order/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const payload: UpdateOrderStatusDTO = { orderStatus: status };
      const response = await API.patch<Order>(
        `/orders/${orderId}/status`,
        payload,
      );
      return response.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        const backendMessage =
          typeof err.response?.data === "string"
            ? err.response.data
            : err.response?.data?.message;
        return rejectWithValue(
          backendMessage || "Impossibile aggiornare lo stato dell'ordine",
        );
      }
      return rejectWithValue("Errore di connessione al server");
    }
  },
);

export const fetchOrderThunk = createAsyncThunk<
  Order[],
  void,
  { rejectValue: string }
>("order/fetchOrder", async (_, { rejectWithValue }) => {
  try {
    const response = await API.get<Order[]>("/orders");
    return response.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      const backendMessage =
        typeof err.response?.data === "string"
          ? err.response.data
          : err.response?.data?.message;
      return rejectWithValue(
        backendMessage || "Impossibile caricare gli ordini",
      );
    }
    return rejectWithValue("Errore di connessione al server");
  }
});

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearOrderMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    resetOrderState: (state) => {
      state.loading = false;
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrderThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
        state.successMessage = "Comanda inviata con successo";
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Errore sconosciuto";
      })
      .addCase(fetchOrderThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrderThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Errore sconosciuto";
      })
      .addCase(updateOrderStatusThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Errore sconosciuto";
      })
      .addCase(updateOrderStatusThunk.fulfilled, (state, action) => {
        state.loading = false;
        const updatedOrder = action.payload;
        const index = state.orders.findIndex((o) => o.id === updatedOrder.id);
        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }
      });
  },
});

export const { clearOrderMessages, resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;
