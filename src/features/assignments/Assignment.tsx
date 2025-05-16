"use client"

import type React from "react"
import { useState, useRef } from "react"
import {
  SearchOutlined,
  FilterOutlined,
  UploadOutlined,
  DownloadOutlined,
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
} from "@ant-design/icons";
import './assignment.scss';
import {
  Button,
  Input,
  Dropdown,
  Menu,
  Modal,
  Tabs,
  Tooltip,
  Progress,
  Checkbox,
  Table,
  Tag,
  Card,
  Space,
  message,
} from "antd"
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

// Types
type Role = "Director" | "Manager" | "Accountant" | "Special Role" | "Admin" | "Super Admin"
type JobStatus = "Unassigned" | "Assigned" | "Pending"
type FilterState = "all" | "unmapped" | "mapped" // For staff
type JobFilterState = "all" | "unassigned" | "assigned" // For jobs
type ActiveTab = "mapping" | "analytics" | "bulk-operations" | "role-management"

type ProxyStatus = "None" | "Active" | "Pending"
type AccessLevel = "Read Only" | "Full Access" | "None"
type PermissionLevel = "Normal" | "Elevated" | "Restricted"

interface ProxyAssignment {
  proxyStaffId: string
  originalStaffId: string
  startDate: string
  endDate: string
  status: ProxyStatus
  accessLevel: AccessLevel
}

interface StaffPermission {
  staffId: string
  jobId: string
  permissionLevel: PermissionLevel
}

interface Staff {
  id: string
  name: string
  email: string
  role: Role
  assignedJobsCount: number
  assignedJobs: string[]
  selected?: boolean
}

interface Job {
  id: string
  name: string
  clientName: string
  assignedStaffCount: number
  assignedStaff: string[]
  status: JobStatus
  selected?: boolean
}

interface CSVRow {
  staffId: string
  jobId: string
}

// Define item types outside of the component
const ItemTypes = {
  STAFF: "staff",
  JOB: "job",
}

// Mock data
const initialStaff: Staff[] = [
  {
    id: "s1",
    name: "Alex Johnson",
    email: "alex@example.com",
    role: "Director",
    assignedJobsCount: 3,
    assignedJobs: ["j1", "j3"],
  },
  {
    id: "s2",
    name: "Maria Garcia",
    email: "maria@example.com",
    role: "Manager",
    assignedJobsCount: 2,
    assignedJobs: ["j2"],
  },
  {
    id: "s3",
    name: "David Lee",
    email: "david@example.com",
    role: "Accountant",
    assignedJobsCount: 1,
    assignedJobs: [],
  },
  {
    id: "s4",
    name: "Terry Farmer",
    email: "terry@example.com",
    role: "Director",
    assignedJobsCount: 0,
    assignedJobs: [],
  },
  {
    id: "s5",
    name: "Mark Smith",
    email: "mark@example.com",
    role: "Manager",
    assignedJobsCount: 2,
    assignedJobs: ["j4"],
  },
  {
    id: "s6",
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    assignedJobsCount: 1,
    assignedJobs: ["j5"],
  },
  { id: "s7", name: "Amy Davis", email: "amy@example.com", role: "Accountant", assignedJobsCount: 0, assignedJobs: [] },
  {
    id: "s8",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "Special Role",
    assignedJobsCount: 0,
    assignedJobs: [],
  },
  {
    id: "s9",
    name: "Michael Chen",
    email: "michael@example.com",
    role: "Super Admin",
    assignedJobsCount: 0,
    assignedJobs: [],
  },
]

const initialJobs: Job[] = [
  {
    id: "j1",
    name: "Annual Audit",
    clientName: "Smith Enterprises",
    assignedStaffCount: 1,
    assignedStaff: ["s1"],
    status: "Assigned",
  },
  {
    id: "j2",
    name: "Tax Filing",
    clientName: "Johnson Consulting",
    assignedStaffCount: 1,
    assignedStaff: ["s2"],
    status: "Assigned",
  },
  {
    id: "j3",
    name: "Financial Review",
    clientName: "Williams Manufacturing",
    assignedStaffCount: 1,
    assignedStaff: ["s1"],
    status: "Assigned",
  },
  {
    id: "j4",
    name: "Bookkeeping",
    clientName: "Brown Retail Group",
    assignedStaffCount: 1,
    assignedStaff: ["s5"],
    status: "Assigned",
  },
  {
    id: "j5",
    name: "Payroll Services",
    clientName: "Davis Healthcare",
    assignedStaffCount: 1,
    assignedStaff: ["s6"],
    status: "Assigned",
  },
  {
    id: "j6",
    name: "Advisory Services",
    clientName: "Wilson Legal Services",
    assignedStaffCount: 0,
    assignedStaff: [],
    status: "Unassigned",
  },
  {
    id: "j7",
    name: "Compliance Check",
    clientName: "Taylor Industries",
    assignedStaffCount: 0,
    assignedStaff: [],
    status: "Unassigned",
  },
]

export default function Assignments() {
  const [staff, setStaff] = useState<Staff[]>(initialStaff)
  const [jobs, setJobs] = useState<Job[]>(initialJobs)
  const [staffSearch, setStaffSearch] = useState("")
  const [jobSearch, setJobSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<Role[]>([])
  // const [statusFilter, setStatusFilter] = useState<JobStatus[]>([])
  const [confirmDialog, setConfirmDialog] = useState(false)
  const [currentAssignment, setCurrentAssignment] = useState<{ staffId: string; jobId: string } | null>(null)
  const [lastAssignment, setLastAssignment] = useState<{ staffId: string; jobId: string } | null>(null)
  const [staffFilterState, setStaffFilterState] = useState<FilterState>("all")
  const [jobFilterState, setJobFilterState] = useState<JobFilterState>("all")
  const [activeTab, setActiveTab] = useState<ActiveTab>("mapping")
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [csvPreview, setCsvPreview] = useState<CSVRow[]>([])
  const [csvUploadStatus, setCsvUploadStatus] = useState<"idle" | "preview" | "uploading" | "success" | "error">("idle")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [bulkAssignmentDialog, setBulkAssignmentDialog] = useState(false)
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([])
  const [selectedJobIds, setSelectedJobIds] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  // const [proxyAssignments, setProxyAssignments] = useState<ProxyAssignment[]>([
  //   {
  //     proxyStaffId: "s6", // Admin
  //     originalStaffId: "s1", // Director
  //     startDate: "2023-06-01",
  //     endDate: "2023-06-15",
  //     status: "Active",
  //     accessLevel: "Full Access",
  //   },
  //   {
  //     proxyStaffId: "s6", // Admin
  //     originalStaffId: "s2", // Manager
  //     startDate: "2023-07-01",
  //     endDate: "2023-07-15",
  //     status: "Pending",
  //     accessLevel: "Read Only",
  //   },
  // ])

  const staffPermissions: StaffPermission[] = [
    {
      staffId: "s8", // Special Role
      jobId: "j1",
      permissionLevel: "Elevated",
    },
    {
      staffId: "s8", // Special Role
      jobId: "j2",
      permissionLevel: "Elevated",
    },
    {
      staffId: "s3", // Accountant
      jobId: "j3",
      permissionLevel: "Restricted",
    },
  ]
  const statusFilter: JobStatus[] = []
  const proxyAssignments: ProxyAssignment[] = [
    {
      proxyStaffId: "s6", // Admin
      originalStaffId: "s1", // Director
      startDate: "2023-06-01",
      endDate: "2023-06-15",
      status: "Active",
      accessLevel: "Full Access",
    },
    {
      proxyStaffId: "s6", // Admin
      originalStaffId: "s2", // Manager
      startDate: "2023-07-01",
      endDate: "2023-07-15",
      status: "Pending",
      accessLevel: "Read Only",
    },
  ]
   // Toggle select all jobs
   const toggleSelectAllJobs = () => {
    const allSelected = filteredJobs.length > 0 && filteredJobs.every((j) => j.selected)

    // Update jobs selection state
    setJobs((currentJobs) =>
      currentJobs.map((j) => {
        // Only toggle jobs that are currently filtered/visible
        if (filteredJobs.some((fj) => fj.id === j.id)) {
          return { ...j, selected: !allSelected }
        }
        return j
      }),
    )
       // Update selected job IDs
       if (allSelected) {
        // Deselect all filtered jobs
        setSelectedJobIds((current) => current.filter((id) => !filteredJobs.some((j) => j.id === id)))
      } else {
        // Select all filtered jobs
        const newSelectedIds = filteredJobs.map((j) => j.id)
        setSelectedJobIds((current) => {
          // Combine current selections with new ones, avoiding duplicates
          const combined = [...current]
          newSelectedIds.forEach((id) => {
            if (!combined.includes(id)) {
              combined.push(id)
            }
          })
          return combined
        })
      }
    }

      // Toggle select all staff
  const toggleSelectAllStaff = () => {
    const allSelected = filteredStaff.length > 0 && filteredStaff.every((s) => s.selected)

    // Update staff selection state
    setStaff((currentStaff) =>
      currentStaff.map((s) => {
        // Only toggle staff that are currently filtered/visible
        if (filteredStaff.some((fs) => fs.id === s.id)) {
          return { ...s, selected: !allSelected }
        }
        return s
      }),
    )

    if (allSelected) {
      setSelectedStaffIds((current) => current.filter((id) => !filteredStaff.some((s) => s.id === id)))
    } else {
      const newSelectedIds = filteredStaff.map((s) => s.id)
      setSelectedStaffIds((current) => {
        const combined = [...current]
        newSelectedIds.forEach((id) => {
          if (!combined.includes(id)) {
            combined.push(id)
          }
        })
        return combined
      })
    }
  }

  // Filter staff
  const filteredStaff = staff.filter((staffMember) => {
    const matchesSearch =
      staffMember.name.toLowerCase().includes(staffSearch.toLowerCase()) ||
      staffMember.email.toLowerCase().includes(staffSearch.toLowerCase())
    const matchesRoleFilter = roleFilter.length === 0 || roleFilter.includes(staffMember.role)

    // Apply mapping filter
    const matchesMappingFilter =
      staffFilterState === "all" ||
      (staffFilterState === "unmapped" && staffMember.assignedJobsCount === 0) ||
      (staffFilterState === "mapped" && staffMember.assignedJobsCount > 0)

    return matchesSearch && matchesRoleFilter && matchesMappingFilter
  })

  // Filter jobs
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.name.toLowerCase().includes(jobSearch.toLowerCase()) ||
      job.clientName.toLowerCase().includes(jobSearch.toLowerCase())
    const matchesStatusFilter = statusFilter.length === 0 || statusFilter.includes(job.status)

    // Apply assignment filter
    const matchesAssignmentFilter =
      jobFilterState === "all" ||
      (jobFilterState === "unassigned" && job.status === "Unassigned") ||
      (jobFilterState === "assigned" && job.status === "Assigned")

    return matchesSearch && matchesStatusFilter && matchesAssignmentFilter
  })

  // Get staff or job details by ID
  const getStaffById = (id: string) => staff.find((s) => s.id === id)
  const getJobById = (id: string) => jobs.find((j) => j.id === id)

  // Handle assignment
  const handleAssignment = (staffId: string, jobId: string) => {
    setCurrentAssignment({ staffId, jobId })
    setConfirmDialog(true)
  }

  // Confirm assignment
  const confirmAssignment = () => {
    if (!currentAssignment) return

    const { staffId, jobId } = currentAssignment

    // Update staff
    const updatedStaff = staff.map((s) => {
      if (s.id === staffId) {
        return {
          ...s,
          assignedJobsCount: s.assignedJobsCount + 1,
          assignedJobs: [...s.assignedJobs, jobId],
        }
      }
      return s
    })

    // Update job
    const updatedJobs = jobs.map((j) => {
      if (j.id === jobId) {
        return {
          ...j,
          assignedStaffCount: j.assignedStaffCount + 1,
          assignedStaff: [...j.assignedStaff, staffId],
          status: "Assigned" as JobStatus,
        }
      }
      return j
    })

    setStaff(updatedStaff)
    setJobs(updatedJobs)
    setLastAssignment(currentAssignment)
    setConfirmDialog(false)
    setCurrentAssignment(null)
  }

  // Undo last assignment
  const undoLastAssignment = () => {
    if (!lastAssignment) return

    const { staffId, jobId } = lastAssignment

    // Update staff
    const updatedStaff = staff.map((s) => {
      if (s.id === staffId) {
        return {
          ...s,
          assignedJobsCount: Math.max(0, s.assignedJobsCount - 1),
          assignedJobs: s.assignedJobs.filter((id) => id !== jobId),
        }
      }
      return s
    })

    // Update job
    const updatedJobs = jobs.map((j) => {
      if (j.id === jobId) {
        const newAssignedStaff = j.assignedStaff.filter((id) => id !== staffId)
        return {
          ...j,
          assignedStaffCount: Math.max(0, j.assignedStaffCount - 1),
          assignedStaff: newAssignedStaff,
          status: newAssignedStaff.length === 0 ? "Unassigned" : "Assigned",
        }
      }
      return j
    })

    setStaff(updatedStaff)
    setJobs(updatedJobs as Job[])
    setLastAssignment(null)
  }

  // Toggle staff filter state
  const toggleStaffFilter = () => {
    setStaffFilterState((current) => {
      if (current === "all") return "unmapped"
      if (current === "unmapped") return "mapped"
      return "all"
    })
  }

  // Toggle job filter state
  const toggleJobFilter = () => {
    setJobFilterState((current) => {
      if (current === "all") return "unassigned"
      if (current === "unassigned") return "assigned"
      return "all"
    })
  }

  // Get filter button text for staff
  const getStaffFilterText = () => {
    switch (staffFilterState) {
      case "unmapped":
        return "Show Unmapped"
      case "mapped":
        return "Show Mapped"
      default:
        return "Show All"
    }
  }

  // Get filter button text for jobs
  const getJobFilterText = () => {
    switch (jobFilterState) {
      case "unassigned":
        return "Show Unassigned"
      case "assigned":
        return "Show Assigned"
      default:
        return "Show All"
    }
  }

  // Handle CSV file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCsvFile(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        const text = event.target?.result as string
        const rows = text.split("\n")
        const headers = rows[0].split(",")
        const staffIdIndex = headers.findIndex((h) => h.trim().toLowerCase() === "staffid")
        const jobIdIndex = headers.findIndex((h) => h.trim().toLowerCase() === "jobid")

        if (staffIdIndex === -1 || jobIdIndex === -1) {
          message.error("CSV must contain staffId and jobId columns")
          setCsvFile(null)
          return
        }

        const parsedRows: CSVRow[] = []
        for (let i = 1; i < rows.length; i++) {
          if (!rows[i].trim()) continue
          const values = rows[i].split(",")
          parsedRows.push({
            staffId: values[staffIdIndex].trim(),
            jobId: values[jobIdIndex].trim(),
          })
        }
        setCsvPreview(parsedRows)
        setCsvUploadStatus("preview")
      }
      reader.readAsText(file)
    }
  }

  // Process CSV upload
  const processCSVUpload = () => {
    setCsvUploadStatus("uploading")

    // Simulate progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setUploadProgress(progress)
      if (progress >= 100) {
        clearInterval(interval)

        // Process assignments
        const updatedStaff = [...staff]
        const updatedJobs = [...jobs]

        csvPreview.forEach((row) => {
          const staffIndex = updatedStaff.findIndex((s) => s.id === row.staffId)
          const jobIndex = updatedJobs.findIndex((j) => j.id === row.jobId)

          if (staffIndex !== -1 && jobIndex !== -1) {
            // Update staff
            if (!updatedStaff[staffIndex].assignedJobs.includes(row.jobId)) {
              updatedStaff[staffIndex].assignedJobsCount += 1
              updatedStaff[staffIndex].assignedJobs.push(row.jobId)
            }

            // Update job
            if (!updatedJobs[jobIndex].assignedStaff.includes(row.staffId)) {
              updatedJobs[jobIndex].assignedStaffCount += 1
              updatedJobs[jobIndex].assignedStaff.push(row.staffId)
              updatedJobs[jobIndex].status = "Assigned"
            }
          }
        })

        setStaff(updatedStaff)
        setJobs(updatedJobs)
        setCsvUploadStatus("success")

        // Reset after 3 seconds
        setTimeout(() => {
          setCsvUploadStatus("idle")
          setCsvFile(null)
          setCsvPreview([])
          setUploadProgress(0)
          if (fileInputRef.current) {
            fileInputRef.current.value = ""
          }
        }, 3000)
      }
    }, 200)
  }

  // Cancel CSV upload
  const cancelCSVUpload = () => {
    setCsvUploadStatus("idle")
    setCsvFile(null)
    setCsvPreview([])
    setUploadProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Export assignments as CSV
  const exportCSV = () => {
    let csvContent = "staffId,staffName,staffRole,jobId,jobName,clientName\n"

    staff.forEach((s) => {
      s.assignedJobs.forEach((jobId) => {
        const job = jobs.find((j) => j.id === jobId)
        if (job) {
          csvContent += `${s.id},${s.name},${s.role},${job.id},${job.name},${job.clientName}\n`
        }
      })
    })

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "staff-job-assignments.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Toggle staff selection
  const toggleStaffSelection = (staffId: string) => {
    setStaff((currentStaff) =>
      currentStaff.map((s) => {
        if (s.id === staffId) {
          return { ...s, selected: !s.selected }
        }
        return s
      }),
    )

    setSelectedStaffIds((current) => {
      const staffMember = staff.find((s) => s.id === staffId)
      if (staffMember?.selected) {
        return current.filter((id) => id !== staffId)
      } else {
        return [...current, staffId]
      }
    })
  }

  // Toggle job selection
  const toggleJobSelection = (jobId: string) => {
    setJobs((currentJobs) =>
      currentJobs.map((j) => {
        if (j.id === jobId) {
          return { ...j, selected: !j.selected }
        }
        return j
      }),
    )

    setSelectedJobIds((current) => {
      const job = jobs.find((j) => j.id === jobId)
      if (job?.selected) {
        return current.filter((id) => id !== jobId)
      } else {
        return [...current, jobId]
      }
    })
  }

  // Open bulk assignment dialog
  const openBulkAssignmentDialog = () => {
    if (selectedStaffIds.length > 0 && selectedJobIds.length > 0) {
      setBulkAssignmentDialog(true)
    } else {
      message.warning("Please select at least one staff member and one job")
    }
  }

  // Confirm bulk assignment
  const confirmBulkAssignment = () => {
    const updatedStaff = [...staff]
    const updatedJobs = [...jobs]

    selectedStaffIds.forEach((staffId) => {
      const staffIndex = updatedStaff.findIndex((s) => s.id === staffId)
      if (staffIndex !== -1) {
        selectedJobIds.forEach((jobId) => {
          if (!updatedStaff[staffIndex].assignedJobs.includes(jobId)) {
            updatedStaff[staffIndex].assignedJobsCount += 1
            updatedStaff[staffIndex].assignedJobs.push(jobId)
          }
        })
      }
    })

    selectedJobIds.forEach((jobId) => {
      const jobIndex = updatedJobs.findIndex((j) => j.id === jobId)
      if (jobIndex !== -1) {
        selectedStaffIds.forEach((staffId) => {
          if (!updatedJobs[jobIndex].assignedStaff.includes(staffId)) {
            updatedJobs[jobIndex].assignedStaffCount += 1
            updatedJobs[jobIndex].assignedStaff.push(staffId)
            updatedJobs[jobIndex].status = "Assigned"
          }
        })
      }
    })

    setStaff(updatedStaff.map((s) => ({ ...s, selected: false })))
    setJobs(updatedJobs.map((j) => ({ ...j, selected: false })))
    setSelectedStaffIds([])
    setSelectedJobIds([])
    setBulkAssignmentDialog(false)
  }

  // Clear all selections
  const clearSelections = () => {
    setStaff((currentStaff) => currentStaff.map((s) => ({ ...s, selected: false })))
    setJobs((currentJobs) => currentJobs.map((j) => ({ ...j, selected: false })))
    setSelectedStaffIds([])
    setSelectedJobIds([])
  }

  // Staff Row Component with Drag and Drop
  const StaffRow = ({ staffMember }: { staffMember: Staff }) => {
    const [{ isDragging }, drag] = useDrag({
      type: ItemTypes.STAFF,
      item: () => ({ id: staffMember.id, type: ItemTypes.STAFF }),
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    })

    const [{ isOver }, drop] = useDrop({
      accept: ItemTypes.JOB,
      drop: (item: { id: string; type: string }) => {
        if (item.type === ItemTypes.JOB) {
          handleAssignment(staffMember.id, item.id)
        }
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    })

    // Get job names for the tooltip
    const assignedJobNames = staffMember.assignedJobs
      .map((jobId) => {
        const job = jobs.find((j) => j.id === jobId)
        return job ? `${job.name} (${job.clientName})` : ""
      })
      .filter(Boolean)

    return (
      <tr
        ref={(node) => {
          drag(drop(node))
        }}
        className={isDragging ? "dragging" : isOver ? "can-drop" : ""}
        style={{
          cursor: "grab",
          opacity: isDragging ? 0.5 : 1,
          backgroundColor: isOver ? "#f0f9eb" : staffMember.selected ? "#f0f9eb" : undefined,
        }}
      >
        {activeTab === "bulk-operations" && (
          <td style={{ padding: "8px", textAlign: "center" }}>
            <Checkbox
              checked={staffMember.selected}
              onChange={() => toggleStaffSelection(staffMember.id)}
              aria-label={`Select ${staffMember.name}`}
            />
          </td>
        )}
        <td style={{ padding: "12px" }}>{staffMember.name}</td>
        <td style={{ padding: "12px" }}>{staffMember.email}</td>
        <td style={{ padding: "12px" }}>{staffMember.role}</td>
        <td style={{ padding: "12px", textAlign: "center" }}>
          <Tooltip
            title={
              assignedJobNames.length > 0 ? (
                <ul style={{ listStyleType: "disc", paddingLeft: "16px" }}>
                  {assignedJobNames.map((name, index) => (
                    <li key={index}>{name}</li>
                  ))}
                </ul>
              ) : (
                <p>No jobs assigned</p>
              )
            }
          >
            <Tag color={staffMember.assignedJobsCount > 0 ? "success" : "default"}>{staffMember.assignedJobsCount}</Tag>
          </Tooltip>
        </td>
      </tr>
    )
  }

  // Job Row Component with Drag and Drop
  const JobRow = ({ job }: { job: Job }) => {
    const [{ isDragging }, drag] = useDrag({
      type: ItemTypes.JOB,
      item: () => ({ id: job.id, type: ItemTypes.JOB }),
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    })

    const [{ isOver }, drop] = useDrop({
      accept: ItemTypes.STAFF,
      drop: (item: { id: string; type: string }) => {
        if (item.type === ItemTypes.STAFF) {
          handleAssignment(item.id, job.id)
        }
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    })

    // Get staff names and roles for the tooltip
    const assignedStaffDetails = job.assignedStaff
      .map((staffId) => {
        const staffMember = staff.find((s) => s.id === staffId)
        return staffMember ? `${staffMember.name} (${staffMember.role})` : ""
      })
      .filter(Boolean)

    return (
      <tr
        ref={(node) => {
          drag(drop(node))
        }}
        className={isDragging ? "dragging" : isOver ? "can-drop" : ""}
        style={{
          cursor: "grab",
          opacity: isDragging ? 0.5 : 1,
          backgroundColor: isOver
            ? "#f0f9eb"
            : job.selected
              ? "#f0f9eb"
              : job.status === "Unassigned"
                ? "#fffbe6"
                : undefined,
        }}
      >
        {activeTab === "bulk-operations" && (
          <td style={{ padding: "8px", textAlign: "center" }}>
            <Checkbox
              checked={job.selected}
              onChange={() => toggleJobSelection(job.id)}
              aria-label={`Select ${job.name}`}
            />
          </td>
        )}
        <td style={{ padding: "12px" }}>
          {/* <Tooltip
            title={
              <>
                <p>
                  <strong>Job:</strong> {job.name}
                </p>
                <p>
                  <strong>Client:</strong> {job.clientName}
                </p>
              </>
            }
          > */}
            <span style={{ cursor: "help" }}>{job.name}</span>
          {/* </Tooltip> */}
        </td>
        <td style={{ padding: "12px" }}>{job.clientName}</td>
        <td style={{ padding: "12px", textAlign: "center" }}>
          <Tooltip
            title={
              assignedStaffDetails.length > 0 ? (
                <ul style={{ listStyleType: "disc", paddingLeft: "16px" }}>
                  {assignedStaffDetails.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              ) : (
                <p>No staff assigned</p>
              )
            }
          >
            <Tag color={job.assignedStaffCount > 0 ? "success" : "default"}>{job.assignedStaffCount}</Tag>
          </Tooltip>
        </td>
        <td style={{ padding: "12px", textAlign: "center" }}>
          <Tag color={job.status === "Assigned" ? "success" : "warning"}>{job.status}</Tag>
        </td>
      </tr>
    )
  }

  // Get assignment details for confirmation dialog
  const getAssignmentDetails = () => {
    if (!currentAssignment) return null

    const { staffId, jobId } = currentAssignment
    const staffMember = getStaffById(staffId)
    const job = getJobById(jobId)

    if (!staffMember || !job) return null

    return {
      staffName: staffMember.name,
      staffRole: staffMember.role,
      jobName: job.name,
      clientName: job.clientName,
    }
  }

  // Get bulk assignment details
  const getBulkAssignmentDetails = () => {
    const selectedStaff = staff.filter((s) => selectedStaffIds.includes(s.id))
    const selectedJobs = jobs.filter((j) => selectedJobIds.includes(j.id))

    return {
      staffCount: selectedStaff.length,
      jobCount: selectedJobs.length,
      staffNames: selectedStaff.map((s) => s.name).join(", "),
      jobNames: selectedJobs.map((j) => j.name).join(", "),
    }
  }

  const assignmentDetails = getAssignmentDetails()
  const bulkAssignmentDetails = getBulkAssignmentDetails()

  // Calculate workload metrics for analytics
  const calculateWorkloadMetrics = () => {
    const roleWorkload: Record<Role, number> = {
      Director: 0,
      Manager: 0,
      Accountant: 0,
      "Special Role": 0,
      Admin: 0,
      "Super Admin": 0,
    }

    const staffWorkload = staff.map((s) => ({
      id: s.id,
      name: s.name,
      role: s.role,
      jobCount: s.assignedJobsCount,
      workloadPercentage: (s.assignedJobsCount / Math.max(1, jobs.length)) * 100,
    }))

    staff.forEach((s) => {
      roleWorkload[s.role] += s.assignedJobsCount
    })

    // Calculate client team composition
    const clientTeamComposition = jobs.map((job) => {
      const assignedStaff = staff.filter((s) => s.assignedJobs.includes(job.id))

      return {
        jobId: job.id,
        jobName: job.name,
        clientName: job.clientName,
        totalStaff: assignedStaff.length,
        directors: assignedStaff.filter((s) => s.role === "Director").length,
        managers: assignedStaff.filter((s) => s.role === "Manager").length,
        accountants: assignedStaff.filter((s) => s.role === "Accountant").length,
        admins: assignedStaff.filter((s) => s.role === "Admin").length,
        superAdmins: assignedStaff.filter((s) => s.role === "Super Admin").length,
        specialRoles: assignedStaff.filter((s) => s.role === "Special Role").length,
      }
    })

    // Calculate role-based workload averages
    const roleAverages = {
      Director: calculateRoleAverage("Director"),
      Manager: calculateRoleAverage("Manager"),
      Accountant: calculateRoleAverage("Accountant"),
      Admin: calculateRoleAverage("Admin"),
      "Super Admin": calculateRoleAverage("Super Admin"),
      "Special Role": calculateRoleAverage("Special Role"),
    }

    function calculateRoleAverage(role: Role): number {
      const roleStaff = staff.filter((s) => s.role === role)
      if (roleStaff.length === 0) return 0
      const totalJobs = roleStaff.reduce((sum, s) => sum + s.assignedJobsCount, 0)
      return totalJobs / roleStaff.length
    }

    const totalAssignments = staff.reduce((total, s) => total + s.assignedJobsCount, 0)
    const averageAssignmentsPerStaff = totalAssignments / Math.max(1, staff.length)

    return {
      roleWorkload,
      staffWorkload,
      totalAssignments,
      averageAssignmentsPerStaff,
      unassignedJobs: jobs.filter((j) => j.status === "Unassigned").length,
      assignedJobs: jobs.filter((j) => j.status === "Assigned").length,
      clientTeamComposition,
      roleAverages,
    }
  }

  const workloadMetrics = calculateWorkloadMetrics()

  // Role filter menu
  const roleFilterMenu = (
    <Menu>
      <Menu.ItemGroup title="Filter by Role">
        <Menu.Item key="director">
          <Checkbox
            checked={roleFilter.includes("Director")}
            onChange={(e) => {
              if (e.target.checked) {
                setRoleFilter([...roleFilter, "Director"])
              } else {
                setRoleFilter(roleFilter.filter((r) => r !== "Director"))
              }
            }}
          >
            Director
          </Checkbox>
        </Menu.Item>
        <Menu.Item key="manager">
          <Checkbox
            checked={roleFilter.includes("Manager")}
            onChange={(e) => {
              if (e.target.checked) {
                setRoleFilter([...roleFilter, "Manager"])
              } else {
                setRoleFilter(roleFilter.filter((r) => r !== "Manager"))
              }
            }}
          >
            Manager
          </Checkbox>
        </Menu.Item>
        <Menu.Item key="accountant">
          <Checkbox
            checked={roleFilter.includes("Accountant")}
            onChange={(e) => {
              if (e.target.checked) {
                setRoleFilter([...roleFilter, "Accountant"])
              } else {
                setRoleFilter(roleFilter.filter((r) => r !== "Accountant"))
              }
            }}
          >
            Accountant
          </Checkbox>
        </Menu.Item>
        <Menu.Item key="specialRole">
          <Checkbox
            checked={roleFilter.includes("Special Role")}
            onChange={(e) => {
              if (e.target.checked) {
                setRoleFilter([...roleFilter, "Special Role"])
              } else {
                setRoleFilter(roleFilter.filter((r) => r !== "Special Role"))
              }
            }}
          >
            Special Role
          </Checkbox>
        </Menu.Item>
        <Menu.Item key="admin">
          <Checkbox
            checked={roleFilter.includes("Admin")}
            onChange={(e) => {
              if (e.target.checked) {
                setRoleFilter([...roleFilter, "Admin"])
              } else {
                setRoleFilter(roleFilter.filter((r) => r !== "Admin"))
              }
            }}
          >
            Admin
          </Checkbox>
        </Menu.Item>
        <Menu.Item key="superAdmin">
          <Checkbox
            checked={roleFilter.includes("Super Admin")}
            onChange={(e) => {
              if (e.target.checked) {
                setRoleFilter([...roleFilter, "Super Admin"])
              } else {
                setRoleFilter(roleFilter.filter((r) => r !== "Super Admin"))
              }
            }}
          >
            Super Admin
          </Checkbox>
        </Menu.Item>
      </Menu.ItemGroup>
    </Menu>
  )

  // Job filter menu
  const jobFilterMenu = (
    <Menu>
      <Menu.ItemGroup title="Filter by Job">
        <Menu.Item key="annual">
          <Checkbox
            checked={jobSearch.includes("Annual")}
            onChange={(e) => {
              if (e.target.checked) {
                setJobSearch((prev) => (prev ? `${prev} Annual` : "Annual"))
              } else {
                setJobSearch((prev) => prev.replace("Annual", "").trim())
              }
            }}
          >
            Job: Annual
          </Checkbox>
        </Menu.Item>
        <Menu.Item key="tax">
          <Checkbox
            checked={jobSearch.includes("Tax")}
            onChange={(e) => {
              if (e.target.checked) {
                setJobSearch((prev) => (prev ? `${prev} Tax` : "Tax"))
              } else {
                setJobSearch((prev) => prev.replace("Tax", "").trim())
              }
            }}
          >
            Job: Tax
          </Checkbox>
        </Menu.Item>
        <Menu.Item key="smith">
          <Checkbox
            checked={jobSearch.includes("Smith")}
            onChange={(e) => {
              if (e.target.checked) {
                setJobSearch((prev) => (prev ? `${prev} Smith` : "Smith"))
              } else {
                setJobSearch((prev) => prev.replace("Smith", "").trim())
              }
            }}
          >
            Client: Smith
          </Checkbox>
        </Menu.Item>
        <Menu.Item key="johnson">
          <Checkbox
            checked={jobSearch.includes("Johnson")}
            onChange={(e) => {
              if (e.target.checked) {
                setJobSearch((prev) => (prev ? `${prev} Johnson` : "Johnson"))
              } else {
                setJobSearch((prev) => prev.replace("Johnson", "").trim())
              }
            }}
          >
            Client: Johnson
          </Checkbox>
        </Menu.Item>
      </Menu.ItemGroup>
    </Menu>
  )

  // Staff columns for tables
  // const staffColumns = [
  //   ...(activeTab === "bulk-operations"
  //     ? [
  //         {
  //           title: "",
  //           key: "selection",
  //           render: (_: any, record: Staff) => (
  //             <Checkbox checked={record.selected} onChange={() => toggleStaffSelection(record.id)} />
  //           ),
  //           width: 50,
  //         },
  //       ]
  //     : []),
  //   {
  //     title: "Name",
  //     dataIndex: "name",
  //     key: "name",
  //   },
  //   {
  //     title: "Email",
  //     dataIndex: "email",
  //     key: "email",
  //   },
  //   {
  //     title: "Role",
  //     dataIndex: "role",
  //     key: "role",
  //   },
  //   {
  //     title: "Jobs",
  //     key: "jobs",
  //     align: "center" as const,
  //     render: (_: any, record: Staff) => {
  //       const assignedJobNames = record.assignedJobs
  //         .map((jobId) => {
  //           const job = jobs.find((j) => j.id === jobId)
  //           return job ? `${job.name} (${job.clientName})` : ""
  //         })
  //         .filter(Boolean)

  //       return (
  //         <Tooltip
  //           title={
  //             assignedJobNames.length > 0 ? (
  //               <ul style={{ listStyleType: "disc", paddingLeft: "16px" }}>
  //                 {assignedJobNames.map((name, index) => (
  //                   <li key={index}>{name}</li>
  //                 ))}
  //               </ul>
  //             ) : (
  //               <p>No jobs assigned</p>
  //             )
  //           }
  //         >
  //           <Tag color={record.assignedJobsCount > 0 ? "success" : "default"}>{record.assignedJobsCount}</Tag>
  //         </Tooltip>
  //       )
  //     },
  //   },
  // ]

  // Job columns for tables
  // const jobColumns = [
  //   ...(activeTab === "bulk-operations"
  //     ? [
  //         {
  //           title: "",
  //           key: "selection",
  //           render: (_: any, record: Job) => (
  //             <Checkbox checked={record.selected} onChange={() => toggleJobSelection(record.id)} />
  //           ),
  //           width: 50,
  //         },
  //       ]
  //     : []),
  //   {
  //     title: "Job Name",
  //     dataIndex: "name",
  //     key: "name",
  //     render: (text: string, record: Job) => (
  //       <Tooltip
  //         title={
  //           <>
  //             <p>
  //               <strong>Job:</strong> {record.name}
  //             </p>
  //             <p>
  //               <strong>Client:</strong> {record.clientName}
  //             </p>
  //           </>
  //         }
  //       >
  //         <span style={{ cursor: "help" }}>{text}</span>
  //       </Tooltip>
  //     ),
  //   },
  //   {
  //     title: "Client",
  //     dataIndex: "clientName",
  //     key: "clientName",
  //   },
  //   {
  //     title: "Staff",
  //     key: "staff",
  //     align: "center" as const,
  //     render: (_: any, record: Job) => {
  //       const assignedStaffDetails = record.assignedStaff
  //         .map((staffId) => {
  //           const staffMember = staff.find((s) => s.id === staffId)
  //           return staffMember ? `${staffMember.name} (${staffMember.role})` : ""
  //         })
  //         .filter(Boolean)

  //       return (
  //         <Tooltip
  //           title={
  //             assignedStaffDetails.length > 0 ? (
  //               <ul style={{ listStyleType: "disc", paddingLeft: "16px" }}>
  //                 {assignedStaffDetails.map((detail, index) => (
  //                   <li key={index}>{detail}</li>
  //                 ))}
  //               </ul>
  //             ) : (
  //               <p>No staff assigned</p>
  //             )
  //           }
  //         >
  //           <Tag color={record.assignedStaffCount > 0 ? "success" : "default"}>{record.assignedStaffCount}</Tag>
  //         </Tooltip>
  //       )
  //     },
  //   },
  //   {
  //     title: "Status",
  //     key: "status",
  //     align: "center" as const,
  //     render: (_: any, record: Job) => (
  //       <Tag color={record.status === "Assigned" ? "success" : "warning"}>{record.status}</Tag>
  //     ),
  //   },
  // ]

  // Render the component
  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: "bold", color: "#1a4e5f"}}>Staff to Job Mapping</h1>
          <p style={{ color: "#666" }}>Drag staff members and drop them onto jobs (or vice versa) to create assignments</p>
        </div>

        {lastAssignment && (
          <div
            style={{
              backgroundColor: "#e6f7ff",
              padding: 12,
              borderRadius: 8,
              marginBottom: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>Last assignment completed successfully</span>
            <Button type="default" size="small" onClick={undoLastAssignment}>
              Undo
            </Button>
          </div>
        )}

        <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key as ActiveTab)}>
          <Tabs.TabPane tab="Mapping" key="mapping">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <Card
                title={<span style={{ color: "#FFFF", fontWeight: "500" }}>Staff</span>}
                headStyle={{ backgroundColor: "#1a4e5f", color: "white" }}
                bodyStyle={{ padding: 16 }}
              >
                <Space style={{ marginBottom: 16 }}>
                  <Input
                    placeholder="Search staff..."
                    prefix={<SearchOutlined />}
                    value={staffSearch}
                    onChange={(e) => setStaffSearch(e.target.value)}
                    style={{ width: 200 }}
                  />
                  <Dropdown overlay={roleFilterMenu} trigger={["click"]}>
                    <Button>
                      <FilterOutlined /> Role
                    </Button>
                  </Dropdown>
                  <Button onClick={toggleStaffFilter}>{getStaffFilterText()}</Button>
                </Space>

                <div className="staff-table-container">
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th style={{ padding: "12px", textAlign: "left" }}>Name</th>
                        <th style={{ padding: "12px", textAlign: "left" }}>Email</th>
                        <th style={{ padding: "12px", textAlign: "left" }}>Role</th>
                        <th style={{ padding: "12px", textAlign: "center" }}>Jobs</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStaff.map((staffMember) => (
                        <StaffRow key={staffMember.id} staffMember={staffMember} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              <Card
                title={<span style={{ color: "#FFFF", fontWeight: "500" }}>Jobs</span>}
                headStyle={{ backgroundColor: "#1a4e5f", color: "white" }}
                bodyStyle={{ padding: 16 }}
              >
                <Space style={{ marginBottom: 16 }}>
                  <Input
                    placeholder="Search jobs..."
                    prefix={<SearchOutlined />}
                    value={jobSearch}
                    onChange={(e) => setJobSearch(e.target.value)}
                    style={{ width: 200 }}
                  />
                  <Dropdown overlay={jobFilterMenu} trigger={["click"]}>
                    <Button>
                      <FilterOutlined /> Filter
                    </Button>
                  </Dropdown>
                  <Button onClick={toggleJobFilter}>{getJobFilterText()}</Button>
                </Space>

                <div className="job-table-container">
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th style={{ padding: "12px", textAlign: "left" }}>Job Name</th>
                        <th style={{ padding: "12px", textAlign: "left" }}>Client</th>
                        <th style={{ padding: "12px", textAlign: "center" }}>Staff</th>
                        <th style={{ padding: "12px", textAlign: "center" }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredJobs.map((job) => (
                        <JobRow key={job.id} job={job} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </Tabs.TabPane>

          <Tabs.TabPane tab="Bulk Operations" key="bulk-operations">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <Card
                title={
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#FFFF", fontWeight: "500" }}>Staff</span>
                    <span style={{ color: "#FFFF", fontWeight: "500" }}>Selected: {selectedStaffIds.length}</span>
                  </div>
                }
                headStyle={{ backgroundColor: "#1a4e5f", color: "white" }}
                bodyStyle={{ padding: 16 }}
              >
                <Space style={{ marginBottom: 16 }}>
                  <Input
                    placeholder="Search staff..."
                    prefix={<SearchOutlined />}
                    value={staffSearch}
                    onChange={(e) => setStaffSearch(e.target.value)}
                    style={{ width: 200 }}
                  />
                </Space>

                <div className="staff-table-container">
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th style={{ padding: "12px", textAlign: "center", width: "50px" }}>
                          <Checkbox
                            checked={filteredStaff.length > 0 && filteredStaff.every((s) => s.selected)}
                            indeterminate={
                              filteredStaff.some((s) => s.selected) && !filteredStaff.every((s) => s.selected)
                            }
                            onChange={toggleSelectAllStaff}
                            aria-label="Select all staff"
                          />
                        </th>
                        <th style={{ padding: "12px", textAlign: "left" }}>Name</th>
                        <th style={{ padding: "12px", textAlign: "left" }}>Email</th>
                        <th style={{ padding: "12px", textAlign: "left" }}>Role</th>
                        <th style={{ padding: "12px", textAlign: "center" }}>Jobs</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStaff.map((staffMember) => (
                        <StaffRow key={staffMember.id} staffMember={staffMember} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              <Card
                title={
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#FFFF", fontWeight: "500" }}>Jobs</span>
                    <span style={{ color: "#FFFF", fontWeight: "500" }}>Selected: {selectedJobIds.length}</span>
                  </div>
                }
                headStyle={{ backgroundColor: "#1a4e5f", color: "white" }}
                bodyStyle={{ padding: 16 }}
              >
                <Space style={{ marginBottom: 16 }}>
                  <Input
                    placeholder="Search jobs..."
                    prefix={<SearchOutlined />}
                    value={jobSearch}
                    onChange={(e) => setJobSearch(e.target.value)}
                    style={{ width: 200 }}
                  />
                </Space>

                <div className="job-table-container">
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th style={{ padding: "12px", textAlign: "center", width: "50px" }}>
                          <Checkbox
                            checked={filteredJobs.length > 0 && filteredJobs.every((j) => j.selected)}
                            indeterminate={
                              filteredJobs.some((j) => j.selected) && !filteredJobs.every((j) => j.selected)
                            }
                            onChange={toggleSelectAllJobs}
                            aria-label="Select all jobs"
                          />
                        </th>
                        <th style={{ padding: "12px", textAlign: "left" }}>Job Name</th>
                        <th style={{ padding: "12px", textAlign: "left" }}>Client</th>
                        <th style={{ padding: "12px", textAlign: "center" }}>Staff</th>
                        <th style={{ padding: "12px", textAlign: "center" }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredJobs.map((job) => (
                        <JobRow key={job.id} job={job} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
              <Space>
                <Button icon={<CloseOutlined />} onClick={clearSelections}>
                  Clear Selections
                </Button>
              </Space>
              <Space>
                <Button icon={<DownloadOutlined />} onClick={exportCSV}>
                  Export CSV
                </Button>
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={openBulkAssignmentDialog}
                  disabled={selectedStaffIds.length === 0 || selectedJobIds.length === 0}
                >
                  Assign Selected
                </Button>
              </Space>
            </div>

            <Card
              title={<span style={{ color: "#FFFF", fontWeight: "500" }}>Upload - CSV Assignments Sheet</span>}
              headStyle={{ backgroundColor: "#1a4e5f", color: "white" }}
              style={{ marginTop: 24 }}
            >
              <Space style={{ marginBottom: 16 }}>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  disabled={csvUploadStatus !== "idle"}
                />
                <Button
                  icon={<UploadOutlined />}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={csvUploadStatus !== "idle"}
                >
                  Select CSV File
                </Button>
                <span>{csvFile ? csvFile.name : "No file selected"}</span>
              </Space>

              <Card type="inner" title="CSV Format Guidelines" style={{ marginBottom: 16 }}>
                <ul style={{ listStyleType: "disc", paddingLeft: 24 }}>
                  <li>File must be in CSV format with comma (,) as delimiter</li>
                  <li>First row must contain headers</li>
                  <li>
                    Required columns: <code>staffId</code>, <code>jobId</code>
                  </li>
                  <li>Optional columns: staffName, staffRole, jobName, clientName</li>
                  <li>
                    Example: <code>staffId,jobId,staffName,jobName</code>
                  </li>
                  <li>Each row represents one staff-to-job assignment</li>
                </ul>
              </Card>

              {csvUploadStatus === "preview" && (
                <div>
                  <Card type="inner" title={`Preview (${csvPreview.length} assignments)`} style={{ marginBottom: 16 }}>
                    <div style={{ maxHeight: 160, overflowY: "auto" }}>
                      <Table
                        columns={[
                          { title: "Staff ID", dataIndex: "staffId", key: "staffId" },
                          { title: "Job ID", dataIndex: "jobId", key: "jobId" },
                        ]}
                        dataSource={csvPreview.slice(0, 5)}
                        pagination={false}
                        size="small"
                      />
                      {csvPreview.length > 5 && (
                        <div style={{ textAlign: "center", padding: 8, color: "#666" }}>
                          ... and {csvPreview.length - 5} more rows
                        </div>
                      )}
                    </div>
                  </Card>
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                    <Button onClick={cancelCSVUpload}>Cancel</Button>
                    <Button type="primary" onClick={processCSVUpload}>
                      Process Assignments
                    </Button>
                  </div>
                </div>
              )}

              {csvUploadStatus === "uploading" && (
                <div>
                  <Progress percent={uploadProgress} status="active" />
                  <p style={{ textAlign: "center", marginTop: 8 }}>Processing assignments... {uploadProgress}%</p>
                </div>
              )}

              {csvUploadStatus === "success" && (
                <div style={{ backgroundColor: "#f6ffed", border: "1px solid #b7eb8f", padding: 16, borderRadius: 8 }}>
                  CSV processed successfully! {csvPreview.length} assignments were created.
                </div>
              )}

              {csvUploadStatus === "error" && (
                <div style={{ backgroundColor: "#fff2f0", border: "1px solid #ffccc7", padding: 16, borderRadius: 8 }}>
                  Error processing CSV. Please check the file format and try again.
                </div>
              )}
            </Card>
          </Tabs.TabPane>

          <Tabs.TabPane tab="Analytics" key="analytics">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>
              <Card title="Assignment Overview">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <Card>
                    <p style={{ color: "#666", fontSize: 12 }}>Total Assignments</p>
                    <p style={{ fontSize: 24, fontWeight: "bold" }}>{workloadMetrics.totalAssignments}</p>
                  </Card>
                  <Card>
                    <p style={{ color: "#666", fontSize: 12 }}>Avg. Per Staff</p>
                    <p style={{ fontSize: 24, fontWeight: "bold" }}>
                      {workloadMetrics.averageAssignmentsPerStaff.toFixed(1)}
                    </p>
                  </Card>
                  <Card>
                    <p style={{ color: "#666", fontSize: 12 }}>Assigned Jobs</p>
                    <p style={{ fontSize: 24, fontWeight: "bold" }}>{workloadMetrics.assignedJobs}</p>
                  </Card>
                  <Card>
                    <p style={{ color: "#666", fontSize: 12 }}>Unassigned Jobs</p>
                    <p style={{ fontSize: 24, fontWeight: "bold" }}>{workloadMetrics.unassignedJobs}</p>
                  </Card>
                </div>
              </Card>

              <Card
                title="Workload by Role"
                extra={
                  <Dropdown overlay={roleFilterMenu}>
                    <Button>
                      <FilterOutlined /> Filter
                    </Button>
                  </Dropdown>
                }
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {Object.entries(workloadMetrics.roleWorkload)
                    .filter(([role]) => roleFilter.length === 0 || roleFilter.includes(role as Role))
                    .map(([role, count]) => (
                      <div key={role}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <span>{role}</span>
                          <span>{count} jobs</span>
                        </div>
                        <Progress
                          percent={(count / Math.max(1, workloadMetrics.totalAssignments)) * 100}
                          showInfo={false}
                          strokeColor="#1a4e5f"
                        />
                      </div>
                    ))}
                </div>
              </Card>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 16 }}>
              <Card title="Staff Workload by Role">
                <Tabs defaultActiveKey="director">
                  <Tabs.TabPane tab="Directors" key="director">
                    {workloadMetrics.staffWorkload
                      .filter((s) => s.role === "Director")
                      .sort((a, b) => b.jobCount - a.jobCount)
                      .map((staffWorkload) => (
                        <div key={staffWorkload.id} style={{ marginBottom: 12 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <span>{staffWorkload.name}</span>
                            <span>{staffWorkload.jobCount} jobs</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <Progress
                              percent={staffWorkload.workloadPercentage}
                              showInfo={false}
                              style={{ flexGrow: 1, marginRight: 8 }}
                              strokeColor="#1a4e5f"
                            />
                            <span style={{ width: 48, textAlign: "right" }}>
                              {staffWorkload.workloadPercentage.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    {workloadMetrics.staffWorkload.filter((s) => s.role === "Director").length === 0 && (
                      <div style={{ textAlign: "center", padding: 16, color: "#666" }}>No directors found</div>
                    )}
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="Managers" key="manager">
                    {workloadMetrics.staffWorkload
                      .filter((s) => s.role === "Manager")
                      .sort((a, b) => b.jobCount - a.jobCount)
                      .map((staffWorkload) => (
                        <div key={staffWorkload.id} style={{ marginBottom: 12 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <span>{staffWorkload.name}</span>
                            <span>{staffWorkload.jobCount} jobs</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <Progress
                              percent={staffWorkload.workloadPercentage}
                              showInfo={false}
                              style={{ flexGrow: 1, marginRight: 8 }}
                              strokeColor="#1a4e5f"
                            />
                            <span style={{ width: 48, textAlign: "right" }}>
                              {staffWorkload.workloadPercentage.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    {workloadMetrics.staffWorkload.filter((s) => s.role === "Manager").length === 0 && (
                      <div style={{ textAlign: "center", padding: 16, color: "#666" }}>No managers found</div>
                    )}
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="Accountants" key="accountant">
                    {workloadMetrics.staffWorkload
                      .filter((s) => s.role === "Accountant")
                      .sort((a, b) => b.jobCount - a.jobCount)
                      .map((staffWorkload) => (
                        <div key={staffWorkload.id} style={{ marginBottom: 12 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <span>{staffWorkload.name}</span>
                            <span>{staffWorkload.jobCount} jobs</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <Progress
                              percent={staffWorkload.workloadPercentage}
                              showInfo={false}
                              style={{ flexGrow: 1, marginRight: 8 }}
                              strokeColor="#1a4e5f"
                            />
                            <span style={{ width: 48, textAlign: "right" }}>
                              {staffWorkload.workloadPercentage.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    {workloadMetrics.staffWorkload.filter((s) => s.role === "Accountant").length === 0 && (
                      <div style={{ textAlign: "center", padding: 16, color: "#666" }}>No accountants found</div>
                    )}
                  </Tabs.TabPane>
                </Tabs>
              </Card>

              <Card title="Client Team Composition">
                {jobs
                  .filter((job) => job.assignedStaffCount > 0)
                  .map((job) => {
                    // Get all staff assigned to this job
                    const assignedStaff = staff.filter((s) => s.assignedJobs.includes(job.id))

                    // Count staff by role
                    const roleCount = {
                      Director: assignedStaff.filter((s) => s.role === "Director").length,
                      Manager: assignedStaff.filter((s) => s.role === "Manager").length,
                      Accountant: assignedStaff.filter((s) => s.role === "Accountant").length,
                      Admin: assignedStaff.filter((s) => s.role === "Admin").length,
                      "Super Admin": assignedStaff.filter((s) => s.role === "Super Admin").length,
                      "Special Role": assignedStaff.filter((s) => s.role === "Special Role").length,
                    }

                    return (
                      <Card type="inner" key={job.id} style={{ marginBottom: 16 }}>
                        <h3 style={{ fontWeight: 500 }}>{job.name}</h3>
                        <p style={{ color: "#666", marginBottom: 8 }}>{job.clientName}</p>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span>Directors:</span>
                            <span style={{ fontWeight: 500 }}>{roleCount.Director}</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span>Managers:</span>
                            <span style={{ fontWeight: 500 }}>{roleCount.Manager}</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span>Accountants:</span>
                            <span style={{ fontWeight: 500 }}>{roleCount.Accountant}</span>
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                {jobs.filter((job) => job.assignedStaffCount > 0).length === 0 && (
                  <div style={{ textAlign: "center", padding: 16, color: "#666" }}>No assigned jobs found</div>
                )}
              </Card>
            </div>

            <Card title="Staff Workload" style={{ marginTop: 16 }}>
              <Table
                columns={[
                  { title: "Staff", dataIndex: "name", key: "name" },
                  { title: "Role", dataIndex: "role", key: "role" },
                  { title: "Jobs", key: "jobs", align: "center", render: (_: any, record: any) => record.jobCount },
                  {
                    title: "Workload",
                    key: "workload",
                    render: (_: any, record: any) => (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Progress
                          percent={record.workloadPercentage}
                          showInfo={false}
                          style={{ flexGrow: 1, marginRight: 8 }}
                          strokeColor="#1a4e5f"
                        />
                        <span style={{ width: 48, textAlign: "right" }}>{record.workloadPercentage.toFixed(1)}%</span>
                      </div>
                    ),
                  },
                ]}
                dataSource={workloadMetrics.staffWorkload.sort((a, b) => b.jobCount - a.jobCount)}
                rowKey="id"
                pagination={false}
              />
            </Card>
          </Tabs.TabPane>

          <Tabs.TabPane tab="Role Management" key="role-management">
            <Card
              title={<span style={{ color: "#FFFF", fontWeight: "500" }}>Role Management</span>}
              headStyle={{ backgroundColor: "#1a4e5f", color: "white" }}
              extra={
                <Button type="default" style={{ color: "#000", fontWeight: "500", borderColor: "white" }}>
                  Add Assignment
                </Button>
              }
            >
              <Space style={{ marginBottom: 16 }}>
                <Dropdown overlay={roleFilterMenu}>
                  <Button>
                    <FilterOutlined /> Staff Role
                  </Button>
                </Dropdown>

                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item key="direct">Direct Assignments</Menu.Item>
                      <Menu.Item key="proxy">Proxy Assignments</Menu.Item>
                      <Menu.Item key="special">Special Permissions</Menu.Item>
                    </Menu>
                  }
                >
                  <Button>
                    <FilterOutlined /> Assignment Type
                  </Button>
                </Dropdown>

                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item key="full">Full Access</Menu.Item>
                      <Menu.Item key="read">Read Only</Menu.Item>
                      <Menu.Item key="none">None</Menu.Item>
                    </Menu>
                  }
                >
                  <Button>
                    <FilterOutlined /> Access Level
                  </Button>
                </Dropdown>

                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item key="active">Active</Menu.Item>
                      <Menu.Item key="pending">Pending</Menu.Item>
                      <Menu.Item key="expired">Expired</Menu.Item>
                    </Menu>
                  }
                >
                  <Button>
                    <FilterOutlined /> Status
                  </Button>
                </Dropdown>

                <Input
                  placeholder="Search staff, jobs, clients..."
                  prefix={<SearchOutlined />}
                  style={{ width: 200 }}
                />
              </Space>

              <Table
                columns={[
                  { title: "Staff", dataIndex: "staffName", key: "staffName" },
                  { title: "Role", dataIndex: "staffRole", key: "staffRole" },
                  { title: "Job", dataIndex: "jobName", key: "jobName" },
                  { title: "Client", dataIndex: "clientName", key: "clientName" },
                  {
                    title: "Assignment Type",
                    key: "assignmentType",
                    align: "center",
                    render: (_: any, record: any) => {
                      if (record.type === "proxy") {
                        return <Tag color="orange">Proxy for {record.originalStaffName}</Tag>
                      } else if (record.type === "special") {
                        return <Tag color="green">Special Permission</Tag>
                      }
                      return <Tag>Direct</Tag>
                    },
                  },
                  {
                    title: "Access Level",
                    key: "accessLevel",
                    align: "center",
                    render: (_: any, record: any) => {
                      if (record.accessLevel === "Full Access") {
                        return <Tag color="success">Full Access</Tag>
                      } else if (record.accessLevel === "Read Only") {
                        return <Tag>Read Only</Tag>
                      }
                      return <Tag color="default">None</Tag>
                    },
                  },
                  {
                    title: "Status",
                    key: "status",
                    align: "center",
                    render: (_: any, record: any) => {
                      if (record.status === "Active") {
                        return <Tag color="success">Active</Tag>
                      } else if (record.status === "Pending") {
                        return <Tag color="warning">Pending</Tag>
                      }
                      return <Tag>Expired</Tag>
                    },
                  },
                  {
                    title: "Actions",
                    key: "actions",
                    align: "center",
                    render: () => <Button type="text" icon={<EditOutlined />} />,
                  },
                ]}
                dataSource={[
                  // Direct assignments
                  ...staff.flatMap((staffMember) =>
                    staffMember.assignedJobs
                      .map((jobId) => {
                        const job = jobs.find((j) => j.id === jobId)
                        if (!job) return null
                        return {
                          key: `direct-${staffMember.id}-${jobId}`,
                          staffName: staffMember.name,
                          staffRole: staffMember.role,
                          jobName: job.name,
                          clientName: job.clientName,
                          type: "direct",
                          accessLevel: "Full Access",
                          status: "Active",
                        }
                      })
                      .filter(Boolean),
                  ),
                  // Proxy assignments
                  ...proxyAssignments.flatMap((proxy) => {
                    const proxyStaff = staff.find((s) => s.id === proxy.proxyStaffId)
                    const originalStaff = staff.find((s) => s.id === proxy.originalStaffId)
                    if (!proxyStaff || !originalStaff) return []

                    return originalStaff.assignedJobs
                      .map((jobId) => {
                        const job = jobs.find((j) => j.id === jobId)
                        if (!job) return null
                        return {
                          key: `proxy-${proxy.proxyStaffId}-${jobId}`,
                          staffName: proxyStaff.name,
                          staffRole: proxyStaff.role,
                          jobName: job.name,
                          clientName: job.clientName,
                          originalStaffName: originalStaff.name,
                          type: "proxy",
                          accessLevel: proxy.accessLevel,
                          status: proxy.status,
                          startDate: proxy.startDate,
                          endDate: proxy.endDate,
                        }
                      })
                      .filter(Boolean)
                  }),
                  // Special permissions
                  ...staffPermissions
                    .map((permission) => {
                      const staffMember = staff.find((s) => s.id === permission.staffId)
                      const job = jobs.find((j) => j.id === permission.jobId)
                      if (!staffMember || !job) return null
                      return {
                        key: `permission-${permission.staffId}-${permission.jobId}`,
                        staffName: staffMember.name,
                        staffRole: staffMember.role,
                        jobName: job.name,
                        clientName: job.clientName,
                        type: "special",
                        permissionLevel: permission.permissionLevel,
                        status: "Active",
                      }
                    })
                    .filter(Boolean),
                ]}
                pagination={false}
                scroll={{ x: true }}
              />

              <Card type="inner" title="Role Assignment Rules" style={{ marginTop: 16 }}>
                <ul style={{ listStyleType: "disc", paddingLeft: 24 }}>
                  <li>
                    <strong>Directors</strong> can assign proxies to other Directors
                  </li>
                  <li>
                    <strong>Managers</strong> can assign proxies to other Managers
                  </li>
                  <li>
                    <strong>Accountants</strong> can assign proxies to other Accountants
                  </li>
                  <li>
                    <strong>Super Admin</strong> can assign any job at any level to anyone
                  </li>
                  <li>
                    <strong>Proxy assignments</strong> can be Read Only or Full Access
                  </li>
                  <li>
                    <strong>Special Role</strong> staff can be granted elevated access to specific jobs
                  </li>
                </ul>
              </Card>
            </Card>
          </Tabs.TabPane>
        </Tabs>

        {/* Assignment Confirmation Modal */}
        <Modal
          title="Confirm Assignment"
          open={confirmDialog}
          onOk={confirmAssignment}
          onCancel={() => setConfirmDialog(false)}
          okText="Confirm"
          cancelText="Cancel"
        >
          {assignmentDetails && (
            <div>
              <div style={{ backgroundColor: "#f5f5f5", padding: 12, borderRadius: 8, marginBottom: 16 }}>
                <h3 style={{ color: "#1a4e5f", marginBottom: 8 }}>Assignment Details</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <div>
                    <p style={{ color: "#666", fontSize: 12 }}>Staff</p>
                    <p>{assignmentDetails.staffName}</p>
                  </div>
                  <div>
                    <p style={{ color: "#666", fontSize: 12 }}>Role</p>
                    <p>{assignmentDetails.staffRole}</p>
                  </div>
                  <div>
                    <p style={{ color: "#666", fontSize: 12 }}>Job</p>
                    <p>{assignmentDetails.jobName}</p>
                  </div>
                  <div>
                    <p style={{ color: "#666", fontSize: 12 }}>Client</p>
                    <p>{assignmentDetails.clientName}</p>
                  </div>
                </div>
              </div>
              <p>Are you sure you want to assign this staff member to the job?</p>
            </div>
          )}
        </Modal>

        {/* Bulk Assignment Confirmation Modal */}
        <Modal
          title="Confirm Bulk Assignment"
          open={bulkAssignmentDialog}
          onOk={confirmBulkAssignment}
          onCancel={() => setBulkAssignmentDialog(false)}
          okText="Confirm"
          cancelText="Cancel"
        >
          {bulkAssignmentDetails && (
            <div>
              <div style={{ backgroundColor: "#f5f5f5", padding: 12, borderRadius: 8, marginBottom: 16 }}>
                <h3 style={{ color: "#1a4e5f", marginBottom: 8 }}>Assignment Details</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div>
                    <p style={{ color: "#666", fontSize: 12 }}>Staff ({bulkAssignmentDetails.staffCount})</p>
                    <p style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {bulkAssignmentDetails.staffNames}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: "#666", fontSize: 12 }}>Jobs ({bulkAssignmentDetails.jobCount})</p>
                    <p style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {bulkAssignmentDetails.jobNames}
                    </p>
                  </div>
                </div>
              </div>
              <p>
                This will create {selectedStaffIds.length * selectedJobIds.length} assignments. Are you sure you want to
                proceed?
              </p>
            </div>
          )}
        </Modal>
      </div>
    </DndProvider>
  )
}
