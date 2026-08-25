import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import type { Role, User } from "../../interfaces/User";
import type { AuthResponse, LoginDTO } from "../../interfaces/Auth";
import API from "../../api/axiosConfig.ts";
import { AxiosError } from "axios";

interface JwtPayLoadCustom {
  sub?: string;
  id?: number;
  email?: string;
  name?: string;
  surname?: string;
  role?: Role;
  authorities?: string[];
  exp?: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const decondeToken = (token: string): User | null => {
  try {
    const parsed = jwtDecode<JwtPayLoadCustom>(token);

    return {
      id: parsed.id || 0,
      email: parsed.email || parsed.sub || "",
      name: parsed.name || "",
      surname: parsed.surname || "",
      role: (parsed.role || parsed.authorities?.[0] || "ROLE_USER") as Role,
    };
  } catch (e) {
    console.error("Errore nella decodifica del token JWT", e);
    return null;
  }
};

const initialToken = localStorage.getItem("token");
const initialUser = initialToken ? decondeToken(initialToken) : null;

const initialState: AuthState = {
  user: initialUser,
  token: initialToken,
  isAuthenticated: !!initialToken,
  loading: false,
  error: null,
};

export const loginThunk = createAsyncThunk<
  AuthResponse,
  LoginDTO,
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await API.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  } catch (err) {
    let errorMessage = "Credenziali non valide o errore di connesione";

    if (err instanceof AxiosError && err.response?.data?.message) {
      errorMessage = err.response.data.message;
    }

    return rejectWithValue(errorMessage);
  }
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("token");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginThunk.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.loading = false;
          state.token = action.payload.accessToken;
          state.isAuthenticated = true;
          state.user = decondeToken(action.payload.accessToken);
          localStorage.setItem("token", action.payload.accessToken);
        },
      )
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Errore durante l'autenticazione";
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
