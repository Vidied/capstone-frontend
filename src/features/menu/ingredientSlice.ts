import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import API from "../../api/axiosConfig";

export interface Ingredient {
  id: number;
  name: string;
  available: boolean;
}

interface IngredientState {
  ingredients: Ingredient[];
  loading: boolean;
  error: string | null;
}

const initialState: IngredientState = {
  ingredients: [],
  loading: false,
  error: null,
};

export const fetchIngredientsThunk = createAsyncThunk<
  Ingredient[],
  void,
  { rejectValue: string }
>("Ingredients/fetchIngredients", async (_, { rejectWithValue }) => {
  try {
    const response = await API.get<Ingredient[]>("/ingredients");
    return response.data;
  } catch (err) {
    let errorMessage = "Ingrediente inesistente o errore nel caricamento";

    if (err instanceof AxiosError && err.response?.data?.message) {
      errorMessage = err.response.data.message;
    }

    return rejectWithValue(errorMessage);
  }
});

export const ingredientsSlice = createSlice({
  name: "ingredients",
  initialState,
  reducers: {
    clearIngredientError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredientsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredientsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredientsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Errore sconosciuto";
      });
  },
});

export const { clearIngredientError } = ingredientsSlice.actions;
export default ingredientsSlice.reducer;
