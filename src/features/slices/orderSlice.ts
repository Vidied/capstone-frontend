import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import API from "../../api/axiosConfig";
import type {
  AppendItemsDTO,
  Order,
  OrderRequestDTO,
  UpdateOrderStatusDTO,
} from "../../interfaces/Order";
import { extractErrorMessage } from "../../utils/errorUtils";

interface OrderState {
  orders: Order[];
  isSubmitting: boolean;
  loading: boolean;
  successMessage: string | null;
  errorMessage: string | null;
}

const initialState: OrderState = {
  orders: [],
  isSubmitting: false,
  loading: false,
  successMessage: null,
  errorMessage: null,
};

// Fetch di tutti gli ordini
export const fetchOrdersThunk = createAsyncThunk<
  Order[],
  void,
  { rejectValue: string }
>("orders/fetchOrders", async (_, { rejectWithValue }) => {
  try {
    const response = await API.get<Order[]>("/orders");
    return response.data;
  } catch (err) {
    return rejectWithValue(
      extractErrorMessage(err, "Errore nel caricamento degli ordini"),
    );
  }
});

// Creazione di un nuovo ordine
export const createOrderThunk = createAsyncThunk<
  Order,
  OrderRequestDTO,
  { rejectValue: string }
>("orders/createOrder", async (data, { rejectWithValue }) => {
  try {
    const response = await API.post<Order>("/orders", data);
    return response.data;
  } catch (err) {
    return rejectWithValue(
      extractErrorMessage(err, "Errore durante la creazione dell'ordine"),
    );
  }
});

export const appendItemsThunk = createAsyncThunk<
  Order,
  { orderId: number } & AppendItemsDTO,
  { rejectValue: string }
>("orders/appendItems", async ({ orderId, items }, { rejectWithValue }) => {
  try {
    const response = await API.post<Order>(`/orders/${orderId}/items`, items);
    return response.data;
  } catch (err) {
    return rejectWithValue(
      extractErrorMessage(
        err,
        "Errore durante l'aggiunta di elementi all'ordine",
      ),
    );
  }
});

// Aggiornamento dello stato dell'ordine (es. COMPLETED, CANCELLED)
export const updateOrderStatusThunk = createAsyncThunk<
  Order,
  { orderId: number; data: UpdateOrderStatusDTO },
  { rejectValue: string }
>("orders/updateStatus", async ({ orderId, data }, { rejectWithValue }) => {
  try {
    const response = await API.patch<Order>(`/orders/${orderId}/status`, data);
    return response.data;
  } catch (err) {
    return rejectWithValue(
      extractErrorMessage(
        err,
        "Errore durante l'aggiornamento dello stato dell'ordine",
      ),
    );
  }
});

// Cancellazione/Eliminazione di un singolo ordine
export const deleteOrdersThunk = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("orders/deleteOrder", async (orderId, { rejectWithValue }) => {
  try {
    await API.delete(`/orders/${orderId}`);
    return orderId;
  } catch (err) {
    return rejectWithValue(
      extractErrorMessage(err, "Errore durante la cancellazione dell'ordine"),
    );
  }
});

export const deleteCompletedOrdersThunk = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("orders/deleteCompletedOrders", async (_, { rejectWithValue }) => {
  try {
    await API.delete("/orders/completed/all");
  } catch (err) {
    return rejectWithValue(
      extractErrorMessage(
        err,
        "Errore durante l'eliminazione degli ordini completati",
      ),
    );
  }
});

export const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearOrderMessages: (state) => {
      state.successMessage = null;
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdersThunk.pending, (state) => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(
        fetchOrdersThunk.fulfilled,
        (state, action: PayloadAction<Order[]>) => {
          state.loading = false;
          state.orders = action.payload;
        },
      )
      .addCase(fetchOrdersThunk.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload || "Errore sconosciuto";
      })
      .addCase(createOrderThunk.pending, (state) => {
        state.isSubmitting = true;
        state.successMessage = null;
        state.errorMessage = null;
      })
      .addCase(
        createOrderThunk.fulfilled,
        (state, action: PayloadAction<Order>) => {
          state.isSubmitting = false;
          state.orders.push(action.payload);
          state.successMessage = "Comanda inviata con successo!";
        },
      )
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.isSubmitting = false;
        state.errorMessage =
          action.payload || "Errore durante l'invio della comanda";
      })
      .addCase(appendItemsThunk.pending, (state) => {
        state.isSubmitting = true;
        state.successMessage = null;
        state.errorMessage = null;
      })
      .addCase(
        appendItemsThunk.fulfilled,
        (state, action: PayloadAction<Order>) => {
          state.isSubmitting = false;
          const index = state.orders.findIndex(
            (o) => o.id === action.payload.id,
          );
          if (index !== -1) {
            state.orders[index] = action.payload;
          } else {
            state.orders.push(action.payload);
          }
          state.successMessage = "Prodotti aggiunti all'ordine con successo!";
        },
      )
      .addCase(appendItemsThunk.rejected, (state, action) => {
        state.isSubmitting = false;
        state.errorMessage =
          action.payload || "Errore nell'aggiunta di prodotti";
      })
      .addCase(
        updateOrderStatusThunk.fulfilled,
        (state, action: PayloadAction<Order>) => {
          const index = state.orders.findIndex(
            (o) => o.id === action.payload.id,
          );
          if (index !== -1) {
            state.orders[index] = action.payload;
          }
        },
      )
      .addCase(updateOrderStatusThunk.rejected, (state, action) => {
        state.errorMessage =
          action.payload || "Errore nell'aggiornamento dello stato";
      })
      .addCase(
        deleteOrdersThunk.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.orders = state.orders.filter((o) => o.id !== action.payload);
          state.successMessage = "Ordine cancellato con successo!";
        },
      )
      .addCase(deleteOrdersThunk.rejected, (state, action) => {
        state.errorMessage =
          action.payload || "Errore durante la cancellazione dell'ordine";
      })
      .addCase(deleteCompletedOrdersThunk.fulfilled, (state) => {
        state.orders = state.orders.filter(
          (o) => o.orderStatus !== "COMPLETED",
        );
        state.successMessage = "Ordini completati eliminati con successo!";
      })
      .addCase(deleteCompletedOrdersThunk.rejected, (state, action) => {
        state.errorMessage =
          action.payload ||
          "Errore durante l'eliminazione degli ordini completati";
      });
  },
});

export const { clearOrderMessages } = orderSlice.actions;
export default orderSlice.reducer;
