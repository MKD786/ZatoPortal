import { useState, useEffect } from "react"
import { Table, Input, Button, Typography, Modal, Form, Upload, message, Tooltip, Badge, Space, Checkbox } from "antd"
import {
  SearchOutlined,
  // RightOutlined,
  UploadOutlined,
  // MessageOutlined,
  // FileTextOutlined,
  // BarChartOutlined,
  SyncOutlined,
  DownOutlined,
  EyeOutlined,
} from "@ant-design/icons"
import type { ColumnsType } from "antd/es/table"
import type { UploadProps } from "antd"
import Dropdown from "antd/es/dropdown/dropdown"
import { Download, PlusCircle } from "lucide-react"
import { Link } from "react-router-dom"

const { Title } = Typography
const { Dragger } = Upload

interface TooltipItem {
  label: string;
  value: string;
}

interface ClientItem {
  key: string
  name: string
  email: string
  progress: number
  zato_staff: string
  companyName: string
  category: string
  jobs: number
  status: "In Progress" | "Complete" | "Not Started" | null
  lastLogin: string
  supportStaff: {
    name: string
    status: "Available" | "Busy"
  }
  modulesTooltipItems: {
    AC: TooltipItem[];
    WP: TooltipItem[];
    GL: TooltipItem[];
    MJ: TooltipItem[];
  }
  fileAccess: boolean
  results: {
    accounting: number
    taxCompliance: number
    pending: number
    issues: number
  }
}
interface AddClientFormValues {
  name: string
  company: string
  email: string
}

const mockClients: ClientItem[] = [
  {
    key: "1",
    name: "John Smith",
    email: 'john.smith@example.com',
    // companyName: "Smith Enterprises",
    companyName: "Sample Client 1",
    status: "In Progress",
    zato_staff: 'Angelina Barratt, Mark Smith, David Johnson',
    modulesTooltipItems: {
      AC: [
        { label: 'Auto-coded', value: '90' },
        { label: 'Re-coded', value: '10' },
        { label: 'Query to Client', value: '4' },
        { label: 'Human Intervention', value: '6' },
        { label: 'Total', value: '110' }
      ],
      WP: [
        { label: 'Filled', value: '22' },
        { label: 'Pending', value: '5' },
        { label: 'Manual', value: '3' },
        { label: 'Total', value: '35' }
      ],
      GL: [
        { label: 'Resolved', value: '8' },
        { label: 'Observations', value: '10' },
        { label: 'Pending', value: '2' },
        { label: 'Total', value: '20' }
      ],
      MJ: [
        { label: 'Posted', value: '6' },
        { label: 'Draft', value: '4' },
        { label: 'Void', value: '1' },
        { label: 'Total', value: '10' }
      ]
    },
    jobs: 15,
    progress: 75,
    category: "completed",
    lastLogin: "Today, 10:30 AM",
    supportStaff: {
      name: "Alex Johnson, Maria Garcia",
      status: "Available",
    },
    fileAccess: false,
    results: {
      accounting: 68,
      taxCompliance: 40,
      pending: 3,
      issues: 1,
    },
  },
  {
    key: "2",
    name: "Sarah Johnson",
    email: 'sarah.johnson@example.com',
    progress: 100,
    category: 'Due today',
    zato_staff: 'Angelina Barratt,Alex Johnson',
    modulesTooltipItems: {
      AC: [
        { label: 'Auto-coded', value: '90' },
        { label: 'Re-coded', value: '10' },
        { label: 'Query to Client', value: '4' },
        { label: 'Human Intervention', value: '6' },
        { label: 'Total', value: '110' }
      ],
      WP: [
        { label: 'Filled', value: '22' },
        { label: 'Pending', value: '5' },
        { label: 'Manual', value: '3' },
        { label: 'Total', value: '35' }
      ],
      GL: [
        { label: 'Resolved', value: '8' },
        { label: 'Observations', value: '10' },
        { label: 'Pending', value: '2' },
        { label: 'Total', value: '20' }
      ],
      MJ: [
        { label: 'Posted', value: '6' },
        { label: 'Draft', value: '4' },
        { label: 'Void', value: '1' },
        { label: 'Total', value: '10' }
      ]
    },
    jobs: 10,
    // companyName: "Johnson & Co",
    companyName: "Sample Client 2",
    status: "Complete",
    lastLogin: "Yesterday, 3:45 PM",
    supportStaff: {
      name: "Maria Garcia ",
      status: "Busy",
    },
    fileAccess: false,
    results: {
      accounting: 45,
      taxCompliance: 60,
      pending: 5,
      issues: 1,
    },
  },
  {
    key: "3",
    name: "Michael Brown",
    email: 'michael.brown@example.com',
    progress: 0,
    zato_staff: 'Angelina Barratt',
    // companyName: "Brown Industries",
    companyName: "Sample Client 3",
    modulesTooltipItems: {
      AC: [
        { label: 'Auto-coded', value: '90' },
        { label: 'Re-coded', value: '10' },
        { label: 'Query to Client', value: '4' },
        { label: 'Human Intervention', value: '6' },
        { label: 'Total', value: '110' }
      ],
      WP: [
        { label: 'Filled', value: '22' },
        { label: 'Pending', value: '5' },
        { label: 'Manual', value: '3' },
        { label: 'Total', value: '35' }
      ],
      GL: [
        { label: 'Resolved', value: '8' },
        { label: 'Observations', value: '10' },
        { label: 'Pending', value: '2' },
        { label: 'Total', value: '20' }
      ],
      MJ: [
        { label: 'Posted', value: '6' },
        { label: 'Draft', value: '4' },
        { label: 'Void', value: '1' },
        { label: 'Total', value: '10' }
      ]
    },
    jobs: 50,
    category: "Due tomorrow",
    status: "Not Started",
    lastLogin: "1 week ago",
    supportStaff: {
      name: "David Lee, John",
      status: "Available",
    },
    fileAccess: false,
    results: {
      accounting: 92,
      taxCompliance: 100,
      pending: 1,
      issues: 0,
    },
  },
  {
    key: "4",
    name: "Emily Davis",
    email: 'emily.davis@example.com',
    progress: 25,
    zato_staff: 'Angelina Barratt',
    // companyName: "Davis Consulting",
    companyName: "Sample Client 4",
    modulesTooltipItems: {
      AC: [
        { label: 'Auto-coded', value: '90' },
        { label: 'Re-coded', value: '10' },
        { label: 'Query to Client', value: '4' },
        { label: 'Human Intervention', value: '6' },
        { label: 'Total', value: '110' }
      ],
      WP: [
        { label: 'Filled', value: '22' },
        { label: 'Pending', value: '5' },
        { label: 'Manual', value: '3' },
        { label: 'Total', value: '35' }
      ],
      GL: [
        { label: 'Resolved', value: '8' },
        { label: 'Observations', value: '10' },
        { label: 'Pending', value: '2' },
        { label: 'Total', value: '20' }
      ],
      MJ: [
        { label: 'Posted', value: '6' },
        { label: 'Draft', value: '4' },
        { label: 'Void', value: '1' },
        { label: 'Total', value: '10' }
      ]
    },
    jobs: 56,
    category: "Overdue",
    status: "In Progress",
    lastLogin: "Today, 10:30 AM",
    supportStaff: {
      name: "Alex Johnson",
      status: "Available",
    },
    fileAccess: false,
    results: {
      accounting: 30,
      taxCompliance: 40,
      pending: 7,
      issues: 2,
    },
  },
  {
    key: "5",
    name: "Robert Wilson",
    email: 'robert.wilson@example.com',
    zato_staff: 'Angelina Barratt, Davis, John Doe',
    modulesTooltipItems: {
      AC: [
        { label: 'Auto-coded', value: '90' },
        { label: 'Re-coded', value: '10' },
        { label: 'Query to Client', value: '4' },
        { label: 'Human Intervention', value: '6' },
        { label: 'Total', value: '110' }
      ],
      WP: [
        { label: 'Filled', value: '22' },
        { label: 'Pending', value: '5' },
        { label: 'Manual', value: '3' },
        { label: 'Total', value: '35' }
      ],
      GL: [
        { label: 'Resolved', value: '8' },
        { label: 'Observations', value: '10' },
        { label: 'Pending', value: '2' },
        { label: 'Total', value: '20' }
      ],
      MJ: [
        { label: 'Posted', value: '6' },
        { label: 'Draft', value: '4' },
        { label: 'Void', value: '1' },
        { label: 'Total', value: '10' }
      ]
    },
    jobs: 14,
    // companyName: "Wilson Ltd",
    companyName: "Sample Client 5",
    status: "In Progress",
    progress: 30,
    category: "completed",
    lastLogin: "2 weeks ago",
    supportStaff: {
      name: "Maria Garcia",
      status: "Busy",
    },
    fileAccess: false,
    results: {
      accounting: 15,
      taxCompliance: 25,
      pending: 8,
      issues: 3,
    },
  },
  {
    key: "6",
    name: "John Doe",
    email: 'john.doe@example.com',
    zato_staff: 'Angelina Barratt,  Maria',
    // companyName: "Doe Enterprises",
    companyName: "Sample Client 6",
    modulesTooltipItems: {
      AC: [
        { label: 'Auto-coded', value: '90' },
        { label: 'Re-coded', value: '10' },
        { label: 'Query to Client', value: '4' },
        { label: 'Human Intervention', value: '6' },
        { label: 'Total', value: '110' }
      ],
      WP: [
        { label: 'Filled', value: '22' },
        { label: 'Pending', value: '5' },
        { label: 'Manual', value: '3' },
        { label: 'Total', value: '35' }
      ],
      GL: [
        { label: 'Resolved', value: '8' },
        { label: 'Observations', value: '10' },
        { label: 'Pending', value: '2' },
        { label: 'Total', value: '20' }
      ],
      MJ: [
        { label: 'Posted', value: '6' },
        { label: 'Draft', value: '4' },
        { label: 'Void', value: '1' },
        { label: 'Total', value: '10' }
      ]
    },
    jobs: 23,
    status: "In Progress",
    progress: 45,
    category: "Overdue",
    lastLogin: "3 days ago",
    supportStaff: {
      name: "David Lee, Alex",
      status: "Available",
    },
    fileAccess: false,
    results: {
      accounting: 75,
      taxCompliance: 80,
      pending: 2,
      issues: 0,
    },
  },
  {
    key: "7",
    name: "Bob Smith",
    email: 'bob.smith@example.com',
    zato_staff: 'George',
    // companyName: "Bobs Enterprises",
    companyName: "Sample Client 7",
    modulesTooltipItems: {
      AC: [
        { label: 'Auto-coded', value: '90' },
        { label: 'Re-coded', value: '10' },
        { label: 'Query to Client', value: '4' },
        { label: 'Human Intervention', value: '6' },
        { label: 'Total', value: '110' }
      ],
      WP: [
        { label: 'Filled', value: '22' },
        { label: 'Pending', value: '5' },
        { label: 'Manual', value: '3' },
        { label: 'Total', value: '35' }
      ],
      GL: [
        { label: 'Resolved', value: '8' },
        { label: 'Observations', value: '10' },
        { label: 'Pending', value: '2' },
        { label: 'Total', value: '20' }
      ],
      MJ: [
        { label: 'Posted', value: '6' },
        { label: 'Draft', value: '4' },
        { label: 'Void', value: '1' },
        { label: 'Total', value: '10' }
      ]
    },
    jobs: 23,
    status: "In Progress",
    progress: 45,
    category: "Due today",
    lastLogin: "3 days ago",
    supportStaff: {
      name: "David Lee, Alex",
      status: "Available",
    },
    fileAccess: false,
    results: {
      accounting: 75,
      taxCompliance: 80,
      pending: 2,
      issues: 0,
    },
  },
  {
    key: "8",
    name: "JK Sons",
    email: 'jk.sons@example.com',
    zato_staff: 'Maria, Mark',
    // companyName: "JK Sons Enterprises",
    companyName: "Sample Client 8",
    modulesTooltipItems: {
      AC: [
        { label: 'Auto-coded', value: '90' },
        { label: 'Re-coded', value: '10' },
        { label: 'Query to Client', value: '4' },
        { label: 'Human Intervention', value: '6' },
        { label: 'Total', value: '110' }
      ],
      WP: [
        { label: 'Filled', value: '22' },
        { label: 'Pending', value: '5' },
        { label: 'Manual', value: '3' },
        { label: 'Total', value: '35' }
      ],
      GL: [
        { label: 'Resolved', value: '8' },
        { label: 'Observations', value: '10' },
        { label: 'Pending', value: '2' },
        { label: 'Total', value: '20' }
      ],
      MJ: [
        { label: 'Posted', value: '6' },
        { label: 'Draft', value: '4' },
        { label: 'Void', value: '1' },
        { label: 'Total', value: '10' }
      ]
    },
    jobs: 23,
    status: "In Progress",
    progress: 45,
    category: "Due today",
    lastLogin: "3 days ago",
    supportStaff: {
      name: "David Lee, Alex",
      status: "Available",
    },
    fileAccess: false,
    results: {
      accounting: 75,
      taxCompliance: 80,
      pending: 2,
      issues: 0,
    },
  },
  {
    key: "9",
    name: "Anna Jones",
    email: 'anna.jones@example.com',
    zato_staff: 'Rutherford, KK',
    // companyName: "jones foods ltd",
    companyName: "Sample Client 9",
    modulesTooltipItems: {
      AC: [
        { label: 'Auto-coded', value: '90' },
        { label: 'Re-coded', value: '10' },
        { label: 'Query to Client', value: '4' },
        { label: 'Human Intervention', value: '6' },
        { label: 'Total', value: '110' }
      ],
      WP: [
        { label: 'Filled', value: '22' },
        { label: 'Pending', value: '5' },
        { label: 'Manual', value: '3' },
        { label: 'Total', value: '35' }
      ],
      GL: [
        { label: 'Resolved', value: '8' },
        { label: 'Observations', value: '10' },
        { label: 'Pending', value: '2' },
        { label: 'Total', value: '20' }
      ],
      MJ: [
        { label: 'Posted', value: '6' },
        { label: 'Draft', value: '4' },
        { label: 'Void', value: '1' },
        { label: 'Total', value: '10' }
      ]
    },
    jobs: 23,
    status: "In Progress",
    progress: 45,
    category: "Due tomorrow",
    lastLogin: "3 days ago",
    supportStaff: {
      name: "David Lee, Alex",
      status: "Available",
    },
    fileAccess: false,
    results: {
      accounting: 75,
      taxCompliance: 80,
      pending: 2,
      issues: 0,
    },
  },
  {
    key: "10",
    name: "Jessica Williams",
    email: 'jessica.williams@example.com',
    zato_staff: 'Peter, Edward',
    // companyName: "williams exports",
    companyName: "Sample Client 10",
    modulesTooltipItems: {
      AC: [
        { label: 'Auto-coded', value: '90' },
        { label: 'Re-coded', value: '10' },
        { label: 'Query to Client', value: '4' },
        { label: 'Human Intervention', value: '6' },
        { label: 'Total', value: '110' }
      ],
      WP: [
        { label: 'Filled', value: '22' },
        { label: 'Pending', value: '5' },
        { label: 'Manual', value: '3' },
        { label: 'Total', value: '35' }
      ],
      GL: [
        { label: 'Resolved', value: '8' },
        { label: 'Observations', value: '10' },
        { label: 'Pending', value: '2' },
        { label: 'Total', value: '20' }
      ],
      MJ: [
        { label: 'Posted', value: '6' },
        { label: 'Draft', value: '4' },
        { label: 'Void', value: '1' },
        { label: 'Total', value: '10' }
      ]
    },
    jobs: 23,
    status: "In Progress",
    progress: 45,
    category: "due_day_after_tomorrow",
    lastLogin: "3 days ago",
    supportStaff: {
      name: "David Lee, Alex",
      status: "Available",
    },
    fileAccess: false,
    results: {
      accounting: 75,
      taxCompliance: 80,
      pending: 2,
      issues: 0,
    },
  },
]

const getQueryCounts = (queries: ClientItem[]) => {
  const active = queries.filter((q) => q.category === "active").length
  const completed = queries.filter((q) => q.category === "completed").length
  const dueToday = queries.filter((q) => q.category === "Due today").length
  const dueTomorrow = queries.filter((q) => q.category === "Due tomorrow").length
  // const dueThisWeek = queries.filter((q) => q.category === "Due this week").length
  const dueThisWeek = queries.filter((q) => q.category === "Due this week").length 
  + queries.filter((q) => q.category === "due_day_after_tomorrow").length
  + queries.filter((q) => q.category === "Due tomorrow").length
  + queries.filter((q) => q.category === "Due today").length
  const overdue = queries.filter((q) => q.category === "Overdue").length
  const responded = queries.filter((q) => q.category === "Responded").length
  const yetToRespond = queries.filter((q) => q.category === "Yet to respond").length

  return {
    active,
    completed,
    dueToday,
    dueTomorrow,
    dueThisWeek,
    overdue,
    total: queries.length,
    responded,
    yetToRespond,
  }
}
const ClientManagement = () => {
  const user_control = JSON.parse(sessionStorage.getItem("user") || "{}")
  const [clients, setClients] = useState<ClientItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [activeTab, setActiveTab] = useState("active")
  // const [visibleStatus, setVisibleStatus] = useState<{ [key: string]: boolean }>({});
  const [addClientModalVisible, setAddClientModalVisible] = useState(false)
  const [importClientsModalVisible, setImportClientsModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [filteredClients, setFilteredClients] = useState<ClientItem[]>([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [modalClient, setModalClient] = useState<ClientItem | null>(null)
  const [pendingAccessToggle, setPendingAccessToggle] = useState<boolean | null>(null)
  const [clientInvitationChecked, setClientInvitationChecked] = useState<boolean>(true)
  const [queryCounts, setQueryCounts] = useState({
    active: 0,
    completed: 0,
    dueToday: 0,
    dueTomorrow: 0,
    dueThisWeek: 0,
    overdue: 0,
    total: 0,
    responded: 0,
    yetToRespond: 0,
  })

  const clientModuleItems = [
    {
      label: 'AC',
      color: '#D3D3D3',
      title: 'Auto Coding',
    },
    {
      label: 'GL',
      color: '#52c41a',
      title: 'GL Scrutiny',
    },
    {
      label: 'WP',
      color: '#FFD580',
      title: 'WorkPapers',
    },
    {
      label: 'MJ',
      color: '#999',
      title: 'Journals',
    },
  ];

  const queryTabs = [
    { key: "active", label: `Total Clients (${queryCounts.total})` },
    { key: "completed", label: `Completed (${queryCounts.completed})` },
    { key: "dueToday", label: `Due Today (${queryCounts.dueToday})` },
    { key: "dueTomorrow", label: `Due Tomorrow (${queryCounts.dueTomorrow})` },
    { key: "dueThisWeek", label: `Due This Week (${queryCounts.dueThisWeek})` },
    { key: "overdue", label: `Overdue (${queryCounts.overdue})` },
  ]

  useEffect(() => {
    fetchClients()
  }, []);

  // const handleInviteFunction = (key: string) => {
  //   setVisibleStatus((prev) => ({
  //     ...prev,
  //     [key]: !prev[key],
  //   }));
  // };

  const getProgressBarColor = (status: string) => {
    switch (status) {
      case "Complete":
        return "#52c41a"
      case "Not Started":
        return "#f5f5f5"
      case "In Progress":
        return "#0F5B6D"
      default:
        return "#0F5B6D"
    }
  }

  const handleTabChange = (key: string) => {
    setActiveTab(key)
  }
  useEffect(() => {
    fetchClients()
  }, [])
  // Calculate counts for each category

  const fetchClients = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setQueryCounts(getQueryCounts(mockClients))
      setClients([...mockClients])
      setLoading(false)
    }, 1000)
  }

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
    console.log("Selected Row Keys:", newSelectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  // const expandIcon = ({ expanded, onExpand, record }: any) => (
  //   <RightOutlined
  //     style={{
  //       transform: expanded ? "rotate(90deg)" : "none",
  //       transition: "transform 0.2s",
  //       marginRight: 8,
  //       color: "#8c8c8c",
  //     }}
  //     onClick={(e) => onExpand(record, e)}
  //   />
  // )

  const handleAddClient = () => {
    setAddClientModalVisible(true)
  }

  const handleImportClients = () => {
    setImportClientsModalVisible(true)
  }

  const handleAddClientSubmit = () => {
    form
      .validateFields()
      .then((values: AddClientFormValues) => {
        console.log("Add client form values:", values)

        const newClient: ClientItem = {
          key: (clients.length + 1).toString(),
          name: values.name,
          companyName: values.company,
          status: null,
          email: values.email,
          progress: 0,
          zato_staff: "",
          category: "",
          lastLogin: "Just now",
          supportStaff: {
            name: "Alex Johnson",
            status: "Available",
          },
          fileAccess: false,
          results: {
            accounting: 0,
            taxCompliance: 0,
            pending: 0,
            issues: 0,
          },
          jobs: 0,
          modulesTooltipItems: {
            AC: [],
            WP: [],
            GL: [],
            MJ: []
          }
        }

        setClients([newClient, ...clients])
        message.success("Client added successfully")
        form.resetFields()
        setAddClientModalVisible(false)
      })
      .catch((info) => {
        console.log("Validate Failed:", info)
      })
  }

  const handleCancelAddClient = () => {
    form.resetFields()
    setAddClientModalVisible(false)
  }

  const handleCancelImportClients = () => {
    setImportClientsModalVisible(false)
  }

  const handleImportClientsSubmit = () => {
    message.success("Clients imported successfully")
    setImportClientsModalVisible(false)
  }

  const uploadProps: UploadProps = {
    name: "file",
    multiple: false,
    accept: ".xlsx,.xls,.csv",
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    onChange(info) {
      const { status } = info.file
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`)
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files)
    },
  }

  const columns: ColumnsType<ClientItem> = [
    {
      title: "Client",
      key: "client",
      width: 180,
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <div>
            {/* <div style={{ fontSize: "0.8rem" }}>{record.name}</div> */}
            <div style={{ fontSize: "12px" }}>{record.companyName}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "lastLogin",
      key: "lastLogin",
      width: 170,
      render: (_, record) => <span style={{ fontSize: "0.8rem" }}>{record?.email}</span>,
    },
    {
      title: "Invite",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (_,) => {
        // const isVisible = visibleStatus[record.key] || false;

        return (
          <div style={{ cursor: "pointer" }}>
            {/* {isVisible ? (<img src={VeriFyImage} alt="Verified" onClick={() => handleInviteFunction(record.key)} />) : (<img src={Not_VeriFyImage} alt="Not Verified" onClick={() => handleInviteFunction(record.key)} />)} */}
            <div className="flex items-center justify-center" >
              <select name="questionnaire" id="" style={{ width: "100%", border: "1px solid #0f5b6d", outline: "none", borderRadius: "4px", padding: "0.2rem", color: "#0f5b6d", fontSize: "0.6rem" }}>
                <option value="">Select Questionnaire</option>
                <option value="questionnaire_one">Questionnaire 1</option>
                <option value="questionnaire_two">Questionnaire 2</option>
                <option value="questionnaire_three">Questionnaire 3</option>
                <option value="questionnaire_four">Questionnaire 4</option>
                <option value="questionnaire_five">Questionnaire 5</option>
              </select>
            </div>
          </div>
        );
      },
    },
    {
      title: (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Last Login</span>
        </div>
      ),
      dataIndex: "lastLogin",
      key: "lastLogin",
      width: 150,
      filters: [
        {
          text: "Recent Login",
          value: "recent",
        },
        {
          text: "Older Login",
          value: "older",
        },
      ],
      onFilter: (value, record) => {
        const loginDate = new Date(record.lastLogin);
        const now = new Date();
        const diffInDays = (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60 * 24);

        if (value === "recent") {
          return diffInDays <= 7; // recent = last 7 days
        } else if (value === "older") {
          return diffInDays > 7;
        }
        return true;
      },
      render: (text) => <span style={{ fontSize: "0.8rem" }}>{text}</span>,
    },
    {
      title: "ACCT. Lead",
      key: "supportStaff",
      width: 110,
      render: (_, record) => {
        const names = record.supportStaff.name.split(",").map(name => name.trim());
        // const length = names.length;

        let fontSize = "0.7rem";


        return (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {names.map((name, index) => (
              <div key={index} style={{ fontSize, lineHeight: 1.4 }}>
                {name}
              </div>
            ))}
          </div>
        );
      },
    },

    {
      title: "Support ",
      key: "supportStaff",
      width: 110,
      render: (_, record) => {
        const names = record.zato_staff.split(",").map(name => name.trim());
        // const length = names.length;

        let fontSize = "0.7rem";

        return (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {names.map((name, index) => (
              <div key={index} style={{ fontSize, lineHeight: 1.4 }}>
                {name}
              </div>
            ))}
          </div>
        );
      },
    },
    {
      title: "Questionnaire",
      key: "fileAccess",
      width: 70,
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ fontSize: "0.8rem" }}>{record.progress}%</span>
          <div
            style={{
              width: "60px",
              height: "6px",
              backgroundColor: "#f0f0f0",
              borderRadius: "3px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${record.progress}%`,
                height: "100%",
                backgroundColor: getProgressBarColor(record?.status || ""),
                borderRadius: "3px",
              }}
            />
          </div>
        </div>
      ),
    },

    {
      title: "Query Hub",
      key: "results",
      width: 130,
      render: (_,) => (
        <div className="sm:flex sm:gap-2 flex-col md:flex-row md:gap-2 lg:flex-row lg:gap-1">
          <Tooltip placement="top" title={<span style={{ fontSize: '0.8rem' }}>Active Queries</span>} >
            <Badge count={15} style={{ backgroundColor: '#D3D3D3', fontSize: '0.8rem' }} />
          </Tooltip>
          <Tooltip placement="top" title={<span style={{ fontSize: '0.8rem' }}>Completed</span>}>
            <Badge count={4} style={{ backgroundColor: '#52c41a', fontSize: '0.8rem' }} />
          </Tooltip>
          <Tooltip placement="top" title={<span style={{ fontSize: '0.8rem' }}>Yet to Respond</span>}>
            <Badge count={11} showZero style={{ backgroundColor: '#FFD580', fontSize: '0.8rem' }} />
          </Tooltip>
          <Tooltip placement="top" title={<span style={{ fontSize: '0.8rem' }}>Overdue</span>}>
            <Badge count={5} showZero style={{ fontSize: '0.8rem' }} />
          </Tooltip>
        </div>
      ),
    },
    // overlayInnerStyle={{
    //   backgroundColor: "#f0f0f0",
    //   color: "#333"
    // }}
    // render: () => <Dropdown menu={{ items: clientMenuItems }} placement="bottomRight">
    //   <Button type="text" icon={<MoreOutlined />} style={{ color: "#8c8c8c" }} />
    // </Dropdown>
    {
      title: "Module",
      key: "Module",
      width: 120,
      render: (_, record) => (
        <div className="sm:flex sm:gap-2 flex-col md:flex-row md:gap-2 lg:flex-row lg:gap-1">
          {clientModuleItems.map((item) => (
            <Tooltip
              key={item.label}
              placement="top"
              title={
                <div>
                  <div style={{ display: 'flex', justifyContent: 'center', fontSize: '0.7rem', fontWeight: "400" }}>
                    <p>{item.title}</p>
                  </div>
                  <table style={{
                    fontSize: '0.6rem',
                    borderCollapse: 'collapse',
                    border: '1px solid #d9d9d9',
                  }}>
                    <tbody >
                      {(record.modulesTooltipItems?.[item.label as keyof typeof record.modulesTooltipItems] || []).map(({ label, value }: TooltipItem, index: number) => (
                        <tr key={index}>
                          <td style={{
                            border: '1px solid #d9d9d9',
                            padding: '2px 6px',
                            fontWeight: 500,
                          }}
                          >{label}</td>
                          <td style={{
                            border: '1px solid #d9d9d9',
                            padding: '2px 6px',
                            display: 'flex',
                            justifyContent: 'flex-end'
                          }}>{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              }
            >
              <Badge count={item.label} style={{ backgroundColor: item.color, fontSize: '0.5rem' }} />
            </Tooltip>
          ))}
        </div>
      ),
    }, {
      title: "View",
      key: "jobs",
      width: 70,
      render: (_,) => (
        <Link to={`/client-view`}>
          <div className="flex items-center cursor-pointer">
            {/* <Badge color="blue" count={record.jobs} /> */}
            <EyeOutlined />
          </div>
        </Link>
      ),
    },
  ]

  // const clientMenuItems = [
  //   {
  //     key: "message",
  //     label: "Message",
  //     icon: <MessageOutlined />
  //   },
  //   {
  //     key: "view_files",
  //     label: "View Files",
  //     icon: <FileTextOutlined />
  //   },
  //   {
  //     key: "results",
  //     label: "Results",
  //     icon: <BarChartOutlined />
  //   },
  // ]
  const getFilteredQueries = () => {
    switch (activeTab) {
      case "active":
        // return clients.filter((q) => q.category === "active")
        return clients
      case "completed":
        return clients.filter((q) => q.category === "completed")
      case "dueToday":
        return clients.filter((q) => q.category === "Due today")
      case "dueTomorrow":
        return clients.filter((q) => q.category === "Due tomorrow")
      case "dueThisWeek":
        return clients.filter((q) => (q.category === "Due this week" || q.category === "due_day_after_tomorrow" || q.category === "Due today" || q.category === "Due tomorrow"))
      case "overdue":
        return clients.filter((q) => q.category === "Overdue")
      default:
        return clients
    }
  }
  return (
    <div className="space-y-5">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", }}>
        <Title level={3} style={{ margin: 0, fontSize: "24px", color: "#0F5B6D" }}>Client Management</Title>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          {user_control.role === "admin" && (<>
            <Button type="primary" icon={<SyncOutlined />} style={{ backgroundColor: "#0F5B6D", borderColor: "#0F5B6D" }}>Xero</Button>
            <Dropdown menu={{
              items: [
                {
                  key: "add_client_manually",
                  label: "Add Client Manually",
                  icon: <PlusCircle />,
                  onClick: handleAddClient
                },
                {
                  key: "import",
                  label: "Import Clients",
                  icon: <Download />,
                  onClick: handleImportClients
                }
              ]
            }} placement="bottomRight">
              <Button style={{ color: "#0F5B6D", borderColor: "#0F5B6D" }}><Space>Add Clients<DownOutlined /></Space></Button>
            </Dropdown></>)}
        </div>
      </div>

      <div className="flex items-center justify-between" style={{ gap: "12px", margin: "0.3rem 0" }}>
        <div style={{ display: "flex", gap: "12px", width: "70%" }}>
          <Input
            placeholder="Search Clients, Client Lead, Support "
            onChange={(e) => {
              const searchValue = e.target.value;
              const filteredJobs = clients?.filter(client =>
                client.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                client.supportStaff.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                client.zato_staff.toLowerCase().includes(searchValue.toLowerCase())
              );
              return setFilteredClients(filteredJobs);

            }}
            prefix={<SearchOutlined style={{ color: "#8c8c8c" }} />}
            style={{
              width: "100%",
              maxWidth: "400px",
              borderRadius: "4px",
            }} />
          {/* <select disabled name="status" id="" style={{ cursor: "not-allowed", padding: "0.4rem", width: 120, fontSize: '0.8rem', color: '#000', outline: 'none', border: "1px solid #dedede", borderRadius: "4px" }}>
            <option value="">Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <select disabled name="Activity" id="" style={{ cursor: "not-allowed", padding: "0.4rem", width: 120, fontSize: '0.8rem', color: '#000', outline: 'none', border: "1px solid #dedede", borderRadius: "4px" }}>
            <option value="">Activity</option>
            <option value="recent">Recent</option>
            <option value="oldest">Oldest</option>
          </select> */}
        </div>
        {/* <div style={{ display: "flex", gap: "12px" }}>
          <Button
            icon={<ImportOutlined />}
            onClick={handleImportClients}
            style={{
              display: "flex",
              alignItems: "center",
              borderRadius: "4px",
              borderColor: "#d9d9d9",
              color: "#262626",
            }}
          >
            Import Clients
          </Button>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={handleAddClient}
            style={{
              display: "flex",
              alignItems: "center",
              borderRadius: "4px",
              backgroundColor: "#0F5B6D",
              borderColor: "#0F5B6D",
            }}
          >
            Add Client
          </Button>
        </div> */}
      </div>
      <div className="flex items-center justify-between border-b border-gray-200" style={{ margin: "0" }}>
        <div className="flex items-center" style={{ backgroundColor: "#fff", borderRadius: "4px", padding: "0.2rem" }}>
          <p style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1rem', fontWeight: '600' }}>Client Status :</p>
          {queryTabs.map((item) => (
            <div
              key={item.key}
              style={{
                color: activeTab === item.key ? "#0F5B6D" : "#333333f5",
                borderBottom: activeTab === item.key ? " 2px solid #0F5B6D" : "",
                backgroundColor: activeTab === item.key ? "aliceblue" : "#fff",
                borderRadius: "4px",
                margin: "0 4px",
              }}
              className={`px-1 py-1 cursor-pointer text-sm font-medium `}
              onClick={() => handleTabChange(item.key)}
            >
              {item.label}
            </div>
          ))}
        </div>
        {user_control.role === "admin" && (
          <div className="flex items-center justify-between gap-2">
            <Checkbox
              defaultChecked={selectedRowKeys.length > 0}
              checked={clientInvitationChecked}
              disabled={selectedRowKeys.length === 0}
            onChange={(e) => setClientInvitationChecked(e.target.checked)}
            style={{
              display: "flex",
              alignItems: "center",
              borderRadius: "4px",
              backgroundColor: selectedRowKeys.length > 0 ? "#fff" : "#fff",
              borderColor: "#0F5B6D",
              color: selectedRowKeys.length > 0 ? "#0F5B6D" : "#333333f5",
            }}
          >
            <p className="text-sm">Client Invitation</p>
          </Checkbox>
          {/* <Button
            type="primary"
            icon={<LucideRocket size={16} />}
            // disabled={selectedRowKeys.length > 0 ? false : true}
            disabled={true}
            style={{
              display: "flex",
              alignItems: "center",
              borderRadius: "4px",
              // backgroundColor: selectedRowKeys.length > 0 ? "#0F5B6D" : "#0f5b6dcc",
              backgroundColor: "#0f5b6dcc",
              borderColor: "#0F5B6D",
              color: "#fff",
            }}
          >
            Enable Support
          </Button> */}
        </div>
        )}
      </div>
      <div className="client-management-table" style={{ marginTop: '2px' }}>
        {/* <Spin spinning={loading} tip="Loading..."> */}
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredClients.length > 0 ? filteredClients : getFilteredQueries()}
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} clients`,
          }}
          rowKey="key"
          // expandable={{
          //   expandIcon: expandIcon,
          //   expandRowByClick: true,
          //   expandedRowRender: (record) => (
          //     <div style={{ padding: "20px" }}>
          //       <p style={{ margin: 0 }}>Additional details for {record.name}</p>
          //     </div>
          //   ),
          // }}
          className="client-table"
        />
      </div>
      {/* Client Modal */}
      <Modal
        title={<div style={{ fontSize: "20px", fontWeight: "bold", color: "Black" }}>Add New Client</div>}
        open={addClientModalVisible}
        onCancel={handleCancelAddClient}
        footer={[
          <Button key="cancel" onClick={handleCancelAddClient} style={{ borderRadius: "4px" }}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleAddClientSubmit}
            style={{
              borderRadius: "4px",
              backgroundColor: "#0F5B6D",
              borderColor: "#0F5B6D",
            }}
          >
            Add Client
          </Button>,
        ]}
        width={500}
        centered
      >
        <div style={{ marginBottom: "10px", color: "#8c8c8c" }}>Enter client details to import into Zato.</div>
        <Form form={form} layout="vertical" name="addClientForm" style={{ marginTop: "20px" }}>

          <Form.Item
            style={{ marginBottom: "5px" }}
            name="company"
            label={<span style={{ fontWeight: "500" }}>Business Entity</span>}
            rules={[{ required: true, message: "Please enter business entity name" }]}
          >
            <Input style={{ borderRadius: "4px" }} />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: "5px" }}
            name="name"
            label={<span style={{ fontWeight: "500" }}>Name of Contact Person</span>}
            rules={[{ required: true, message: "Please enter client name" }]}
          >
            <Input style={{ borderRadius: "4px" }} />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: "5px" }}
            name="email"
            label={<span style={{ fontWeight: "500" }}>Official Email</span>}
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input style={{ borderRadius: "4px" }} />
          </Form.Item>
        </Form>
      </Modal>
      {/*  Clients Modal */}
      <Modal
        title={<div style={{ fontSize: "20px", fontWeight: "bold", color: "Black" }}>Import Clients</div>}
        open={importClientsModalVisible}
        onCancel={handleCancelImportClients}
        footer={[
          <Button key="cancel" onClick={handleCancelImportClients} style={{ borderRadius: "4px" }}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleImportClientsSubmit}
            style={{
              borderRadius: "4px",
              backgroundColor: "#0F5B6D",
              borderColor: "#0F5B6D",
            }}
          >
            Import Clients
          </Button>,
        ]}
        width={600}
        centered
      >
        <div style={{ marginBottom: "20px", color: "#8c8c8c" }}>
          Upload an Excel or CSV file with client data to import.
        </div>
        <Dragger {...uploadProps} style={{ marginBottom: "20px", border: "2.5px dashed #e5e7eb" }}>
          <p className="ant-upload-drag-icon">
            <UploadOutlined style={{ color: "#8c8c8c", fontSize: "48px" }} />
          </p>
          <p className="ant-upload-text" style={{ fontSize: "16px" }}>
            Drag and drop your file here, or click to browse
          </p>
          <p className="ant-upload-hint" style={{ color: "#8c8c8c" }}>
            Supports Excel (.xlsx) and CSV (.csv) files
          </p>
        </Dragger>
        <div style={{ marginTop: "20px" }}>
          <span style={{ marginRight: "8px" }}>Need a template?</span>
          <a href="#" style={{ color: "#0F5B6D" }}>
            Download template
          </a>
        </div>
      </Modal>
      <Modal
        open={isModalVisible}
        title={pendingAccessToggle ? "Grant File Access" : "Restrict File Access"}
        onCancel={() => {
          setIsModalVisible(false)
          setModalClient(null)
          setPendingAccessToggle(null)
        }}
        onOk={() => {
          if (modalClient) {
            const updatedClients = clients.map(client =>
              client.key === modalClient.key
                ? { ...client, fileAccess: !pendingAccessToggle } // toggle access based on intent
                : client
            )
            setClients(updatedClients)
          }
          setIsModalVisible(false)
          setModalClient(null)
          setPendingAccessToggle(null)
        }}
        okText={pendingAccessToggle ? "Grant Access " : "Restrict Access"}
        okButtonProps={{ danger: !pendingAccessToggle }}
        cancelText="Cancel"
        destroyOnClose
        closable
      >
        <p>
          {pendingAccessToggle
            ? `Are you sure you want to grant file access for this client? The support staff will be able to view and discuss client files. ${modalClient?.name}?`
            : `Are you sure you want to restrict file access for this client? The support staff will no longer be able to view or discuss client files.
           ${modalClient?.name}?`}
        </p>
      </Modal>
    </div>
  )
}

export default ClientManagement
