import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import API from "../../api/axiosConfig";

export interface Category {
  id: number;
  name: string;
}

interface CategoryState {
  categories: Category[];
  selectedCategory: number | null; //Se non viene scelto una categoria specifica allora mi ritorna tutte le categorie
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  selectedCategory: null,
  loading: false,
  error: null,
};

export const fetchCategoriesThunk = createAsyncThunk<
  Category[],
  void,
  { rejectValue: string }
>("products/fetchCategories", async (_, { rejectWithValue }) => {
  try {
    const response = await API.get<Category[]>("/categories");
    return response.data;
  } catch (err) {
    let errorMessage = "Categoria inesistente o errore nel caricamento";

    if (err instanceof AxiosError && err.response?.data?.message) {
      errorMessage = err.response.data.message;
    }

    return rejectWithValue(errorMessage);
  }
});

export const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<number | null>) => {
      state.selectedCategory = action.payload;
    },
    clearCategoryError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoriesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoriesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategoriesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Errore sconosciuto";
      });
  },
});

export const { setSelectedCategory, clearCategoryError } =
  categorySlice.actions;
export default categorySlice.reducer;
