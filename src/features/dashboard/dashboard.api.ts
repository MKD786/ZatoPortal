import type { DashboardData } from "./dashboard.slice"

export const dashboardApi = {
  getDashboardData: async (): Promise<DashboardData> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          totalClients: {
            count: 128,
            change: 12,
          },
          fileUploads: {
            count: 842,
            change: 68,
          },
          inactiveClients: {
            count: 24,
            change: 3,
          },
          pendingActions: {
            count: 36,
            change: 5,
          },
          clientEngagement: [
            { month: "Jan", meetings: 30, emails: 45, documents: 25 },
            { month: "Feb", meetings: 25, emails: 35, documents: 30 },
            { month: "Mar", meetings: 40, emails: 50, documents: 35 },
            { month: "Apr", meetings: 35, emails: 40, documents: 30 },
            { month: "May", meetings: 30, emails: 35, documents: 25 },
            { month: "Jun", meetings: 25, emails: 30, documents: 35 },
          ],
          recentActivity: [
            {
              user: "John Smith",
              action: "uploaded Bank Statement",
              time: "2 hours ago",
              type: "file",
            },
            {
              user: "Sarah Johnson",
              action: "completed Business Questionnaire",
              time: "3 hours ago",
              type: "form",
            },
            {
              user: "Michael Brown",
              action: "requested Tax Return",
              time: "5 hours ago",
              type: "file",
            },
            {
              user: "Emily Davis",
              action: "updated contact information",
              time: "1 day ago",
              type: "profile",
            },
            {
              user: "Robert Wilson",
              action: "submitted Annual Report",
              time: "2 days ago",
              type: "file",
            },
          ],
        })
      }, 1000)
    })
  },
}
