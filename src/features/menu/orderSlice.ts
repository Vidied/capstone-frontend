import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import API from "../../api/axiosConfig";
import type { Order, OrderRequestDTO } from "../../interfaces/Order";

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
      });
  },
});

export const { clearOrderMessages, resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;
