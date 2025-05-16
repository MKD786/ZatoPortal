import type React from "react"
// import { Link } from "react-router-dom"
import { HomeOutlined, TeamOutlined, QuestionCircleOutlined } from "@ant-design/icons"
// import { useSelector } from "react-redux"
// import type { RootState } from "../../store"
import { useState } from "react"
import { ArrowLeftCircle, FileQuestion, LucideAlignHorizontalDistributeCenter, UserCircleIcon } from "lucide-react"
import JobsManagement from "@/features/Jobs/JobsManagement"
import ClientDashboard from "./ClientDashboard"
// import Questionnaires from "../questionnaires/Questionnaires"
import ClientQuestionaire from "../clients/ClientQuestionaire"
// import ViewClients from "../clients/ViewClients"
import QueryHub from "../clients/QueryHub"
import { Link } from "react-router-dom"

interface NavItem {
    key: string
    //   path: string
    label: string
    icon: React.ReactNode
    hidden?: boolean
}

const ClientView = () => {
    // const user_control = JSON.parse(sessionStorage.getItem("user") || "{}")
    // const location = useLocation()
    const [activeKey, setActiveKey] = useState("dashboard")
    // const currentPath = location.pathname.split("/")[1] || "dashboard"
    // const currentPath = user_control.role === "client" ? "/view-clients" : "/dashboard"
    const navItems: NavItem[] = [
        {
            key: "dashboard",
            //   path: "/dashboard",
            label: "Dashboard",
            icon: <HomeOutlined />,
        },
        {
            key: "account",
            //   path: "/account",
            label: "Account",
            icon: <UserCircleIcon size={16} />
        },
        {
            key: "jobs",
            //   path: "/jobs",
            label: "Jobs",
            icon: <TeamOutlined size={18} />
        },
        {
            key: "questionnaires",
            //   path: "/questionnaires",
            label: "Questionnaire",
            icon: <FileQuestion size={16} />,
        },
        {
            key: "query-hub",
            //   path: "/query-hub",
            label: "Query Hub",
            icon: <QuestionCircleOutlined size={18} />,
        },
        {
            key: "automation-center",
            //   path: "/automation-center",
            label: "Automation Center",
            icon: <LucideAlignHorizontalDistributeCenter size={16} />
        },
    ]

    // Map the current path to the corresponding nav item key
    const getActiveKey = (path: string) => {
        switch (path) {
            case "dashboard":
                return <ClientDashboard />
            case "jobs":
                return <JobsManagement />
            case "account":
                return "account"
            case "questionnaires":
                return <ClientQuestionaire />
            case "query-hub":
                return <QueryHub />
            case "automation-center":
                return "automation-center"
            default:
                return <ClientDashboard />
        }
    }
    // const activeKey = getActiveKey(currentPath)

    return (
        <div className="w-full border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors duration-300">
            <div className="max-w-screen-2xl mx-auto px-4">
                <nav className="flex justify-between overflow-x-auto hide-scrollbar border-b border-gray-200 dark:border-gray-700 cursor-pointer mb-2">
                    <div className="flex items-center">
                    <Link className="flex items-center hover:text-teal-700 dark:hover:text-teal-400 gap-1" to="/"><ArrowLeftCircle size={14} /> Back</Link>
                    {navItems.map((item) => (
                        <div
                            key={item.key}
                            //   to={item.path}
                            onClick={() => {
                                setActiveKey(item.key)
                                getActiveKey(item.key)
                            }}
                            className={`${item.hidden ? "hidden" : "flex items-center px-4 py-4 text-sm font-medium whitespace-nowrap transition-colors duration-200"} 
                 ${activeKey === item.key
                                    ? "text-teal-700 dark:text-teal-400 border-b-2 border-teal-700 dark:border-teal-400"
                                    : "text-gray-600 dark:text-gray-300 hover:text-teal-700 dark:hover:text-teal-400"
                                }`}
                        >
                            <span className="mr-2">{item.icon}</span>
                            <span>{item.label}</span>
                        </div>
                    ))}
                    </div>
                    <div className="flex items-center">Acct. Manager : John Smith</div>
                </nav>
                {getActiveKey(activeKey)}
            </div>
        </div>
    )
}

export default ClientView;