import { useState, useMemo, useEffect } from "react"
import {
  Download,
  Search,
  ArrowUpDown,
  X,
  Columns,
  Check,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import {
  Table,
  Card,
  Input,
  Select,
  Checkbox,
  Button,
  Dropdown,
  Modal,
  DatePicker,
  Divider,
  Tag,
  Row,
  Col,
  Space,
  Popover,
  notification,
  Progress,
} from "antd"
import { BarChartOutlined, BankOutlined, FileTextOutlined } from "@ant-design/icons"
import type { MenuProps } from "antd"
import type { ColumnsType } from "antd/es/table"
import type dayjs from "dayjs"

// Add this style element for centered popovers with background opacity
const popoverStyle = document.createElement("style")
popoverStyle.innerHTML = `
  .centered-popover {
    position: fixed !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    z-index: 1050 !important;
  }
  
  .ant-popover-open::after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 1000;
  }
`
document.head.appendChild(popoverStyle)

interface Job {
  id: string
  client: string
  name: string
  priority: string
  state: string
  timeBudget: string
  start: string
  due: string
  staffAssigned: string
  managerAssigned: string
  partnerAssigned: string
  overdue?: boolean
}

interface ColumnConfig {
  id: string
  name: string
  key: keyof Job
  defaultVisible: boolean
}

interface ClientSummary {
  name: string
  jobCount: number
  jobTypes: string[]
  latestDueDate: string
  dominantStatus: string
}

interface Metrics {
  totalJobs: number
  byStateCategory: {
    notStarted: number
    inProgress: number
    review: number
    completed: number
    onHold: number
  }
  byType: Record<string, number>
  byClient: Record<string, number>
  overdue: number
  dueThisWeek: number
  completionRate: number
}

const initialJobsData: Job[] = [
  {
    id: "J000379",
    client: "Westfield Consulting Group",
    name: "GST Return",
    priority: "Normal",
    state: "06. For review",
    timeBudget: "0%",
    start: "1 Apr 2023",
    due: "31 May 2023",
    staffAssigned: "Emily Parker",
    managerAssigned: "Michael Thompson",
    partnerAssigned: "Sarah Richardson",
  },
  {
    id: "J000384",
    client: "Harrison & Sons Ltd",
    name: "Annual Accounts",
    priority: "Normal",
    state: "03. Ready to start",
    timeBudget: "0%",
    start: "6 Jun 2023",
    due: "6 Jun 2023",
    staffAssigned: "Daniel Wilson",
    managerAssigned: "Jennifer Adams",
    partnerAssigned: "Robert Mitchell",
  },
  {
    id: "J000371",
    client: "Greenwood Financial Services",
    name: "Annual Accounts",
    priority: "Normal",
    state: "01. Planned",
    timeBudget: "0%",
    start: "3 Apr 2023",
    due: "31 Mar 2024",
    staffAssigned: "Olivia Bennett",
    managerAssigned: "Christopher Davis",
    partnerAssigned: "Elizabeth Wilson",
  },
  {
    id: "J000489",
    client: "Riverside Medical Center",
    name: "GST Return",
    priority: "Normal",
    state: "01. Planned",
    timeBudget: "0%",
    start: "31 Mar 2025",
    due: "31 Mar 2026",
    staffAssigned: "James Anderson",
    managerAssigned: "Sophia Martinez",
    partnerAssigned: "William Johnson",
  },
  {
    id: "J000406",
    client: "Oakridge Properties Inc",
    name: "Annual Accounts",
    priority: "Normal",
    state: "01. Planned",
    timeBudget: "0%",
    start: "14 Mar 2024",
    due: "31 Mar 2024",
    staffAssigned: "Emma Thompson",
    managerAssigned: "David Wilson",
    partnerAssigned: "Catherine Brooks",
  },
  {
    id: "J000486",
    client: "Northstar Technologies",
    name: "Annual Accounts",
    priority: "Normal",
    state: "01. Planned",
    timeBudget: "0%",
    start: "28 Apr 2025",
    due: "31 Mar 2026",
    staffAssigned: "Thomas Reynolds",
    managerAssigned: "Natalie Parker",
    partnerAssigned: "Jonathan Hughes",
  },
  {
    id: "J000462",
    client: "Silverstone Automotive",
    name: "Annual Accounts",
    priority: "Normal",
    state: "01. Planned",
    timeBudget: "0%",
    start: "16 Jan 2025",
    due: "16 Jan 2035",
    staffAssigned: "Rebecca Collins",
    managerAssigned: "Andrew Peterson",
    partnerAssigned: "Victoria Hamilton",
  },
  {
    id: "J000457",
    client: "Bluewater Shipping Co",
    name: "Annual Accounts",
    priority: "Normal",
    state: "01. Planned",
    timeBudget: "0%",
    start: "18 Nov 2024",
    due: "18 Nov 2034",
    staffAssigned: "Matthew Clarke",
    managerAssigned: "Laura Stevens",
    partnerAssigned: "Richard Bennett",
  },
  {
    id: "J000400",
    client: "Sunnyvale Farms Ltd",
    name: "Reviews",
    priority: "Normal",
    state: "01. Planned",
    timeBudget: "0%",
    start: "8 Dec 2023",
    due: "31 Mar 2024",
    staffAssigned: "Jessica Wright",
    managerAssigned: "Benjamin Foster",
    partnerAssigned: "Alexandra Morgan",
  },
  {
    id: "J000001",
    client: "Smith Enterprises",
    name: "Annual Accounts",
    priority: "High",
    state: "02. In Progress",
    timeBudget: "45%",
    start: "15 Jan 2023",
    due: "15 Apr 2023",
    staffAssigned: "John Smith",
    managerAssigned: "Jane Doe",
    partnerAssigned: "Robert Johnson",
  },
  {
    id: "J000002",
    client: "Jack & Jill Co",
    name: "GST Return",
    priority: "Medium",
    state: "04. Under Review",
    timeBudget: "75%",
    start: "1 Feb 2023",
    due: "1 May 2023",
    staffAssigned: "Alice Brown",
    managerAssigned: "Bob White",
    partnerAssigned: "Carol Green",
  },
  {
    id: "J000003",
    client: "Tech Solutions Inc",
    name: "Annual Accounts",
    priority: "High",
    state: "05. Queries",
    timeBudget: "60%",
    start: "10 Mar 2023",
    due: "10 Jun 2023",
    staffAssigned: "David Lee",
    managerAssigned: "Sarah Johnson",
    partnerAssigned: "Michael Brown",
  },
  {
    id: "J000004",
    client: "Global Logistics Ltd",
    name: "GST Return",
    priority: "Normal",
    state: "07. Review points",
    timeBudget: "85%",
    start: "5 Apr 2023",
    due: "5 Jul 2023",
    staffAssigned: "Jennifer Wilson",
    managerAssigned: "Robert Davis",
    partnerAssigned: "Elizabeth Taylor",
  },
  {
    id: "J000005",
    client: "Sunrise Bakery",
    name: "Annual Accounts",
    priority: "Low",
    state: "11. Completed",
    timeBudget: "100%",
    start: "20 Jan 2023",
    due: "20 Apr 2023",
    staffAssigned: "Christopher Martin",
    managerAssigned: "Amanda White",
    partnerAssigned: "Thomas Brown",
  },
]

const priorityOptions = ["Urgent", "High", "Normal", "Low"]

const stateOptions = [
  "01. Planned",
  "02. Requested documents",
  "03. Ready to start",
  "04. In progress",
  "05. Queries",
  "06. For review",
  "07. Review points",
  "08. Drafts",
  "09. Sent for Signing",
  "10. Finalising",
  "11. Completed",
  "12. Cancelled",
]

const stateCategories = {
  notStarted: ["01. Planned", "02. Requested documents", "03. Ready to start"],
  inProgress: ["04. In progress", "05. Queries", "08. Drafts"],
  review: ["06. For review", "07. Review points", "09. Sent for Signing"],
  completed: ["10. Finalising", "11. Completed"],
  onHold: ["12. Cancelled"],
}

const getStateCategory = (state: string) => {
  if (stateCategories.notStarted.includes(state)) return "notStarted"
  if (stateCategories.inProgress.includes(state)) return "inProgress"
  if (stateCategories.review.includes(state)) return "review"
  if (stateCategories.completed.includes(state)) return "completed"
  if (stateCategories.onHold.includes(state)) return "onHold"
  return "other"
}

const StateBadge = ({ state }: { state: string }) => {
  const category = getStateCategory(state)

  const colorMap: Record<string, string> = {
    notStarted: "blue",
    inProgress: "orange",
    review: "purple",
    completed: "green",
    onHold: "red",
    other: "default",
  }

  return (
    <Tag color={colorMap[category]} style={{ fontWeight: 500 }}>
      {state}
    </Tag>
  )
}

const PriorityBadge = ({ priority }: { priority: string }) => {
  const colorMap: Record<string, string> = {
    Urgent: "red",
    High: "red",
    Medium: "orange",
    Normal: "blue",
    Low: "green",
  }

  return (
    <Tag color={colorMap[priority]} style={{ fontWeight: 500 }}>
      {priority}
    </Tag>
  )
}

const isJobOverdue = (job: Job) => {
  const today = new Date()
  const dueDate = new Date(job.due)
  return dueDate < today && !stateCategories.completed.includes(job.state)
}

const allColumns: ColumnConfig[] = [
  { id: "jobNumber", name: "Job number", key: "id", defaultVisible: true },
  { id: "client", name: "Client", key: "client", defaultVisible: true },
  { id: "name", name: "Name", key: "name", defaultVisible: true },
  { id: "priority", name: "Priority", key: "priority", defaultVisible: true },
  { id: "state", name: "State", key: "state", defaultVisible: true },
  { id: "timeBudget", name: "Time budget", key: "timeBudget", defaultVisible: true },
  { id: "start", name: "Start", key: "start", defaultVisible: true },
  { id: "due", name: "Due", key: "due", defaultVisible: true },
  { id: "overdue", name: "Overdue", key: "overdue", defaultVisible: true },
  { id: "staffAssigned", name: "Staff assigned", key: "staffAssigned", defaultVisible: true },
]

const JobsNewScreen = () => {
  const [statusPopoverOpen, setStatusPopoverOpen] = useState(false)
  const [clientPopoverOpen, setClientPopoverOpen] = useState(false)
  const [jobTypePopoverOpen, setJobTypePopoverOpen] = useState(false)

  // State for the actual jobs data that will be modified
  const [jobsData, setJobsData] = useState<Job[]>(initialJobsData)

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedClient, setSelectedClient] = useState<string | null>(null)
  const [selectedName, setSelectedName] = useState<string | null>(null)
  const [selectedState, setSelectedState] = useState<string | null>(null)
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null)
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null)
  const [sortConfig, setSortConfig] = useState<{ key: keyof Job; direction: "asc" | "desc" }>({
    key: "id",
    direction: "asc",
  })
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    allColumns.filter((col) => col.defaultVisible).map((col) => col.id),
  )
  const [selectedJobs, setSelectedJobs] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [bulkActionType, setBulkActionType] = useState<string | null>(null)
  const [bulkActionValue, setBulkActionValue] = useState<string>("")
  const [bulkActionDate, setBulkActionDate] = useState<dayjs.Dayjs | null>(null)
  const [showBulkActionDialog, setShowBulkActionDialog] = useState(false)
  const [clientPage, setClientPage] = useState(0)
  const [clientSearchQuery, setClientSearchQuery] = useState("")
  const [jobsPage, setJobsPage] = useState(0)
  const [jobsPerPage] = useState(10)
  const [isApplyingBulkAction, setIsApplyingBulkAction] = useState(false)

  const clients = useMemo(() => [...new Set(jobsData.map((job) => job.client))], [jobsData])
  const names = useMemo(() => [...new Set(jobsData.map((job) => job.name))], [jobsData])
  const states = useMemo(() => [...new Set(jobsData.map((job) => job.state))], [jobsData])
  const staffMembers = useMemo(() => [...new Set(jobsData.map((job) => job.staffAssigned))], [jobsData])

  // Filtered and sorted data based on search, filters, and sorting
  const [filteredAndSortedData, setFilteredAndSortedData] = useState<Job[]>([...jobsData])

  // Function to handle "Check all" for columns
  const handleSelectAllColumns = (checked: boolean) => {
    if (checked) {
      setVisibleColumns(allColumns.map((col) => col.id))
    } else {
      setVisibleColumns([])
    }
  }

  useEffect(() => {
    let filtered = [...jobsData]

    filtered = filtered.map((job) => ({
      ...job,
      overdue: isJobOverdue(job),
    }))

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (job) =>
          job.id.toLowerCase().includes(query) ||
          job.client.toLowerCase().includes(query) ||
          job.name.toLowerCase().includes(query) ||
          job.state.toLowerCase().includes(query) ||
          job.staffAssigned.toLowerCase().includes(query),
      )
    }

    if (selectedClient) {
      filtered = filtered.filter((job) => job.client === selectedClient)
    }

    if (selectedName) {
      filtered = filtered.filter((job) => job.name === selectedName)
    }

    if (selectedState) {
      filtered = filtered.filter((job) => job.state === selectedState)
    }

    if (selectedPriority) {
      filtered = filtered.filter((job) => job.priority === selectedPriority)
    }

    if (selectedStaff) {
      filtered = filtered.filter((job) => job.staffAssigned === selectedStaff)
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (sortConfig.key === "overdue") {
          return sortConfig.direction === "asc"
            ? a.overdue === b.overdue
              ? 0
              : a.overdue
                ? -1
                : 1
            : a.overdue === b.overdue
              ? 0
              : a.overdue
                ? 1
                : -1
        }

        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1
        }
        return 0
      })
    }

    setFilteredAndSortedData(filtered)
  }, [jobsData, searchQuery, selectedClient, selectedName, selectedState, selectedPriority, selectedStaff, sortConfig])

  const metrics: Metrics = useMemo(() => {
    const totalJobs = jobsData.length
    const today = new Date()

    const byStateCategory = {
      notStarted: 0,
      inProgress: 0,
      review: 0,
      completed: 0,
      onHold: 0,
    }

    jobsData.forEach((job) => {
      const category = getStateCategory(job.state)
      byStateCategory[category as keyof typeof byStateCategory]++
    })

    const byType: Record<string, number> = {}
    jobsData.forEach((job) => {
      byType[job.name] = (byType[job.name] || 0) + 1
    })

    const byClient: Record<string, number> = {}
    jobsData.forEach((job) => {
      byClient[job.client] = (byClient[job.client] || 0) + 1
    })

    const overdue = jobsData.filter((job) => {
      const dueDate = new Date(job.due)
      return dueDate < today && !stateCategories.completed.includes(job.state)
    }).length

    const dueThisWeek = jobsData.filter((job) => {
      const dueDate = new Date(job.due)
      const nextWeek = new Date(today)
      nextWeek.setDate(today.getDate() + 7)
      return dueDate >= today && dueDate <= nextWeek && !stateCategories.completed.includes(job.state)
    }).length

    return {
      totalJobs,
      byStateCategory,
      byType,
      byClient,
      overdue,
      dueThisWeek,
      completionRate: Math.round((byStateCategory.completed / totalJobs) * 100),
    }
  }, [jobsData])

  const filteredClients = useMemo(() => {
    const clientsWithData: ClientSummary[] = clients.map((clientName) => {
      const clientJobs = jobsData.filter((job) => job.client === clientName)
      const jobTypes = [...new Set(clientJobs.map((job) => job.name))]
      const latestDueDate = clientJobs.sort((a, b) => new Date(b.due).getTime() - new Date(a.due).getTime())[0]?.due

      const statusBreakdown = {
        notStarted: 0,
        inProgress: 0,
        review: 0,
        completed: 0,
        onHold: 0,
      }

      clientJobs.forEach((job) => {
        const category = getStateCategory(job.state)
        statusBreakdown[category as keyof typeof statusBreakdown]++
      })

      const dominantStatus = Object.entries(statusBreakdown).sort((a, b) => b[1] - a[1])[0][0]

      return {
        name: clientName,
        jobCount: clientJobs.length,
        jobTypes,
        latestDueDate: latestDueDate || "",
        dominantStatus,
      }
    })

    let filtered = clientsWithData
    if (clientSearchQuery) {
      const query = clientSearchQuery.toLowerCase()
      filtered = filtered.filter(
        (client) =>
          client.name.toLowerCase().includes(query) ||
          client.jobTypes.some((type) => type.toLowerCase().includes(query)) ||
          client.dominantStatus.toLowerCase().includes(query),
      )
    }

    filtered.sort((a, b) => b.jobCount - a.jobCount)

    return filtered
  }, [jobsData, clientSearchQuery, clients])

//   const paginatedClients = useMemo(() => {
//     const startIndex = clientPage * clientsPerPage
//     return filteredClients.slice(startIndex, startIndex + clientsPerPage)
//   }, [filteredClients, clientPage, clientsPerPage])

  const paginatedJobs = useMemo(() => {
    const startIndex = jobsPage * jobsPerPage
    return filteredAndSortedData.slice(startIndex, startIndex + jobsPerPage)
  }, [filteredAndSortedData, jobsPage, jobsPerPage])

  const nextJobsPage = () => {
    if ((jobsPage + 1) * jobsPerPage < filteredAndSortedData.length) {
      setJobsPage(jobsPage + 1)
    }
  }

  const prevJobsPage = () => {
    if (jobsPage > 0) {
      setJobsPage(jobsPage - 1)
    }
  }

  const handleSort = (key: keyof Job) => {
    let direction: "asc" | "desc" = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedClient(null)
    setSelectedName(null)
    setSelectedState(null)
    setSelectedPriority(null)
    setSelectedStaff(null)
  }

  const handleSelectJob = (jobId: string) => {
    setSelectedJobs((prev) => {
      if (prev.includes(jobId)) {
        return prev.filter((id) => id !== jobId)
      } else {
        return [...prev, jobId]
      }
    })
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedJobs([])
    } else {
      setSelectedJobs(filteredAndSortedData.map((job) => job.id))
    }
    setSelectAll(!selectAll)
  }

  useEffect(() => {
    if (selectedJobs.length === filteredAndSortedData.length && filteredAndSortedData.length > 0) {
      setSelectAll(true)
    } else {
      setSelectAll(false)
    }
  }, [selectedJobs, filteredAndSortedData])

  const handleBulkAction = (action: string) => {
    setBulkActionType(action)
    setBulkActionValue("")
    setBulkActionDate(null)
    setShowBulkActionDialog(true)
  }

  // Function to format a date to match the format used in the jobs data
  const formatDate = (date: dayjs.Dayjs): string => {
    return date.format("D MMM YYYY")
  }

  // Updated bulk action function that actually applies changes
  const applyBulkAction = () => {
    if (!bulkActionType) return

    // Validation checks
    if (bulkActionType === "state" && !bulkActionValue) {
      notification.error({
        message: "State Required",
        description: "Please select a state to continue",
      })
      return
    }

    if (bulkActionType === "staff" && !bulkActionValue) {
      notification.error({
        message: "Staff Required",
        description: "Please select a staff member to continue",
      })
      return
    }

    if ((bulkActionType === "startDate" || bulkActionType === "dueDate") && !bulkActionDate) {
      notification.error({
        message: "Date Required",
        description: "Please select a date to continue",
      })
      return
    }

    setIsApplyingBulkAction(true)

    // Create a copy of the jobs data to modify
    const updatedJobsData = [...jobsData].map((job) => {
      // If this job is not selected, return it unchanged
      if (!selectedJobs.includes(job.id)) return job

      // Create a copy of the job to modify
      const updatedJob = { ...job }

      // Apply the appropriate change based on the action type
      if (bulkActionType === "startDate" && bulkActionDate) {
        updatedJob.start = formatDate(bulkActionDate)
      } else if (bulkActionType === "dueDate" && bulkActionDate) {
        updatedJob.due = formatDate(bulkActionDate)
      } else if (bulkActionType === "staff" && bulkActionValue) {
        updatedJob.staffAssigned = bulkActionValue
      } else if (bulkActionType === "state" && bulkActionValue) {
        updatedJob.state = bulkActionValue
        // Ensure the state is properly updated by forcing a re-render
        updatedJob.overdue = isJobOverdue({ ...updatedJob })
      }

      return updatedJob
    })

    // Force a complete UI refresh by updating the data in a separate operation
    setTimeout(() => {
      // Update the jobs data state with the new data
      setJobsData(updatedJobsData)

      // Show success notification
      notification.success({
        message: "Bulk Update Complete",
        description: `Successfully updated ${selectedJobs.length} jobs`,
        duration: 3,
      })

      // Clean up
      setShowBulkActionDialog(false)
      setSelectedJobs([])
      setSelectAll(false)
      setIsApplyingBulkAction(false)

      // Force a re-render of the filtered data
      setFilteredAndSortedData([...updatedJobsData])
    }, 100)
  }

  const toggleColumnVisibility = (columnId: string) => {
    setVisibleColumns((prev) => {
      if (prev.includes(columnId)) {
        return prev.filter((id) => id !== columnId)
      } else {
        return [...prev, columnId]
      }
    })
  }

//   const nextClientPage = () => {
//     if ((clientPage + 1) * clientsPerPage < filteredClients.length) {
//       setClientPage(clientPage + 1)
//     }
//   }

//   const prevClientPage = () => {
//     if (clientPage > 0) {
//       setClientPage(clientPage - 1)
//     }
//   }

  const exportToCSV = () => {
    const headers = allColumns.filter((col) => visibleColumns.includes(col.id)).map((col) => col.name)
    let csvContent = headers.join(",") + "\n"

    filteredAndSortedData.forEach((job) => {
      const row = allColumns
        .filter((col) => visibleColumns.includes(col.id))
        .map((col) => {
          if (col.id === "overdue") {
            return job.overdue ? "Yes" : "No"
          }
          const value = String(job[col.key] || "")
          return value.includes(",") ? `"${value}"` : value
        })
        .join(",")

      csvContent += row + "\n"
    })

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "jobs_export.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const columns: ColumnsType<Job> = [
    {
      title: <Checkbox checked={selectAll} onChange={handleSelectAll} />,
      key: "selection",
      width: 40,
      render: (_, record) => (
        <Checkbox checked={selectedJobs.includes(record.id)} onChange={() => handleSelectJob(record.id)} />
      ),
    },
    ...allColumns
      .filter((col) => visibleColumns.includes(col.id))
      .map((col) => ({
        title: (
          <div
            className="flex items-center cursor-pointer"
            onClick={() => handleSort(col.key)}
            style={{ fontWeight: 550, color: "#4B5563", display: "flex", alignItems: "center", gap: "8px" }}
          >
            {col.name}
            <div style={{ transform: "scale(0.6)" }}>
              <ArrowUpDown className="ml-1 h-4 w-4" />
            </div>
          </div>
        ),
        dataIndex: col.key,
        key: col.key,
        width: col.id === "state" ? 210 : undefined,
        align: col.id === "timeBudget" ? ("center" as const) : undefined,

        render: (value: any, record: Job) => {
          if (col.id === "priority") {
            return (
              <Select
                defaultValue={value}
                onChange={(val) => {
                  // Update the job's priority
                  const updatedJobsData = jobsData.map((job) =>
                    job.id === record.id ? { ...job, priority: val } : job,
                  )
                  setJobsData(updatedJobsData)
                }}
                style={{ width: "100%" }}
                bordered={false}
                dropdownMatchSelectWidth={false}
              >
                {priorityOptions.map((option) => (
                  <Select.Option key={option} value={option}>
                    <PriorityBadge priority={option} />
                  </Select.Option>
                ))}
              </Select>
            )
          }
          if (col.id === "state") {
            return (
              <Select
                value={value} // Change from defaultValue to value to ensure it updates when the data changes
                onChange={(val) => {
                  // Update the job's state
                  const updatedJobsData = jobsData.map((job) => (job.id === record.id ? { ...job, state: val } : job))
                  setJobsData(updatedJobsData)
                }}
                style={{ width: "100%" }}
                bordered={false}
                dropdownMatchSelectWidth={false}
              >
                {stateOptions.map((option) => (
                  <Select.Option key={option} value={option}>
                    <StateBadge state={option} />
                  </Select.Option>
                ))}
              </Select>
            )
          }
          if (col.id === "overdue") {
            return record.overdue ? (
              <div style={{ color: "#ff0000" }}>
                <AlertTriangle size={20} className="h-4 w-4" />
              </div>
            ) : null
          }
          if (col.id === "timeBudget") {
            return <div style={{ textAlign: "center" }}>{value}</div>
          }
          return <span style={{ fontSize: "0.8rem", color: "#374151" }}>{value}</span>
        },
      })),
  ]

  const columnItems: MenuProps["items"] = [
    {
      key: "selectAll",
      label: (
        <div style={{ display: "flex", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}>
          <Checkbox
            checked={visibleColumns.length === allColumns.length}
            indeterminate={visibleColumns.length > 0 && visibleColumns.length < allColumns.length}
            onChange={(e) => handleSelectAllColumns(e.target.checked)}
            onClick={(e) => e.stopPropagation()}
          />
          <span style={{ marginLeft: "16px", fontWeight: 500 }}>Check All</span>
        </div>
      ),
      onClick: (e) => e.domEvent.stopPropagation(),
    },
    { type: "divider" },
    ...allColumns.map((col) => ({
      key: col.id,
      label: (
        <div style={{ display: "flex", alignItems: "center", padding: "8px 0" }}>
          <Checkbox
            checked={visibleColumns.includes(col.id)}
            onChange={() => toggleColumnVisibility(col.id)}
            onClick={(e) => e.stopPropagation()}
          />
          <span style={{ marginLeft: "16px" }}>{col.name}</span>
        </div>
      ),
      onClick: (e: any) => {
        e.domEvent.stopPropagation()
        toggleColumnVisibility(col.id)
      },
    })),
  ]

  const bulkActionItems: MenuProps["items"] = [
    { key: "startDate", label: "Start date", icon: null },
    { key: "dueDate", label: "Due date", icon: null },
    { type: "divider" },
    { key: "staff", label: "Staff", icon: null },
    { key: "state", label: "State", icon: null },
  ]

  const statusSummaryContent = (
    <div style={{ width: 300, padding: 16 }}>
      <p style={{ marginBottom: 16 }}>Overview of jobs by current status</p>

      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span>Total Jobs:</span>
          <span style={{ fontWeight: 600 }}>{metrics.totalJobs}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span>Overdue Jobs:</span>
          <span style={{ fontWeight: 600, color: "#e53e3e" }}>{metrics.overdue}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span>Due This Week:</span>
          <span style={{ fontWeight: 600, color: "#dd6b20" }}>{metrics.dueThisWeek}</span>
        </div>
      </div>

      <Divider style={{ margin: "16px 0" }} />
      <h4 style={{ marginBottom: 16 }}>Status Breakdown</h4>

      <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
          <Tag color="blue" style={{ marginRight: 8 }}>
            Not Started
          </Tag>
          <span style={{ marginRight: 8 }}>
            ({Math.round((metrics.byStateCategory.notStarted / metrics.totalJobs) * 100)}%)
          </span>
          <span style={{ marginLeft: "auto", fontWeight: 600 }}>{metrics.byStateCategory.notStarted}</span>
        </div>
        <Progress
          percent={Math.round((metrics.byStateCategory.notStarted / metrics.totalJobs) * 100)}
          showInfo={false}
          strokeColor="#1890ff"
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
          <Tag color="orange" style={{ marginRight: 8 }}>
            In Progress
          </Tag>
          <span style={{ marginRight: 8 }}>
            ({Math.round((metrics.byStateCategory.inProgress / metrics.totalJobs) * 100)}%)
          </span>
          <span style={{ marginLeft: "auto", fontWeight: 600 }}>{metrics.byStateCategory.inProgress}</span>
        </div>
        <Progress
          percent={Math.round((metrics.byStateCategory.inProgress / metrics.totalJobs) * 100)}
          showInfo={false}
          strokeColor="#fa8c16"
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
          <Tag color="purple" style={{ marginRight: 8 }}>
            Review
          </Tag>
          <span style={{ marginRight: 8 }}>
            ({Math.round((metrics.byStateCategory.review / metrics.totalJobs) * 100)}%)
          </span>
          <span style={{ marginLeft: "auto", fontWeight: 600 }}>{metrics.byStateCategory.review}</span>
        </div>
        <Progress
          percent={Math.round((metrics.byStateCategory.review / metrics.totalJobs) * 100)}
          showInfo={false}
          strokeColor="#722ed1"
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
          <Tag color="green" style={{ marginRight: 8 }}>
            Completed
          </Tag>
          <span style={{ marginRight: 8 }}>
            ({Math.round((metrics.byStateCategory.completed / metrics.totalJobs) * 100)}%)
          </span>
          <span style={{ marginLeft: "auto", fontWeight: 600 }}>{metrics.byStateCategory.completed}</span>
        </div>
        <Progress
          percent={Math.round((metrics.byStateCategory.completed / metrics.totalJobs) * 100)}
          showInfo={false}
          strokeColor="#52c41a"
        />
      </div>
    </div>
  )

  const jobTypeSummaryContent = (
    <div style={{ width: 300, padding: 16 }}>
      <p style={{ marginBottom: 16 }}>Overview of jobs by type</p>

      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span>Total Job Types:</span>
          <span style={{ fontWeight: 600 }}>{Object.keys(metrics.byType).length}</span>
        </div>
      </div>

      <Divider style={{ margin: "16px 0" }} />
      <h4 style={{ marginBottom: 16 }}>Type Breakdown</h4>

      {Object.entries(metrics.byType)
        .sort((a, b) => b[1] - a[1])
        .map(([type, count], index) => {
          const percent = Math.round((count / metrics.totalJobs) * 100)
          const colors = ["blue", "green", "purple"]
          return (
            <div key={type} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
                <Tag color={colors[index % colors.length]} style={{ marginRight: 8 }}>
                  {type}
                </Tag>
                <span style={{ marginRight: 8 }}>({percent}%)</span>
                <span style={{ marginLeft: "auto", fontWeight: 600 }}>{count}</span>
              </div>
              <Progress percent={percent} showInfo={false} strokeColor={colors[index % colors.length]} />
            </div>
          )
        })}
    </div>
  )

  const clientSummaryContent = (
    <div style={{ width: 600, height: "auto", maxHeight: "80vh", padding: 16 }}>
      <p style={{ marginBottom: 16 }}>Overview of clients and their jobs</p>

      <Input.Search
        placeholder="Search clients..."
        style={{ marginBottom: 16 }}
        onSearch={(value) => setClientSearchQuery(value)}
        onChange={(e) => setClientSearchQuery(e.target.value)}
        value={clientSearchQuery}
      />

      <Table
        columns={[
          {
            title: "Client",
            dataIndex: "client",
            key: "client",
            ellipsis: true,
            width: 200,
          },
          {
            title: "Jobs",
            dataIndex: "jobs",
            key: "jobs",
            width: 60,
          },
          {
            title: "Job Types",
            dataIndex: "jobType",
            key: "jobType",
            width: 120,
            render: (text: string) => <Tag color="blue">{text}</Tag>,
          },
          {
            title: "Latest Due Date",
            dataIndex: "due",
            key: "due",
            width: 100,
          },
          {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: 120,
            render: (status: string) => {
              const colorMap: Record<string, string> = {
                Review: "purple",
                "Not Started": "blue",
                "In Progress": "orange",
                Completed: "green",
                "On Hold": "red",
              }
              return <Tag color={colorMap[status] || "default"}>{status}</Tag>
            },
          },
        ]}
        dataSource={filteredClients.map((client) => ({
          client: client.name,
          jobs: client.jobCount,
          jobType: client.jobTypes[0],
          due: client.latestDueDate,
          status:
            client.dominantStatus === "notStarted"
              ? "Not Started"
              : client.dominantStatus === "inProgress"
                ? "In Progress"
                : client.dominantStatus === "review"
                  ? "Review"
                  : client.dominantStatus === "completed"
                    ? "Completed"
                    : "On Hold",
        }))}
        pagination={{
          total: filteredClients.length,
          pageSize: 8,
          current: clientPage + 1,
          onChange: (page) => setClientPage(page - 1),
          showSizeChanger: false,
          showTotal: (total) => `Total ${total} clients`,
          position: ["bottomCenter"],
          size: "small",
        }}
        rowKey="client"
        size="small"
      />
    </div>
  )

  return (
    <div className="flex flex-col gap-2 bg-white">
      <div className="flex justify-between items-center">
        {/* <h1 style={{ fontSize: "1.875rem", fontWeight: 700, color: "#111827" }}>Jobs ({metrics.totalJobs})</h1> */}
        <Space className="w-full justify-end" size={16}>
          <Popover
            content={statusSummaryContent}
            trigger="click"
            open={statusPopoverOpen}
            onOpenChange={setStatusPopoverOpen}
            title={
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>Job Status Summary</span>
                <Button type="text" size="small" onClick={() => setStatusPopoverOpen(false)}>
                  <X size={16} />
                </Button>
              </div>
            }
            overlayStyle={{ width: 400 }}
            overlayClassName="centered-popover"
          >
            <Button type="text" icon={<BarChartOutlined style={{ fontSize: "20px", color: "#6B7280" }} />} />
          </Popover>

          <Popover
            content={clientSummaryContent}
            trigger="click"
            open={clientPopoverOpen}
            onOpenChange={setClientPopoverOpen}
            title={
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>Client Summary</span>
                <Button type="text" size="small" onClick={() => setClientPopoverOpen(false)}>
                  <X size={16} />
                </Button>
              </div>
            }
            overlayStyle={{ width: 650, height: "auto", maxHeight: "90vh" }}
            overlayClassName="centered-popover"
          >
            <Button type="text" icon={<BankOutlined style={{ fontSize: "20px", color: "#6B7280" }} />} />
          </Popover>

          <Popover
            content={jobTypeSummaryContent}
            trigger="click"
            open={jobTypePopoverOpen}
            onOpenChange={setJobTypePopoverOpen}
            title={
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>Job Type Summary</span>
                <Button type="text" size="small" onClick={() => setJobTypePopoverOpen(false)}>
                  <X size={16} />
                </Button>
              </div>
            }
            overlayStyle={{ width: 400 }}
            overlayClassName="centered-popover"
          >
            <Button type="text" icon={<FileTextOutlined style={{ fontSize: "20px", color: "#6B7280" }} />} />
          </Popover>

          <Divider type="vertical" style={{ height: "24px", margin: "0 8px" }} />

          <Dropdown menu={{ items: columnItems }} trigger={["click"]}>
            <Button icon={<Columns className="h-4 w-4" />} style={{ minWidth: "120px" }}>
              Columns
            </Button>
          </Dropdown>

          <Dropdown
            menu={{
              items: bulkActionItems,
              onClick: (e) => handleBulkAction(e.key),
            }}
            trigger={["click"]}
            disabled={selectedJobs.length === 0}
          >
            <Button icon={<Check className="h-4 w-4" />} style={{ minWidth: "140px" }}>
              Bulk Actions {selectedJobs.length > 0 && `(${selectedJobs.length})`}
            </Button>
          </Dropdown>

          <Button icon={<Download className="h-4 w-4" />} onClick={exportToCSV} style={{ minWidth: "120px" }}>
            Export
          </Button>
        </Space>
      </div>
      <Card bordered={false} bodyStyle={{ padding: 0 }}>
        <div className="p-2">
          <Row gutter={[16, 16]} className="mb-1">
            <Col span={6}>
              <Input placeholder="Search jobs..." prefix={<Search className="h-4 w-4 text-gray-500" />} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </Col>
            <Col span={4}>
              <Select placeholder="Client" value={selectedClient || undefined} onChange={(value) => setSelectedClient(value)} allowClear style={{ width: "100%" }}>
                {clients.map((client) => (
                  <Select.Option key={client} value={client}>
                    {client}
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col span={4}>
              <Select placeholder="Job Type" value={selectedName || undefined} onChange={(value) => setSelectedName(value)} allowClear style={{ width: "100%" }}>
                {names.map((name) => (
                  <Select.Option key={name} value={name}>
                    {name}
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col span={4}>
              <Select placeholder="State" value={selectedState || undefined} onChange={(value) => setSelectedState(value)} allowClear style={{ width: "100%" }}>
                {states.map((state) => (
                  <Select.Option key={state} value={state}>
                    {state}
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col span={4}>
              <Select placeholder="Staff" value={selectedStaff || undefined} onChange={(value) => setSelectedStaff(value)} allowClear style={{ width: "100%" }}>
                {staffMembers.map((staff) => (
                  <Select.Option key={staff} value={staff}>
                    {staff}
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col span={2}>
              <Button onClick={clearFilters} icon={<X className="h-4 w-4" />} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "2px" }}>
                Clear
              </Button>
            </Col>
          </Row>

          <div className="rounded-md border overflow-hidden">
            <Table columns={columns} dataSource={paginatedJobs} pagination={false} rowKey="id" key={JSON.stringify(jobsData)} scroll={{ x: "max-content", y: 430 }} locale={{ emptyText: "No results found." }} size="small"/>
          </div>

          <div className="flex justify-end mt-4">
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "end", gap: "16px", height: "48px" }}>
              <div className="stats-label" style={{ marginRight: "16px" }}>
                Showing {paginatedJobs.length > 0 ? jobsPage * jobsPerPage + 1 : 0} to{" "}
                {Math.min((jobsPage + 1) * jobsPerPage, filteredAndSortedData.length)} of {filteredAndSortedData.length}{" "}
                jobs
              </div>
              <Space>
                <Button onClick={prevJobsPage} disabled={jobsPage === 0} icon={<ChevronLeft className="h-4 w-4" />}>
                  Previous
                </Button>
                <Button onClick={nextJobsPage} disabled={(jobsPage + 1) * jobsPerPage >= filteredAndSortedData.length} icon={<ChevronRight className="h-4 w-4" />}>
                  Next
                </Button>
              </Space>
            </div>
          </div>
        </div>
      </Card>

      <Modal
        title={`Bulk Action: ${
          bulkActionType === "startDate"
            ? "Start date"
            : bulkActionType === "dueDate"
              ? "Due date"
              : bulkActionType === "staff"
                ? "Assign Staff"
                : bulkActionType === "state"
                  ? "Change State"
                  : ""
        }`}
        open={showBulkActionDialog}
        onCancel={() => setShowBulkActionDialog(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowBulkActionDialog(false)}>
            Cancel
          </Button>,
          <Button key="apply" type="primary" onClick={applyBulkAction} loading={isApplyingBulkAction}>
            Apply
          </Button>,
        ]}
      >
        <p className="stats-label mb-4">
          Apply changes to {selectedJobs.length} selected {selectedJobs.length === 1 ? "job" : "jobs"}
        </p>

        {bulkActionType === "startDate" || bulkActionType === "dueDate" ? (
          <div className="flex flex-col gap-4">
            <label className="stats-label">Select a date</label>
            <DatePicker value={bulkActionDate} onChange={(date) => setBulkActionDate(date)} style={{ width: "100%" }} />
          </div>
        ) : bulkActionType === "state" ? (
          <div className="flex flex-col gap-4">
            <label className="stats-label">Select State</label>
            <Select
              value={bulkActionValue}
              onChange={setBulkActionValue}
              placeholder="Select state..."
              style={{ width: "100%" }}
              dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
            >
              {stateOptions.map((state) => (
                <Select.Option key={state} value={state}>
                  <StateBadge state={state} />
                </Select.Option>
              ))}
            </Select>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <label className="stats-label">Select Staff</label>
            <Select
              value={bulkActionValue}
              onChange={setBulkActionValue}
              placeholder="Select..."
              style={{ width: "100%" }}
              dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
            >
              {staffMembers.map((staff) => (
                <Select.Option key={staff} value={staff}>
                  {staff}
                </Select.Option>
              ))}
            </Select>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default JobsNewScreen
