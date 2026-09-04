import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import API from "../../api/axiosConfig";
import type { AuthResponse, LoginDTO } from "../../interfaces/Auth";
import type { Role, User } from "../../interfaces/User";
import { extractErrorMessage } from "../../utils/errorUtils";

interface AuthorityObject {
  authority: string;
}

type AuthorityItem = string | AuthorityObject;

interface JwtPayLoadCustom {
  sub?: string;
  id?: number;
  email?: string;
  name?: string;
  surname?: string;
  role?: string;
  roles?: string[];
  authorities?: AuthorityItem[];
  exp?: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const decodeToken = (token: string): User | null => {
  try {
    const parsed = jwtDecode<JwtPayLoadCustom>(token);

    let extractedRoles: Role[] = [];

    if (Array.isArray(parsed.roles)) {
      extractedRoles = parsed.roles as Role[];
    } else if (Array.isArray(parsed.authorities)) {
      extractedRoles = parsed.authorities.map((item: AuthorityItem) => {
        if (typeof item === "string") {
          return item as Role;
        }
        return item.authority as Role;
      });
    } else if (parsed.role) {
      extractedRoles = [parsed.role as Role];
    } else {
      extractedRoles = ["ROLE_USER"];
    }

    return {
      id: parsed.id || 0,
      email: parsed.email || parsed.sub || "",
      name: parsed.name || "",
      surname: parsed.surname || "",
      roles: extractedRoles,
    };
  } catch (e) {
    console.error("Errore nella decodifica del token JWT", e);
    return null;
  }
};

const initialToken = localStorage.getItem("token");
const initialUser = initialToken ? decodeToken(initialToken) : null;

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
    return rejectWithValue(
      extractErrorMessage(
        err,
        "Credenziali non valide o errore di connessione",
      ),
    );
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
          state.user = decodeToken(action.payload.accessToken);
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
