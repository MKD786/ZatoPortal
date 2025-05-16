import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../features/auth/auth.slice"
import themeReducer from "../features/theme/theme.slice"
import clientsReducer from "../features/clients/clients.slice"
import dashboardReducer from "../features/dashboard/dashboard.slice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    clients: clientsReducer,
    dashboard: dashboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
