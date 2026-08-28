import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import API from "../../api/axiosConfig";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  isAvailable: boolean;
  categoryId?: number;
  categoryName: string;
  ingredientNames: string[];
}

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

export const fetchProductsThunk = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>("products/fetchProducts", async (_, { rejectWithValue }) => {
  try {
    const response = await API.get<Product[]>("/products");
    return response.data;
  } catch (err) {
    let errorMessage = "Prodotto inesistente o errore nel caricamento";

    if (err instanceof AxiosError && err.response?.data?.message) {
      errorMessage = err.response.data.message;
    }

    return rejectWithValue(errorMessage);
  }
});

export const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearProductError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProductsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Errore sconosciuto";
      });
  },
});

export const { clearProductError } = productSlice.actions;
export default productSlice.reducer;
