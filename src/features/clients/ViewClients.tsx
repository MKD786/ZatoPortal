"use client"

import { useState, useEffect } from "react"
import { Input, Typography, Layout, Tooltip, Badge, Tabs, Switch } from "antd"
import {
  SearchOutlined,
  UserOutlined,
  FileTextOutlined,
  MessageOutlined,
  FormOutlined,
  HistoryOutlined,
  SettingOutlined,
  FontSizeOutlined
} from "@ant-design/icons"
import ReminderHistory from "../reminders/ReminderHistory"
import Settings from "../settings/Settings"
import ClientQuestionaire from "./ClientQuestionaire"
import JobsManagement from "../Jobs/JobsManagement"
import QueryHub from "./QueryHub"
// import { RulerIcon } from "lucide-react"
// import AddRule from "../add_rule/AddRule"
import QueryBuilder from "../query_builder/QueryBuilder"
import { useMemo } from "react"
import QueryHubNew from "./QueryHubNew"

const { Text } = Typography
const { Sider, Content } = Layout
const { TabPane } = Tabs


interface ClientItem {
  name: string
  notifications: number
  alerts: number
}


const mockClients: ClientItem[] = [
  { name: "Smith Enterprises", notifications: 3, alerts: 1 },
  { name: "Johnson Consulting", notifications: 2, alerts: 0 },
  { name: "Williams Manufacturing", notifications: 0, alerts: 0 },
  { name: "Brown Retail Group", notifications: 2, alerts: 1 },
  { name: "Davis Healthcare", notifications: 0, alerts: 0 },
  { name: "Wilson Legal Services", notifications: 0, alerts: 0 },
  { name: "Taylor Financial", notifications: 0, alerts: 0 },
  { name: "Anderson Tech", notifications: 0, alerts: 0 },
]


const ViewClients = () => {
  const user_control = JSON.parse(sessionStorage.getItem("user") || "{}")
  const [settingsModalVisible, setSettingsModalVisible] = useState(true)
  
  const showSettingsModal = () => {
    setSettingsModalVisible(true)
  }
  const hideSettingsModal = () => {
    setSettingsModalVisible(false)
  }

  // const [queries, setQueries] = useState<QueryItem[]>([])
  // const [loading, setLoading] = useState(true)
  // const [activeTab, setActiveTab] = useState("active")
  const [activeMainTab, setActiveMainTab] = useState(user_control?.role === "client" ? "questionnaire" : "queryhub")
  const [selectedClient, setSelectedClient] = useState("Smith Enterprises")
  const [showOnlyPending, setShowOnlyPending] = useState(false)
  // const [respondModalVisible, setRespondModalVisible] = useState(false)
  // const [currentQueryIndex, setCurrentQueryIndex] = useState(0)
  // const [selectedQueries, setSelectedQueries] = useState<QueryItem[]>([])
  // const [queryCounts, setQueryCounts] = useState({
  //   active: 0,
  //   completed: 0,
  //   dueToday: 0,
  //   dueTomorrow: 0,
  //   dueThisWeek: 0,
  //   overdue: 0,
  //   total: 0,
  //   responded: 0,
  //   yetToRespond: 0
  // })
  useEffect(() => {
    fetchQueries()
    
  }, [])

  const fetchQueries = async () => {
    // setLoading(true)
    // Simulate API call
    setTimeout(() => {
      // setQueries([...mockQueries])
      // setQueryCounts(getQueryCounts(mockQueries))
      // setLoading(false)
    }, 800)
  }

  // const handleTabChange = (key: string) => {
  //   setActiveTab(key)
  // }

  const handleMainTabChange = (key: string) => {
    setActiveMainTab(key)

  }

  const handleClientClick = (clientName: string) => {
    setSelectedClient(clientName)
  }
  const [selectedCompany, setSelectedCompany] = useState<string>("")

  // const handleRespondToQueries = () => {
  //   // Filter queries that need response
  //   // const queriesToRespond = getFilteredQueries().filter((q) => q.status === "Yet to respond" || q.status === "Overdue")
  //   const queriesToRespond = user_control.role === "client" ? getFilteredQueries().filter((q) => q.status !== "Responded") : getFilteredQueries()
  //   setSelectedQueries(queriesToRespond)
  //   if (queriesToRespond.length > 0) {
  //     setCurrentQueryIndex(0)
  //     setRespondModalVisible(true)
  //   }
  // }

  // const handlePreviousQuery = () => {
  //   if (currentQueryIndex > 0) {
  //     setCurrentQueryIndex(currentQueryIndex - 1)
  //   }
  // }

  // const handleNextQuery = () => {
  //   if (currentQueryIndex < selectedQueries.length - 1) {
  //     setCurrentQueryIndex(currentQueryIndex + 1)
  //   }
  // }

  // const handleSubmitResponse = (values: any) => {
  //   console.log("Response submitted:", values)
  //   // Here you would typically send the response to your backend
  //   // Move to next query or close modal if this was the last one
  //   if (currentQueryIndex < selectedQueries.length - 1) {
  //     setCurrentQueryIndex(currentQueryIndex + 1)
  //   } else {
  //     setRespondModalVisible(false)
  //   }
  // }
  // Filter queries based on active tab
  // const getFilteredQueries = () => {
  //   switch (activeTab) {
  //     case "active":
  //       return queries.filter((q) => q.category === "active")
  //     case "completed":
  //       return queries.filter((q) => q.category === "completed")
  //     case "dueToday":
  //       return queries.filter((q) => q.urgency.status === "Due today")
  //     case "dueTomorrow":
  //       return queries.filter((q) => q.urgency.status === "Due tomorrow")
  //     case "dueThisWeek":
  //       return queries.filter((q) => q.urgency.status === "Due this week")
  //     case "overdue":
  //       return queries.filter((q) => q.status === "Overdue")
  //     default:
  //       return queries
  //   }
  // }

  // Table columns configuration
  // const columns: ColumnsType<QueryItem> = [
  //   {
  //     title: "Query ID",
  //     dataIndex: "id",
  //     key: "id",
  //     width: 140,
  //     render: (text) => (
  //       <span className="text-sm text-gray-700" style={{ fontSize: "0.8rem" }}>
  //         {text}
  //       </span>
  //     ),
  //   },
  //   {
  //     title: "Category",
  //     key: "query_category",
  //     width: 240,
  //     render: (_, record) => (
  //       <span className="text-sm text-gray-700" style={{ fontSize: "0.8rem" }}>
  //         {record.query_category}
  //       </span>
  //       // <div className="flex flex-col">
  //       //   <Progress
  //       //     percent={record.urgency.percent}
  //       //     size="small"
  //       //     showInfo={false}
  //       //     strokeColor={record.urgency.color}
  //       //     style={{ marginBottom: "4px" }}
  //       //   />
  //       //   <span style={{ fontSize: "0.8rem", color: record.urgency.color }}>{record.urgency.status}</span>
  //       // </div>
  //     ),
  //   },
  //   {
  //     title: "Description",
  //     dataIndex: "description",
  //     key: "description",
  //     width: 450,
  //     render: (text) => (
  //       <span className="text-sm text-gray-700" style={{ fontSize: "0.8rem" }}>
  //         {text}
  //       </span>
  //     ),
  //   },
  //   {
  //     title: "Raised On",
  //     key: "raisedDate",
  //     width: 180,
  //     render: (_, record) => (
  //       <div className="flex items-center">
  //         <CalendarOutlined className="mr-1 text-gray-400" />
  //         <span className="text-sm text-gray-700" style={{ fontSize: "0.8rem" }}>
  //           {record.raisedDate}
  //         </span>
  //       </div>
  //     ),
  //   },
  //   {
  //     title: "Deadline",
  //     key: "dueDate",
  //     width: 180,
  //     render: (_, record) => (
  //       <div className="flex items-center">
  //         <CalendarOutlined className="mr-1 text-gray-400" />
  //         <span className="text-sm text-gray-700" style={{ fontSize: "0.8rem" }}>
  //           {record.dueDate}
  //         </span>
  //       </div>
  //     ),
  //   },

  //   {
  //     title: "Response",
  //     key: "status",
  //     width: 180,
  //     render: (_, record) => {
  //       if (record.status === "Responded") {
  //         return (<>
  //           <CalendarOutlined className="mr-1 text-gray-400" /> <span style={{ fontSize: "0.75rem" }}>{record.respond_date}</span></>)
  //       }

  //       if (record.status === "Yet to respond") {
  //         return null
  //       }

  //       if (record.status === "Overdue") {
  //         return null
  //       }
  //       return null
  //     },
  //   },
  //   {
  //     title: "ACCT. Manager",
  //     key: "manager",
  //     width: 200,
  //     hidden: user_control?.role === "client",
  //     render: (_, record) => (
  //       <div className="flex items-center">
  //         {/* <div
  //           className="flex items-center justify-center w-6 h-6 rounded-full mr-2 text-white text-xs"
  //           style={{ backgroundColor: record.manager.color }}
  //         >
  //           {record.manager.initials}
  //         </div> */}
  //         <span className="text-sm text-gray-700" style={{ fontSize: "0.8rem" }}>
  //           {record.manager.name}
  //         </span>
  //       </div>
  //     ),
  //   },
  //   // {
  //   //   title: "Workpaper",
  //   //   key: "workpaper",
  //   //   width: 80,
  //   //   render: (_, record) => (
  //   //     <Tooltip title={record.workpaper.fullName}>
  //   //       <div className="flex items-center">
  //   //         <FileTextOutlined className="mr-1 text-blue-500" />
  //   //         <span className="text-sm text-blue-500" style={{ fontSize: "0.8rem" }}>
  //   //           {record.workpaper.code}
  //   //         </span>
  //   //       </div>
  //   //     </Tooltip>
  //   //   ),
  //   // },
  //   {
  //     title: "Actions",
  //     key: "actions",
  //     width: 150,
  //     render: (_, record) => (
  //       <div className="flex flex-col items-center">
  //         <div className="flex items-center justify-start space-2">
  //           {/* <Tooltip title="Send Reminder">
  //           <Button type="text" icon={<BellOutlined />} size="small" />
  //         </Tooltip> */}
  //           {/* <Tooltip title="View Query">
  //           <Button type="text" icon={<EyeOutlined />} size="small" />
  //         </Tooltip> */}
  //           {/* <Tooltip title="Respond">
  //           <Button type="text" icon={<MessageOutlined />} size="small" />
  //         </Tooltip> */}
  //           {record.hasAttachments && (
  //             <Tooltip title="View Attachments">
  //               <Button type="text" icon={<PaperClipOutlined />} size="small" />
  //             </Tooltip>
  //           )}
  //           {
  //             record.status === "Responded" && (
  //               <Tooltip title="View Response">
  //                 <Button type="text" icon={<MessageOutlined />} size="small" />
  //               </Tooltip>
  //             )
  //           }
  //           <Tooltip title="More Actions">
  //             <Dropdown menu={{ items: clientMenuItems }} overlayStyle={{ fontSize: "0.8rem" }} placement="bottomRight">
  //               <Button type="text" icon={<MoreOutlined />} size="small" />
  //             </Dropdown>
  //           </Tooltip>
  //         </div>
  //         <div style={{ height: "100%", width: "100%" }}>
  //           <Tooltip title={<span style={{ fontSize: "0.8rem", color: record.urgency.color }}>{record.urgency.status}</span>}>
  //             <Progress
  //               style={{ height: "0.3rem" }}
  //               percent={record.urgency.percent}
  //               size="small"
  //               showInfo={false}
  //               strokeColor={record.urgency.color}
  //             />
  //           </Tooltip>
  //         </div>
  //       </div>
  //     ),
  //   },
  // ]

  // const clientMenuItems = [
  //   {
  //     key: "view_details",
  //     label: "View Details",
  //     icon: <BarChartOutlined />
  //   },
  //   {
  //     key: "download_files",
  //     label: "Download Files",
  //     icon: <DownloadOutlined />
  //   },
  // ]

  // Main tabs for top navigation
  
  
  
  
  const mainTabs = [
    {
      key: "questionnaire",
      label: (
        <div className="flex items-center">
          <FormOutlined className="mr-2" />
          Questionnaire
        </div>
      ),
    },
    {
      key: "query-builder",
      label: (
        <div className="flex items-center">
          <FormOutlined className="mr-2" />
          Query Builder
        </div>
      ),
      hidden: user_control?.role === "client",
    },
    {
      key: "queryhub",
      label: (
        <div className="flex items-center">
          <MessageOutlined className="mr-2" />
          Queries
        </div>
      ),
    },
    // {
    //   key: "jobs",
    //   label: (
    //     // <Link to={`/jobs`}>
    //     <div className="flex items-center">
    //       <FileTextOutlined className="mr-2" />
    //       Jobs
    //     </div>
    //     // </Link>
    //   ),
    //   hidden: user_control?.role !== "client",
    // },
    // {
    //   key: "results",
    //   label: (
    //     <div className="flex items-center">
    //       <BarChartOutlined className="mr-2" />
    //       Results
    //     </div>
    //   ),
    // },
    {
      key: "reminder-history",
      label: (
        <div className="flex items-center">
          <HistoryOutlined className="mr-2" />
          Reminder History
        </div>
      ),
      hidden: user_control?.role !== "client",
    },
    
    // {
    //   key: "settings",
    //   label: (
    //     <div className="flex items-center">
    //       <SettingOutlined className="mr-2" />
    //       Settings
    //     </div>
    //   ),
    //   hidden: user_control?.role !== "client",
    // },
  ]

  // Tab items for the query tabs
  // const queryTabs = [
  //   { key: "active", label: `Active Queries (${queryCounts.active})` },
  //   { key: "completed", label: `Completed (${queryCounts.completed})` },
  //   { key: "dueToday", label: `Due Today (${queryCounts.dueToday})` },
  //   { key: "dueTomorrow", label: `Due Tomorrow (${queryCounts.dueTomorrow})` },
  //   { key: "dueThisWeek", label: `Due This Week (${queryCounts.dueThisWeek})` },
  //   { key: "overdue", label: `Overdue (${queryCounts.overdue})` },
  // ]

  // Summary stats
  // const summaryStats = [
  //   { label: "Total", count: queryCounts.total, color: "#8C8C8C", bgColor: "#F5F5F5" },
  //   { label: "Responded", count: queryCounts.responded, color: "#52C41A", bgColor: "#F6FFED" },
  //   { label: "Yet to respond", count: queryCounts.yetToRespond, color: "#FAAD14", bgColor: "#FFF7E6" },
  //   { label: "Overdue", count: queryCounts.overdue, color: "#F5222D", bgColor: "#FFF1F0" },
  // ]
  
  const filteredClients = showOnlyPending ? mockClients.filter((client) => client.notifications > 0) : mockClients
  const visibleTabs = useMemo(() => {
    return mainTabs.filter((tab) => !tab.hidden)
  }, [user_control?.role])
  const handleCompanySelect = (company: string) => {
    setSelectedCompany(company)
    // Store the selection for persistence
    localStorage.setItem("selectedCompany", company)
  }
  return (
    <Layout className="h-full bg-white dark:bg-gray-900 dark:text-white">
      {/* Top Navigation Tabs */}
      <div className="border-b border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 client-admin-tabs">
        <div className="flex items-center justify-between  mx-auto">
          <Tabs activeKey={activeMainTab} onChange={handleMainTabChange} className="pl-4 flex-1 mb-0">
            {visibleTabs.map((tab) => (
              <TabPane key={tab.hidden ? '' : tab.key} tab={tab.hidden ? '' : tab.label} />
            ))}
          </Tabs>
          {/* {user_control?.role === "client" && <Text className="text-gray-800 border-b pb-2">ACCT. Manager: Jane Smith</Text>} */}
          {/* <FontSizeOutlined /> */}
        </div>
      </div>

      {/* Main Layout */}
      <Layout className="h-full bg-white view-clients-content dark:bg-gray-900 dark:text-white position-relative">
        {/* Left sidebar */}
        {user_control?.role !== "client" && (
          <Sider
            width={220}
            theme="light"
            style={{
              borderRight: "1px solid #f0f0f0",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
              zIndex: 1,
              fontSize: "smaller",
            }}
          >
            <div className="p-4">
              <div className="flex items-center">
                <UserOutlined className="mr-2 text-gray-500" />
                <span className="text-sm font-medium mb-1">Clients</span>
              </div>

              <div className="flex items-center justify-between mb-2 space-x-2">
                <Input
                  placeholder="Search clients..."
                  prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                  className="rounded"
                  size="small"
                // onChange={(e) => {
                //   const filteredClients = mockClients.filter((client) => client.name.toLowerCase().includes(e.target.value.toLowerCase()));
                //   setShowOnlyPending(filteredClients.length > 0 ? filteredClients : []);
                // }}
                />
                <Tooltip title="Show only clients with queries yet to respond">
                  <Switch
                    checked={showOnlyPending}
                    onChange={() => setShowOnlyPending((prev) => !prev)}
                    // className="mr-2"
                    size="small"
                  />
                </Tooltip>
              </div>
              <div className="space-y-1 mt-4">
                {filteredClients.map((client) => (
                  <div
                    key={client.name}
                    className={`flex items-center p-2 rounded cursor-pointer hover:bg-gray-100 dark:bg-[#1e1e1e] dark:hover:bg-gray-700 ${selectedClient === client.name ? "bg-blue-50 border-l-4 border-blue-500 pl-1 dark:bg-blue dark:border-blue-500" : "pl-3 dark:bg-[#1e1e1e]"
                      }`}
                    onClick={() => handleClientClick(client.name)}
                  >
                    <UserOutlined className="mr-2 text-gray-500" />
                    <span className="flex-1">{client.name}</span>
                    <div className="flex items-center">
                      {client.notifications > 0 && (
                        <Badge
                          count={client.notifications}
                          size="small"
                          style={{ backgroundColor: "#ecdbda", color: "#f5222d", marginRight: "4px", border: "none" }}
                        />
                      )}
                      {/* {client.alerts > 0 && (
                        <Badge
                          count={<WarningOutlined style={{ color: "#FFA940", fontSize: "10px" }} />}
                          size="small"
                          style={{ backgroundColor: "#FFF7E6", border: "1px solid #FFD591" }}
                        />
                      )} */}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Sider>
        )}
        {/* Main content */}
        <Content className="bg-gray-50">
          {activeMainTab === "queryhub" || activeMainTab === "results" ? (
           
            <QueryHubNew/>
          ) : (activeMainTab === "questionnaire" ? <ClientQuestionaire />
            : activeMainTab === "reminder-history" ? <ReminderHistory />
              : activeMainTab === "jobs" ? <JobsManagement />
                : activeMainTab === "query-builder" ? <QueryBuilder />
                  :<ClientQuestionaire   /> )}
             

        </Content>       
      </Layout>
      {/* <Settings visible={settingsModalVisible} onCancel={hideSettingsModal} onSave={handleCompanySelect}  defaultCompany={selectedCompany}  /> */}
    </Layout>
  )
}

export default ViewClients
