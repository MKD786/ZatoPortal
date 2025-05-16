import { BarChartOutlined, CalendarOutlined, DownloadOutlined, MessageOutlined, MoreOutlined, PaperClipOutlined, SearchOutlined } from "@ant-design/icons"
import { Button, Dropdown, Input, Progress, Spin, Table, Tooltip, Typography } from "antd"
import { useEffect, useState } from "react"
import type { ColumnsType } from "antd/es/table"
import RespondModal from "@/components/modals/RespondModal"

const { Title, Text } = Typography
// Define interfaces for our data
interface QueryItem {
    key: string
    id: string
    description: string
    status: "Responded" | "Yet to respond" | "Overdue" | null
    respond_date: string | null
    query_category: string
    urgency: {
        status: "Completed" | "Due in 14 days" | "Late by 4 days" | "Due today" | "Due tomorrow" | "Due this week"
        percent: number
        color: string
    }
    raisedDate: string
    dueDate: string
    manager: {
        initials: string
        name: string
        color: string
    }
    workpaper: {
        code: string
        fullName: string
    }
    client: string
    hasAttachments: boolean
    category: "active" | "completed" | "dueToday" | "dueTomorrow" | "dueThisWeek" | "overdue"
}
// interface ClientItem {
//     name: string
//     notifications: number
//     alerts: number
// }
const mockQueries: QueryItem[] = [
    // Active Queries - 12 total
    {
        key: "1",
        id: "Q-2001",
        description: "Please provide the bank statements for January 2024",
        status: "Responded",
        respond_date: "Apr 12, 2025",
        query_category: "Bank Reconciliation",
        urgency: {
            status: "Completed",
            percent: 100,
            color: "#52C41A",
        },
        raisedDate: "Apr 5, 2025",
        dueDate: "Apr 15, 2025",
        manager: {
            initials: "SJ",
            name: "Sarah Johnson",
            color: "#1890FF",
        },
        workpaper: {
            code: "BRC",
            fullName: "Bank Statements",
        },
        client: "Smith Enterprises",
        hasAttachments: true,
        category: "active",
    },
    {
        key: "2",
        id: "Q-2002",
        description: "Confirm the total revenue amount of $98,750 for January 2024",
        status: "Yet to respond",
        respond_date: null,
        query_category: "Vehicle Expenses",
        urgency: {
            status: "Due in 14 days",
            percent: 70,
            color: "#52C41A",
        },
        raisedDate: "Apr 8, 2025",
        dueDate: "Apr 22, 2025",
        manager: {
            initials: "MC",
            name: "Michael Chen",
            color: "#722ED1",
        },
        workpaper: {
            code: "EXP",
            fullName: "Vehicle Expenses",
        },
        client: "Johnson Consulting",
        hasAttachments: false,
        category: "active",
    },
    {
        key: "3",
        id: "Q-2003",
        description: "Please explain the increase in marketing expenses for January 2024",
        status: "Yet to respond",
        respond_date: null,
        query_category: "Property Manager Statement",
        urgency: {
            status: "Late by 4 days",
            percent: 30,
            color: "#F5222D",
        },
        raisedDate: "Apr 6, 2025",
        dueDate: "Apr 20, 2025",
        manager: {
            initials: "JL",
            name: "Jennifer Lee",
            color: "#13C2C2",
        },
        workpaper: {
            code: "RES",
            fullName: "Property Manager Statement",
        },
        client: "Brown Retail Group",
        hasAttachments: true,
        category: "active",
    },
    {
        key: "4",
        id: "Q-2004",
        description: "Provide details on the new equipment purchase of $12,500",
        status: null,
        respond_date: null,
        query_category: "Bank Reconciliation",
        urgency: {
            status: "Due today",
            percent: 40,
            color: "#FAAD14",
        },
        raisedDate: "Apr 10, 2025",
        dueDate: "Apr 17, 2025",
        manager: {
            initials: "SJ",
            name: "Sarah Johnson",
            color: "#1890FF",
        },
        workpaper: {
            code: "BRC",
            fullName: "Bank Reconciliation",
        },
        client: "Smith Enterprises",
        hasAttachments: false,
        category: "active",
    },
    {
        key: "5",
        id: "Q-2005",
        description: "Confirm payroll tax calculations for Q1 2024",
        status: null,
        respond_date: null,
        query_category: "Wages Reconciliation",
        urgency: {
            status: "Due tomorrow",
            percent: 50,
            color: "#FAAD14",
        },
        raisedDate: "Apr 7, 2025",
        dueDate: "Apr 21, 2025",
        manager: {
            initials: "MC",
            name: "Michael Chen",
            color: "#722ED1",
        },
        workpaper: {
            code: "WRC",
            fullName: "Wages Reconciliation",
        },
        client: "Williams Manufacturing",
        hasAttachments: true,
        category: "active",
    },
    {
        key: "6",
        id: "Q-2006",
        description: "Provide supporting documentation for travel expenses in February",
        status: null,
        respond_date: null,
        query_category: "Accounts Payable",
        urgency: {
            status: "Due this week",
            percent: 60,
            color: "#FAAD14",
        },
        raisedDate: "Apr 9, 2025",
        dueDate: "Apr 24, 2025",
        manager: {
            initials: "JL",
            name: "Jennifer Lee",
            color: "#13C2C2",
        },
        workpaper: {
            code: "ACP",
            fullName: "Accounts Payable",
        },
        client: "Davis Healthcare",
        hasAttachments: false,
        category: "active",
    },
    {
        key: "7",
        id: "Q-2007",
        description: "Explain variance in utility expenses compared to previous quarter",
        status: null,
        respond_date: null,
        query_category: "GST Period Variance",
        urgency: {
            status: "Due this week",
            percent: 55,
            color: "#FAAD14",
        },
        raisedDate: "Apr 4, 2025",
        dueDate: "Apr 20, 2025",
        manager: {
            initials: "SJ",
            name: "Sarah Johnson",
            color: "#1890FF",
        },
        workpaper: {
            code: "GPV",
            fullName: "GST Period Variance",
        },
        client: "Wilson Legal Services",
        hasAttachments: true,
        category: "active",
    },
    {
        key: "8",
        id: "Q-2008",
        description: "Provide details on the new client acquisition costs",
        status: null,
        respond_date: null,
        query_category: "Loan",
        urgency: {
            status: "Due this week",
            percent: 65,
            color: "#FAAD14",
        },
        raisedDate: "Apr 3, 2025",
        dueDate: "Apr 19, 2025",
        manager: {
            initials: "MC",
            name: "Michael Chen",
            color: "#722ED1",
        },
        workpaper: {
            code: "TLN",
            fullName: "Loan",
        },
        client: "Taylor Financial",
        hasAttachments: false,
        category: "active",
    },
    {
        key: "9",
        id: "Q-2009",
        description: "Confirm depreciation calculations for new assets",
        status: null,
        respond_date: null,
        query_category: "Accounts Receivable",
        urgency: {
            status: "Due this week",
            percent: 45,
            color: "#FAAD14",
        },
        raisedDate: "Apr 2, 2025",
        dueDate: "Apr 18, 2025",
        manager: {
            initials: "JL",
            name: "Jennifer Lee",
            color: "#13C2C2",
        },
        workpaper: {
            code: "ACR",
            fullName: "Accounts Receivable",
        },
        client: "Anderson Tech",
        hasAttachments: true,
        category: "active",
    },
    {
        key: "10",
        id: "Q-2010",
        description: "Provide explanation for the increase in bad debt provisions",
        status: "Overdue",
        respond_date: null,
        query_category: "Accounts Payable",
        urgency: {
            status: "Late by 4 days",
            percent: 20,
            color: "#F5222D",
        },
        raisedDate: "Apr 1, 2025",
        dueDate: "Apr 16, 2025",
        manager: {
            initials: "SJ",
            name: "Sarah Johnson",
            color: "#1890FF",
        },
        workpaper: {
            code: "ACP",
            fullName: "Accounts Payable",
        },
        client: "Smith Enterprises",
        hasAttachments: false,
        category: "active",
    },
    {
        key: "11",
        id: "Q-2011",
        description: "Confirm GST calculations for March 2024",
        status: "Overdue",
        respond_date: null,
        query_category: "GST Reconciliation",
        urgency: {
            status: "Late by 4 days",
            percent: 15,
            color: "#F5222D",
        },
        raisedDate: "Apr 2, 2025",
        dueDate: "Apr 17, 2025",
        manager: {
            initials: "MC",
            name: "Michael Chen",
            color: "#722ED1",
        },
        workpaper: {
            code: "GRC",
            fullName: "GST Reconciliation",
        },
        client: "Johnson Consulting",
        hasAttachments: true,
        category: "active",
    },
    {
        key: "12",
        id: "Q-2012",
        description: "Provide supporting documentation for R&D tax credit claim",
        status: "Overdue",
        respond_date: null,
        query_category: "Bank Reconciliation",
        urgency: {
            status: "Late by 4 days",
            percent: 10,
            color: "#F5222D",
        },
        raisedDate: "Apr 5, 2025",
        dueDate: "Apr 19, 2025",
        manager: {
            initials: "JL",
            name: "Jennifer Lee",
            color: "#13C2C2",
        },
        workpaper: {
            code: "BRC",
            fullName: "Bank Reconciliation",
        },
        client: "Brown Retail Group",
        hasAttachments: false,
        category: "active",
    },

    // Completed Queries - 3 total
    {
        key: "13",
        id: "Q-1001",
        description: "Provide January bank statements for reconciliation",
        status: "Responded",
        respond_date: "Apr 14, 2025",
        query_category: "Home Office",
        urgency: {
            status: "Completed",
            percent: 100,
            color: "#52C41A",
        },
        raisedDate: "Apr 3, 2025",
        dueDate: "Apr 13, 2025",
        manager: {
            initials: "SJ",
            name: "Sarah Johnson",
            color: "#1890FF",
        },
        workpaper: {
            code: "BRC",
            fullName: "Bank Reconciliation",
        },
        client: "Smith Enterprises",
        hasAttachments: true,
        category: "completed",
    },
    {
        key: "14",
        id: "Q-1002",
        description: "Confirm payroll figures for December 2024",
        status: "Responded",
        respond_date: "Apr 11, 2025",
        query_category: "Invoices",
        urgency: {
            status: "Completed",
            percent: 100,
            color: "#52C41A",
        },
        raisedDate: "Apr 1, 2025",
        dueDate: "Apr 10, 2025",
        manager: {
            initials: "MC",
            name: "Michael Chen",
            color: "#722ED1",
        },
        workpaper: {
            code: "HOM",
            fullName: "Home Office",
        },
        client: "Johnson Consulting",
        hasAttachments: false,
        category: "completed",
    },
    {
        key: "15",
        id: "Q-1003",
        description: "Provide details on new equipment purchase",
        status: "Responded",
        respond_date: "Apr 18, 2025",
        query_category: "Accounts Payable",
        urgency: {
            status: "Completed",
            percent: 100,
            color: "#52C41A",
        },
        raisedDate: "Apr 5, 2025",
        dueDate: "Apr 17, 2025",
        manager: {
            initials: "JL",
            name: "Jennifer Lee",
            color: "#13C2C2",
        },
        workpaper: {
            code: "ACP",
            fullName: "Accounts Payable",
        },
        client: "Williams Manufacturing",
        hasAttachments: true,
        category: "completed",
    },
];
// Calculate counts for each category
const getQueryCounts = (queries: QueryItem[]) => {
    const active = queries.filter((q) => q.category === "active").length
    const completed = queries.filter((q) => q.category === "completed").length
    const dueToday = queries.filter((q) => q.urgency.status === "Due today").length
    const dueTomorrow = queries.filter((q) => q.urgency.status === "Due tomorrow").length
    const dueThisWeek = queries.filter((q) => q.urgency.status === "Due this week").length
    const overdue = queries.filter((q) => q.status === "Overdue").length
    const responded = queries.filter((q) => q.status === "Responded").length
    const yetToRespond = queries.filter((q) => q.status === "Yet to respond").length

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
const QueryHub = () => {
    const [queries, setQueries] = useState<QueryItem[]>([])
    const [selectedQueries, setSelectedQueries] = useState<QueryItem[]>([])
    const [currentQueryIndex, setCurrentQueryIndex] = useState(0)
    const [respondModalVisible, setRespondModalVisible] = useState(false)
    const [activeTab, setActiveTab] = useState("active")

    const [loading, setLoading] = useState(true)
    const user_control = JSON.parse(sessionStorage.getItem("user") || "{}")
    const [queryCounts, setQueryCounts] = useState({
        active: 0,
        completed: 0,
        dueToday: 0,
        dueTomorrow: 0,
        dueThisWeek: 0,
        overdue: 0,
        total: 0,
        responded: 0,
        yetToRespond: 0
    })
    const summaryStats = [
        { label: "Total", count: queryCounts.total, color: "#8C8C8C", bgColor: "#F5F5F5" },
        { label: "Responded", count: queryCounts.responded, color: "#52C41A", bgColor: "#F6FFED" },
        { label: "Yet to respond", count: queryCounts.yetToRespond, color: "#FAAD14", bgColor: "#FFF7E6" },
        { label: "Overdue", count: queryCounts.overdue, color: "#F5222D", bgColor: "#FFF1F0" },
    ]
    const queryTabs = [
        { key: "active", label: `Total Queries (${queryCounts.active})` },
        { key: "completed", label: `Pending (${queryCounts.completed})` },
        // { key: "dueToday", label: `Due Today (${queryCounts.dueToday})` },
        // { key: "dueTomorrow", label: `Due Tomorrow (${queryCounts.dueTomorrow})` },
        // { key: "dueThisWeek", label: `Due This Week (${queryCounts.dueThisWeek})` },
        { key: "overdue", label: `Overdue (${queryCounts.overdue})` },
    ]
    const columns: ColumnsType<QueryItem> = [
        {
            title: "S. No",
            dataIndex: "key",
            key: "key",
            width: 50,
            render: (text) => (
                <span className="text-sm text-gray-700" style={{ fontSize: "0.8rem" }}>
                    {text}
                </span>
            ),
        },
        // {
        //     title: "Category",
        //     key: "query_category",
        //     width: 240,
        //     render: (_, record) => (
        //         <span className="text-sm text-gray-700" style={{ fontSize: "0.8rem" }}>
        //             {record.query_category}
        //         </span>
        //         // <div className="flex flex-col">
        //         //   <Progress
        //         //     percent={record.urgency.percent}
        //         //     size="small"
        //         //     showInfo={false}
        //         //     strokeColor={record.urgency.color}
        //         //     style={{ marginBottom: "4px" }}
        //         //   />
        //         //   <span style={{ fontSize: "0.8rem", color: record.urgency.color }}>{record.urgency.status}</span>
        //         // </div>
        //     ),
        // },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            width: 450,
            render: (text) => (
                <span className="text-sm text-gray-700" style={{ fontSize: "0.8rem" }}>
                    {text}
                </span>
            ),
        },
        {
            title: "Submitted",
            key: "raisedDate",
            width: 180,
            render: (_, record) => (
                <div className="flex items-center">
                    <CalendarOutlined className="mr-1 text-gray-400" />
                    <span className="text-sm text-gray-700" style={{ fontSize: "0.8rem" }}>
                        {record.raisedDate}
                    </span>
                </div>
            ),
        },
        {
            title: "Deadline",
            key: "dueDate",
            width: 180,
            render: (_, record) => (
                <div className="flex items-center">
                    <CalendarOutlined className="mr-1 text-gray-400" />
                    <span className="text-sm text-gray-700" style={{ fontSize: "0.8rem" }}>
                        {record.dueDate}
                    </span>
                </div>
            ),
        },

        // {
        //     title: "Response",
        //     key: "status",
        //     width: 180,
        //     render: (_, record) => {
        //         if (record.status === "Responded") {
        //             return (<>
        //                 <CalendarOutlined className="mr-1 text-gray-400" /> <span style={{ fontSize: "0.75rem" }}>{record.respond_date}</span></>)
        //         }

        //         if (record.status === "Yet to respond") {
        //             return null
        //         }

        //         if (record.status === "Overdue") {
        //             return null
        //         }
        //         return null
        //     },
        // },
        {
            title: "ACCT. Manager",
            key: "manager",
            width: 200,
            hidden: user_control?.role === "client",
            render: (_, record) => (
                <div className="flex items-center">
                    {/* <div
                className="flex items-center justify-center w-6 h-6 rounded-full mr-2 text-white text-xs"
                style={{ backgroundColor: record.manager.color }}
              >
                {record.manager.initials}
              </div> */}
                    <span className="text-sm text-gray-700" style={{ fontSize: "0.8rem" }}>
                        {record.manager.name}
                    </span>
                </div>
            ),
        },
        // {
        //   title: "Workpaper",
        //   key: "workpaper",
        //   width: 80,
        //   render: (_, record) => (
        //     <Tooltip title={record.workpaper.fullName}>
        //       <div className="flex items-center">
        //         <FileTextOutlined className="mr-1 text-blue-500" />
        //         <span className="text-sm text-blue-500" style={{ fontSize: "0.8rem" }}>
        //           {record.workpaper.code}
        //         </span>
        //       </div>
        //     </Tooltip>
        //   ),
        // },
        {
            title: "Actions",
            key: "actions",
            width: 150,
            render: (_, record) => (
                <div className="flex flex-col items-center">
                    <div className="flex items-center justify-start space-2">
                        {/* <Tooltip title="Send Reminder">
                <Button type="text" icon={<BellOutlined />} size="small" />
              </Tooltip> */}
                        {/* <Tooltip title="View Query">
                <Button type="text" icon={<EyeOutlined />} size="small" />
              </Tooltip> */}
                        {/* <Tooltip title="Respond">
                <Button type="text" icon={<MessageOutlined />} size="small" />
              </Tooltip> */}
                        {/* {record.hasAttachments && (
                            <Tooltip title="View Attachments">
                                <Button type="text" icon={<PaperClipOutlined />} size="small" />
                            </Tooltip>
                        )}
                        {
                            record.status === "Responded" && (
                                <Tooltip title="View Response">
                                    <Button type="text" icon={<MessageOutlined />} size="small" />
                                </Tooltip>
                            )
                        }
                        <Tooltip title="More Actions">
                            <Dropdown menu={{ items: clientMenuItems }} overlayStyle={{ fontSize: "0.8rem" }} placement="bottomRight">
                                <Button type="text" icon={<MoreOutlined />} size="small" />
                            </Dropdown>
                        </Tooltip> */}
                    </div>
                    {/* <div style={{ height: "100%", width: "100%" }}>
                        <Tooltip title={<span style={{ fontSize: "0.8rem", color: record.urgency.color }}>{record.urgency.status}</span>}>
                            <Progress
                                style={{ height: "0.3rem" }}
                                percent={record.urgency.percent}
                                size="small"
                                showInfo={false}
                                strokeColor={record.urgency.color}
                            />
                        </Tooltip>
                    </div> */}
                </div>
            ),
        },
    ]
    const clientMenuItems = [
        {
            key: "view_details",
            label: "View Details",
            icon: <BarChartOutlined />
        },
        {
            key: "download_files",
            label: "Download Files",
            icon: <DownloadOutlined />
        },
    ]
    useEffect(() => {
        fetchQueries()
    }, [])

    const fetchQueries = async () => {
        setLoading(true)
        // Simulate API call
        setTimeout(() => {
            setQueries([...mockQueries])
            setQueryCounts(getQueryCounts(mockQueries))
            setLoading(false)
        }, 800)
    }
    const handleRespondToQueries = () => {
        // Filter queries that need response
        // const queriesToRespond = getFilteredQueries().filter((q) => q.status === "Yet to respond" || q.status === "Overdue")
        const queriesToRespond = user_control.role === "client" ? getFilteredQueries().filter((q) => q.status !== "Responded") : getFilteredQueries()
        setSelectedQueries(queriesToRespond)
        if (queriesToRespond.length > 0) {
            setCurrentQueryIndex(0)
            setRespondModalVisible(true)
        }
    }
    const handleTabChange = (key: string) => {
        setActiveTab(key)
    }
    const getFilteredQueries = () => {
        switch (activeTab) {
            case "active":
                return queries.filter((q) => q.category === "active")
            case "completed":
                return queries.filter((q) => q.category === "completed")
            case "dueToday":
                return queries.filter((q) => q.urgency.status === "Due today")
            case "dueTomorrow":
                return queries.filter((q) => q.urgency.status === "Due tomorrow")
            case "dueThisWeek":
                return queries.filter((q) => q.urgency.status === "Due this week")
            case "overdue":
                return queries.filter((q) => q.status === "Overdue")
            default:
                return queries
        }
    }
    const handleSubmitResponse = (values: any) => {
        console.log("Response submitted:", values)
        // Here you would typically send the response to your backend
        // Move to next query or close modal if this was the last one
        if (currentQueryIndex < selectedQueries.length - 1) {
            setCurrentQueryIndex(currentQueryIndex + 1)
        } else {
            setRespondModalVisible(false)
        }
    }
    const handlePreviousQuery = () => {
        if (currentQueryIndex > 0) {
            setCurrentQueryIndex(currentQueryIndex - 1)
        }
    }
    const handleNextQuery = () => {
        if (currentQueryIndex < selectedQueries.length - 1) {
            setCurrentQueryIndex(currentQueryIndex + 1)
        }
    }
    return (
        <div className="bg-white rounded-lg shadow-sm p-6 dark:bg-gray-900 dark:text-white">
            <div className="flex items-center justify-between mb-2">
                {/* <div className="mb-2">
                    <div className="flex items-center justify-between">
                        <Title level={3} style={{ fontSize: "1rem", marginBottom: "4px" }}>
                            Query Hub
                        </Title>
                        <div className="flex flex-wrap gap-3 mb-2" style={{ padding: "0 1rem" }}>
                            {summaryStats.map((stat, index) => (
                                <div
                                    key={index}
                                    className="flex items-center rounded-full px-1"
                                    style={{ backgroundColor: stat.bgColor }}
                                >
                                    <span className="text-sm font-small mr-1" style={{ color: stat.color, fontSize: "smaller" }}>
                                        {stat.label}:
                                    </span>
                                    <span className="text-sm font-small" style={{ color: stat.color, fontSize: "smaller" }}>
                                        {stat.count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Text style={{ fontSize: "smaller" }} className="text-gray-500">
                        View and respond to queries from your CA firm
                    </Text>
                </div> */}
            </div>

            <div className="flex justify-between mb-2">
                <Input
                    placeholder={`Search by Query ID, Description ${user_control?.role === "client" ? "" : ", or Manager"}...`}
                    prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                    className="rounded max-w-xl"
                    size="middle"
                    style={{ width: "380px" }}
                />
                <div className="flex gap-3">
                    <Button
                        onClick={() => handleRespondToQueries()}
                        type="primary"
                        className="flex items-center"
                        style={{ backgroundColor: "#0F5B6D", borderColor: "#0F5B6D", borderRadius: "4px" }}
                    >
                        {user_control?.role === "client" ? "Respond to Queries" : "View Responses"} ({queryCounts.yetToRespond})
                    </Button>
                </div>
            </div>
            {/* Tabs */}
            <div className="border-b border-gray-200">
                <div className="flex">
                    {queryTabs.map((item) => (
                        <div
                            key={item.key}
                            style={{
                                color: activeTab === item.key ? "#0F5B6D" : "#333333f5",
                                borderBottom: activeTab === item.key ? " 2px solid #0F5B6D" : "",
                            }}
                            className={`px-4 py-2 cursor-pointer text-sm font-medium `}
                            onClick={() => handleTabChange(item.key)}
                        >
                            {item.label}
                        </div>
                    ))}
                </div>
            </div>

            {/* Table */}
            <Spin spinning={loading}>
                <Table
                    columns={columns}
                    dataSource={getFilteredQueries()}
                    pagination={{ pageSize: 10 }}
                    rowKey="key"
                    className="query-table dark:bg-gray-900 dark:text-white"
                    style={{ overflowX: "auto" }}
                />
            </Spin>
            {selectedQueries.length > 0 && (
                <RespondModal
                    visible={respondModalVisible}
                    onClose={() => setRespondModalVisible(false)}
                    onSubmit={handleSubmitResponse}
                    query={{
                        id: selectedQueries[currentQueryIndex]?.id,
                        description: selectedQueries[currentQueryIndex]?.description,
                        raisedDate: selectedQueries[currentQueryIndex]?.raisedDate,
                        dueDate: selectedQueries[currentQueryIndex]?.dueDate,
                        status: selectedQueries[currentQueryIndex]?.status || "",
                        urgency: {
                            status: selectedQueries[currentQueryIndex]?.urgency?.status,
                            color: selectedQueries[currentQueryIndex]?.urgency?.color,
                        },
                        index: currentQueryIndex + 1,
                        total: selectedQueries.length,
                    }}
                    onPrevious={handlePreviousQuery}
                    onNext={handleNextQuery}
                />
            )}{" "}
        </div>
    )
}

export default QueryHub

