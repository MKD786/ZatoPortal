import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { dashboardApi } from "./dashboard.api"

export interface DashboardData {
  totalClients: {
    count: number
    change: number
  }
  fileUploads: {
    count: number
    change: number
  }
  inactiveClients: {
    count: number
    change: number
  }
  pendingActions: {
    count: number
    change: number
  }
  clientEngagement: Array<{
    month: string
    meetings: number
    emails: number
    documents: number
  }>
  recentActivity: Array<{
    user: string
    action: string
    time: string
    type: string
  }>
}

interface DashboardState {
  data: DashboardData | null
  loading: boolean
  error: string | null
}

const initialState: DashboardState = {
  data: null,
  loading: false,
  error: null,
}

export const fetchDashboardData = createAsyncThunk("dashboard/fetchData", async (_, { rejectWithValue }) => {
  try {
    const data = await dashboardApi.getDashboardData()
    return data
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch dashboard data")
  }
})

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default dashboardSlice.reducer
