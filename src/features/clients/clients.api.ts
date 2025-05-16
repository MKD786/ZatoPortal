import type { Client } from "./clients.slice"

// Mock client data
const mockClients: Client[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    company: "Smith Enterprises",
    status: "active",
    lastActivity: "2 hours ago",
    tags: ["tax", "accounting"],
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    company: "Johnson & Co",
    status: "active",
    lastActivity: "3 hours ago",
    tags: ["payroll", "tax"],
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    company: "Brown Industries",
    status: "active",
    lastActivity: "5 hours ago",
    tags: ["accounting", "advisory"],
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    company: "Davis Consulting",
    status: "inactive",
    lastActivity: "1 day ago",
    tags: ["tax", "compliance"],
  },
  {
    id: "5",
    name: "Robert Wilson",
    email: "robert.wilson@example.com",
    company: "Wilson Ltd",
    status: "active",
    lastActivity: "2 days ago",
    tags: ["advisory", "tax"],
  },
]

export const clientsApi = {
  getClients: async (): Promise<Client[]> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockClients])
      }, 800)
    })
  },

  createClient: async (client: Omit<Client, "id">): Promise<Client> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const newClient = {
          ...client,
          id: Math.random().toString(36).substring(2, 9),
        }
        mockClients.push(newClient)
        resolve(newClient)
      }, 800)
    })
  },

  updateClient: async (client: Client): Promise<Client> => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockClients.findIndex((c) => c.id === client.id)
        if (index !== -1) {
          mockClients[index] = client
          resolve(client)
        } else {
          reject(new Error("Client not found"))
        }
      }, 800)
    })
  },

  deleteClient: async (id: string): Promise<void> => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockClients.findIndex((c) => c.id === id)
        if (index !== -1) {
          mockClients.splice(index, 1)
          resolve()
        } else {
          reject(new Error("Client not found"))
        }
      }, 800)
    })
  },
}
