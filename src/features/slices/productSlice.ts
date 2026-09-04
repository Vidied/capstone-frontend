import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../api/axiosConfig";
import type { Product, ProductRequestDTO } from "../../interfaces/Product";
import { extractErrorMessage } from "../../utils/errorUtils";

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
    return rejectWithValue(
      extractErrorMessage(err, "Prodotto inesistente o errore nel caricamento"),
    );
  }
});

export const createProductThunk = createAsyncThunk<
  Product,
  ProductRequestDTO,
  { rejectValue: string }
>("products/createProduct", async (data, { rejectWithValue }) => {
  try {
    const response = await API.post<Product>("/products", data);
    return response.data;
  } catch (err) {
    return rejectWithValue(
      extractErrorMessage(err, "Errore durante la creazione del prodotto"),
    );
  }
});

export const updateProductThunk = createAsyncThunk<
  Product,
  { id: number; data: ProductRequestDTO },
  { rejectValue: string }
>("products/updateProduct", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await API.put<Product>(`/products/${id}`, data);
    return response.data;
  } catch (err) {
    return rejectWithValue(
      extractErrorMessage(err, "Errore durante la modifica del prodotto"),
    );
  }
});

export const deleteProductThunk = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("products/deleteProduct", async (id, { rejectWithValue }) => {
  try {
    await API.delete(`/products/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(
      extractErrorMessage(err, "Errore durante l'eliminazione del prodotto"),
    );
  }
});

export const toggleProductAvailabilityThunk = createAsyncThunk<
  Product,
  number,
  { rejectValue: string }
>("products/toggleAvailability", async (productId, { rejectWithValue }) => {
  try {
    const response = await API.patch<Product>(
      `/products/${productId}/availability`,
    );
    return response.data;
  } catch (err) {
    return rejectWithValue(
      extractErrorMessage(
        err,
        "Errore durante la modifica della disponibilità",
      ),
    );
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
      })
      .addCase(createProductThunk.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      .addCase(createProductThunk.rejected, (state, action) => {
        state.error = action.payload || "Errore durante la creazione";
      })
      .addCase(updateProductThunk.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (p) => p.id === action.payload.id,
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProductThunk.rejected, (state, action) => {
        state.error = action.payload || "Errore durante la modifica";
      })
      .addCase(deleteProductThunk.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteProductThunk.rejected, (state, action) => {
        state.error = action.payload || "Errore durante l'eliminazione";
      })
      .addCase(toggleProductAvailabilityThunk.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (p) => p.id === action.payload.id,
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(toggleProductAvailabilityThunk.rejected, (state, action) => {
        state.error =
          action.payload || "Errore durante la modifica della disponibilità";
      });
  },
});

export const { clearProductError } = productSlice.actions;
export default productSlice.reducer;
