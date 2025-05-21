import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { authApi } from "./auth.api"

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  tokenExpired: boolean
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  tokenExpired: false,
  loading: false,
  error: null,
}

// Get token from session storage
const getStoredToken = (): string | null => {
  return sessionStorage.getItem("token")
}

// Get user from session storage
const getStoredUser = (): User | null => {
  const userStr = sessionStorage.getItem("user")
  return userStr ? JSON.parse(userStr) : null
}

// Check if token is expired
const isTokenExpired = (token: string): boolean => {
  if (!token) return true

  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    const expiry = payload.exp * 1000 // Convert to milliseconds
    return Date.now() >= expiry
  } catch (error) {
    return true
  }
}

// Login thunk
export const login = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials)

      // Store token and user in session storage
      sessionStorage.setItem("token", response.token)
      sessionStorage.setItem("user", JSON.stringify(response.user))

      return response
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Login failed")
    }
  },
)

// Check token expiry thunk
export const checkTokenExpiry = createAsyncThunk("auth/checkTokenExpiry", async (_, { dispatch, getState }) => {
  const state = getState() as { auth: AuthState }
  const token = state.auth.token

  if (token && isTokenExpired(token)) {
    // Clear auth state and storage if token is expired
    dispatch(logout())
    return true
  }

  return false
})

const authSlice = createSlice({
  name: "auth",
  initialState: {
    ...initialState,
    // Initialize from session storage
    token: getStoredToken(),
    user: getStoredUser(),
    isAuthenticated: !!getStoredToken() && !isTokenExpired(getStoredToken() || ""),
  },
  reducers: {
    logout: (state) => {
      // Clear session storage
      sessionStorage.removeItem("token")
      sessionStorage.removeItem("user")
      localStorage.removeItem("selectedCompany")

      // Reset state
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.tokenExpired = false
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        state.tokenExpired = false
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Check token expiry
      .addCase(checkTokenExpiry.fulfilled, (state, action) => {
        state.tokenExpired = action.payload
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
