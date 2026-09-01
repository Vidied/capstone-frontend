import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import API from "../../api/axiosConfig";
import type { Product, ProductRequestDTO } from "../../interfaces/Product";

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

export const createProductThunk = createAsyncThunk<
  Product,
  ProductRequestDTO,
  { rejectValue: string }
>("products/createProduct", async (data, { rejectWithValue }) => {
  try {
    const response = await API.post<Product>("/products", data);
    return response.data;
  } catch (err) {
    let errorMessage = "Errore durante la creazione del prodotto";
    if (err instanceof AxiosError && err.response?.data?.message) {
      errorMessage = err.response.data.message;
    }
    return rejectWithValue(errorMessage);
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
    let errorMessage = "Errore durante la modifica del prodotto";
    if (err instanceof AxiosError && err.response?.data?.message) {
      errorMessage = err.response.data.message;
    }
    return rejectWithValue(errorMessage);
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
    let errorMessage = "Errore durante l'eliminazione del prodotto";
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
      })
      .addCase(createProductThunk.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      .addCase(updateProductThunk.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (p) => p.id === action.payload.id,
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(deleteProductThunk.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.payload);
      });
  },
});

export const { clearProductError } = productSlice.actions;
export default productSlice.reducer;
