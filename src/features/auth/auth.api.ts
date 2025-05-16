// Mock API service for authentication
// In a real app, this would make actual API calls

interface LoginCredentials {
  email: string
  password: string
}

interface LoginResponse {
  user: {
    id: string
    name: string
    email: string
    role: string
  }
  token: string
}

// Helper to create a JWT token (for mock purposes)
const createMockToken = (email: string): string => {
  // Create a mock payload with an expiry 8 hours from now
  const payload = {
    sub: "user123",
    email,
    role: email === "cafirm@zatohq.com" ? "admin" : email === "support@zatohq.com" ? "support" : "client",
    exp: Math.floor(Date.now() / 1000) + 8 * 60 * 60, // 8 hours
  }

  // In a real app, this would be signed properly
  // This is just for demonstration
  const base64Payload = btoa(JSON.stringify(payload))
  return `header.${base64Payload}.signature`
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock validation
        if (credentials.email && credentials.password) {
          if (credentials.email === "cafirm@zatohq.com" && credentials.password === "password") {
            resolve({
              user: {
                id: "user123",
                name: "Sample CA Firm",
                email: credentials.email,
                role: "admin",
              },
              token: createMockToken(credentials.email),
            })
          } else if (credentials.email === "client@zatohq.com" && credentials.password === "password") {
            resolve({
              user: {
                id: "client123",
                name: "Sample Client",
                email: credentials.email,
                role: "client",
              },
              token: createMockToken(credentials.email),
            })
          } else if (credentials.email === "support@zatohq.com" && credentials.password === "password") {
            resolve({
              user: {
                id: "support123",
                name: "Zato Support",
                email: credentials.email,
                role: "support",
              },
              token: createMockToken(credentials.email),
            })
          }else {
            reject(new Error("Invalid credentials"))
          }
        } else {
          reject(new Error("Invalid credentials"))
        }
      }, 800) // Simulate network delay
    })
  },
}
