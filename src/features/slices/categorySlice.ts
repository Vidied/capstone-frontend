import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import API from "../../api/axiosConfig";
import type { Category, CategoryRequestDTO } from "../../interfaces/Product";
import { extractErrorMessage } from "../../utils/errorUtils";

interface CategoryState {
  categories: Category[];
  selectedCategory: number | null;
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
>("categories/fetchCategories", async (_, { rejectWithValue }) => {
  try {
    const response = await API.get<Category[]>("/categories");
    return response.data;
  } catch (err) {
    return rejectWithValue(
      extractErrorMessage(
        err,
        "Categoria inesistente o errore nel caricamento",
      ),
    );
  }
});

export const createCategoryThunk = createAsyncThunk<
  Category,
  CategoryRequestDTO,
  { rejectValue: string }
>("categories/createCategory", async (data, { rejectWithValue }) => {
  try {
    const response = await API.post<Category>("/categories", data);
    return response.data;
  } catch (err) {
    return rejectWithValue(
      extractErrorMessage(err, "Errore durante la creazione della categoria"),
    );
  }
});

export const deleteCategoryThunk = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("categories/deleteCategory", async (id, { rejectWithValue }) => {
  try {
    await API.delete(`/categories/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(
      extractErrorMessage(err, "Errore durante l'eliminazione della categoria"),
    );
  }
});

export const updateCategoryThunk = createAsyncThunk<
  Category,
  { id: number; data: CategoryRequestDTO },
  { rejectValue: string }
>("categories/updateCategory", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await API.put<Category>(`/categories/${id}`, data);
    return response.data;
  } catch (err) {
    return rejectWithValue(
      extractErrorMessage(err, "Errore durante la modifica della categoria"),
    );
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
      })
      .addCase(createCategoryThunk.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(createCategoryThunk.rejected, (state, action) => {
        state.error = action.payload || "Errore durante la creazione";
      })
      .addCase(updateCategoryThunk.fulfilled, (state, action) => {
        const index = state.categories.findIndex(
          (c) => c.id === action.payload.id,
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(updateCategoryThunk.rejected, (state, action) => {
        state.error = action.payload || "Errore durante la modifica";
      })
      .addCase(deleteCategoryThunk.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (c) => c.id !== action.payload,
        );
      })
      .addCase(deleteCategoryThunk.rejected, (state, action) => {
        state.error = action.payload || "Errore durante l'eliminazione";
      });
  },
});

export const { setSelectedCategory, clearCategoryError } =
  categorySlice.actions;
export default categorySlice.reducer;
