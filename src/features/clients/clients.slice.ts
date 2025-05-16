import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { clientsApi } from "./clients.api"

export interface Client {
  id: string
  name: string
  email: string
  company: string
  status: "active" | "inactive"
  lastActivity: string
  tags: string[]
}

interface ClientsState {
  clients: Client[]
  filteredClients: Client[]
  selectedClient: Client | null
  loading: boolean
  error: string | null
  pagination: {
    current: number
    pageSize: number
    total: number
  }
  filters: {
    search: string
    status: string
    tags: string[]
  }
}

const initialState: ClientsState = {
  clients: [],
  filteredClients: [],
  selectedClient: null,
  loading: false,
  error: null,
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
  },
  filters: {
    search: "",
    status: "all",
    tags: [],
  },
}

export const fetchClients = createAsyncThunk("clients/fetchClients", async (_, { rejectWithValue }) => {
  try {
    const data = await clientsApi.getClients()
    return data
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch clients")
  }
})

export const createClient = createAsyncThunk(
  "clients/createClient",
  async (client: Omit<Client, "id">, { rejectWithValue }) => {
    try {
      const data = await clientsApi.createClient(client)
      return data
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to create client")
    }
  },
)

export const updateClient = createAsyncThunk("clients/updateClient", async (client: Client, { rejectWithValue }) => {
  try {
    const data = await clientsApi.updateClient(client)
    return data
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Failed to update client")
  }
})

export const deleteClient = createAsyncThunk("clients/deleteClient", async (id: string, { rejectWithValue }) => {
  try {
    await clientsApi.deleteClient(id)
    return id
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Failed to delete client")
  }
})

const clientsSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {
    setSelectedClient: (state, action) => {
      state.selectedClient = action.payload
    },
    clearSelectedClient: (state) => {
      state.selectedClient = null
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
      state.pagination.current = 1 // Reset to first page when filters change

      // Apply filters
      let filtered = [...state.clients]

      // Search filter
      if (state.filters.search) {
        const searchLower = state.filters.search.toLowerCase()
        filtered = filtered.filter(
          (client) =>
            client.name.toLowerCase().includes(searchLower) ||
            client.email.toLowerCase().includes(searchLower) ||
            client.company.toLowerCase().includes(searchLower),
        )
      }

      // Status filter
      if (state.filters.status !== "all") {
        filtered = filtered.filter((client) => client.status === state.filters.status)
      }

      // Tags filter
      if (state.filters.tags.length > 0) {
        filtered = filtered.filter((client) => state.filters.tags.some((tag) => client.tags.includes(tag)))
      }

      state.filteredClients = filtered
      state.pagination.total = filtered.length
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch clients
      .addCase(fetchClients.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.loading = false
        state.clients = action.payload
        state.filteredClients = action.payload
        state.pagination.total = action.payload.length
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Create client
      .addCase(createClient.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createClient.fulfilled, (state, action) => {
        state.loading = false
        state.clients.push(action.payload)
        state.filteredClients = [...state.clients] // Re-apply filters
        state.pagination.total = state.filteredClients.length
      })
      .addCase(createClient.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Update client
      .addCase(updateClient.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateClient.fulfilled, (state, action) => {
        state.loading = false
        const index = state.clients.findIndex((client) => client.id === action.payload.id)
        if (index !== -1) {
          state.clients[index] = action.payload
        }
        state.filteredClients = [...state.clients] // Re-apply filters
        state.selectedClient = null
      })
      .addCase(updateClient.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Delete client
      .addCase(deleteClient.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.loading = false
        state.clients = state.clients.filter((client) => client.id !== action.payload)
        state.filteredClients = state.filteredClients.filter((client) => client.id !== action.payload)
        state.pagination.total = state.filteredClients.length
      })
      .addCase(deleteClient.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { setSelectedClient, clearSelectedClient, setFilters, setPagination } = clientsSlice.actions

export default clientsSlice.reducer
