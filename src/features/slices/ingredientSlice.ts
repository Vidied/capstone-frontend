import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../api/axiosConfig";
import type {
  Ingredient,
  IngredientRequestDTO,
} from "../../interfaces/Product";
import { extractErrorMessage } from "../../utils/errorUtils";

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
>("ingredients/fetchIngredients", async (_, { rejectWithValue }) => {
  try {
    const response = await API.get<Ingredient[]>("/ingredients");
    return response.data;
  } catch (err) {
    return rejectWithValue(
      extractErrorMessage(
        err,
        "Ingrediente inesistente o errore nel caricamento",
      ),
    );
  }
});

export const createIngredientThunk = createAsyncThunk<
  Ingredient,
  IngredientRequestDTO,
  { rejectValue: string }
>("ingredients/createIngredient", async (data, { rejectWithValue }) => {
  try {
    const response = await API.post<Ingredient>("/ingredients", data);
    return response.data;
  } catch (err) {
    return rejectWithValue(
      extractErrorMessage(err, "Errore durante la creazione dell'ingrediente"),
    );
  }
});

export const updateIngredientThunk = createAsyncThunk<
  Ingredient,
  { id: number; data: IngredientRequestDTO },
  { rejectValue: string }
>("ingredients/updateIngredient", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await API.put<Ingredient>(`/ingredients/${id}`, data);
    return response.data;
  } catch (err) {
    return rejectWithValue(
      extractErrorMessage(err, "Errore durante la modifica dell'ingrediente"),
    );
  }
});

export const deleteIngredientThunk = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("ingredients/deleteIngredient", async (id, { rejectWithValue }) => {
  try {
    await API.delete(`/ingredients/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(
      extractErrorMessage(
        err,
        "Errore durante l'eliminazione dell'ingrediente",
      ),
    );
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
      })
      .addCase(createIngredientThunk.fulfilled, (state, action) => {
        state.ingredients.push(action.payload);
      })
      .addCase(createIngredientThunk.rejected, (state, action) => {
        state.error = action.payload || "Errore durante la creazione";
      })
      .addCase(updateIngredientThunk.fulfilled, (state, action) => {
        const index = state.ingredients.findIndex(
          (i) => i.id === action.payload.id,
        );
        if (index !== -1) {
          state.ingredients[index] = action.payload;
        }
      })
      .addCase(updateIngredientThunk.rejected, (state, action) => {
        state.error = action.payload || "Errore durante la modifica";
      })
      .addCase(deleteIngredientThunk.fulfilled, (state, action) => {
        state.ingredients = state.ingredients.filter(
          (i) => i.id !== action.payload,
        );
      })
      .addCase(deleteIngredientThunk.rejected, (state, action) => {
        state.error = action.payload || "Errore durante l'eliminazione";
      });
  },
});

export const { clearIngredientError } = ingredientsSlice.actions;
export default ingredientsSlice.reducer;
