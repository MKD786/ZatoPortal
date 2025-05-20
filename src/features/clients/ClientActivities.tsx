import { useState } from "react"
import { Input, Layout, Tooltip, Badge, Switch, Tabs } from "antd"
import { MenuUnfoldOutlined, MenuFoldOutlined, SearchOutlined, UserOutlined, QuestionCircleOutlined, TeamOutlined, HistoryOutlined } from "@ant-design/icons"
import { Content } from "antd/es/layout/layout"
import "./ClientActivities.scss"
import QueryBuilder from "../query_builder/QueryBuilder"
import QueryHubNew from "./QueryHubNew"
import ReminderHistory from "../reminders/ReminderHistory"
import ClientQuestionaire from "./ClientQuestionaire"

const { Sider } = Layout

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

interface NavItem {
  key: string
  label: string
  icon: React.ReactNode
  component: React.ReactNode
  hidden?: boolean
}

const ClientActivities = () => {
    const user_control = JSON.parse(sessionStorage.getItem("user") || "{}")
    const [selectedClient, setSelectedClient] = useState("Smith Enterprises")
    const [showOnlyPending, setShowOnlyPending] = useState(false)
    const [sideBarCollapsed, setSideBarCollapsed] = useState(true)
    const [activeTab, setActiveTab] = useState("query-builder")

    const handleClientClick = (clientName: string) => {
        setSelectedClient(clientName)
    }

    const filteredClients = showOnlyPending ? mockClients.filter((client) => client.notifications > 0) : mockClients

    const navItems: NavItem[] = [
        {
          key: "query-builder",
          label: "Query Builder",
          icon: <UserOutlined />,
          component: <QueryBuilder/>,
          hidden: user_control?.role === "client",
        },
        {
          key: "questionnaires",
          label: "Questionnaire",
          icon: <TeamOutlined />,
          component: <ClientQuestionaire/>,
          hidden: user_control?.role === "client",
        },
        {
          key: "query-management",
          label: "Queries",
          icon: <QuestionCircleOutlined/>,
          component: <QueryHubNew/>,
          hidden: user_control?.role === "client",
        },
        {
          key: "reminder-history",
          label: "Reminder History",
          icon: <HistoryOutlined />,
          component: <ReminderHistory />,
          hidden: user_control?.role === "client",
        },
    ]

    const filteredNavItems = navItems.filter(item => !item.hidden)
    const activeComponent = filteredNavItems.find(item => item.key === activeTab)?.component

    return (
        <Layout className="h-full bg-white view-clients-content dark:bg-gray-900 dark:text-white position-relative client-activities-main-div">
            {user_control?.role !== "client" && (
                <Sider className="" collapsed={sideBarCollapsed} width={220} theme="light" style={{ display: sideBarCollapsed === true ? "flex" : "none" }}>
                    <div className="p-4">
                        <div className="flex justify-between align-center items-center gap-2 border-b mb-2">
                            <div className="flex items-center">
                                <UserOutlined className="mr-2 text-gray-500" />
                                <span className="text-sm font-medium">Clients</span>
                            </div>
                            {sideBarCollapsed === true ? <Tooltip arrow={false} title="Collapse"><MenuFoldOutlined size={2.1} onClick={() => setSideBarCollapsed(!sideBarCollapsed)} /></Tooltip> : ''}
                        </div>
                        <div className="flex items-center justify-between mb-2 space-x-2">
                            <Input placeholder="Search clients..." prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />} className="rounded" size="small" />
                            <Tooltip arrow={false} title="Show only clients with queries yet to respond">
                                <Switch checked={showOnlyPending} onChange={() => setShowOnlyPending((prev) => !prev)} size="small" />
                            </Tooltip>
                        </div>
                        <div className="space-y-1 mt-4">
                            {filteredClients.map((client) => (
                                <div key={client.name} className={`flex items-center p-2 rounded cursor-pointer hover:bg-gray-100 dark:bg-[#1e1e1e] dark:hover:bg-gray-700 ${selectedClient === client.name ? "bg-blue-50 border-l-4 border-blue-500 pl-1 dark:bg-blue dark:border-blue-500" : "pl-3 dark:bg-[#1e1e1e]"}`} onClick={() => handleClientClick(client.name)}>
                                    <UserOutlined className="mr-2 text-gray-500" />
                                    <span className="flex-1">{client.name}</span>
                                    <div className="flex items-center">
                                        {client.notifications > 0 && <Badge count={client.notifications} size="small" style={{ backgroundColor: "#ecdbda", color: "#f5222d", marginRight: "4px", border: "none" }} />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Sider>
            )}
            <Content className="flex-1 overflow-y-auto">
                <div className={`bg-white dark:bg-gray-800 rounded-lg ${sideBarCollapsed === true ? "pl-2" : ""}`}>
                    {/* <div className="flex flex-row items-center justify-start gap-2">
                        {sideBarCollapsed === false ? <Tooltip arrow={false} title="Expand"><button onClick={() => setSideBarCollapsed(!sideBarCollapsed)}><MenuUnfoldOutlined size={2.1} /></button></Tooltip> : ''}
                        <h2 className="text-lg font-medium">Client Activities</h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">View and manage client activities here.</p> */}
                   <div className="flex flex-row w-full items-center justify-start gap-2 client-activities-tabs">
                    {sideBarCollapsed === false ? <Tooltip arrow={false} title="Expand"><MenuUnfoldOutlined size={2.1} onClick={() => setSideBarCollapsed(!sideBarCollapsed)} /></Tooltip> : ''}
                    <Tabs className="w-full" activeKey={activeTab} onChange={(key) => setActiveTab(key)} items={filteredNavItems.map((item) => ({label: <span> {item.icon} {item.label}</span>, key: item.key}))} /></div>
                    <div className="mt-4">{activeComponent}</div>
                </div>
            </Content>
        </Layout>
    )
}

export default ClientActivities