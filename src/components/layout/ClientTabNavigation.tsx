import type React from "react"
// import { Link } from "react-router-dom"
import { HomeOutlined, TeamOutlined, QuestionCircleOutlined } from "@ant-design/icons"
// import { useSelector } from "react-redux"
// import type { RootState } from "../../store"
import { useState } from "react"
import { FileQuestion, LucideAlignHorizontalDistributeCenter, UserCircleIcon } from "lucide-react"
import JobsManagement from "@/features/Jobs/JobsManagement"

interface NavItem {
    key: string
    //   path: string
    label: string
    icon: React.ReactNode
    hidden?: boolean
}

const ClientTabNavigation = () => {
    // const user_control = JSON.parse(sessionStorage.getItem("user") || "{}")
    // const location = useLocation()
    const [activeKey, setActiveKey] = useState("jobs")
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
            key: "assignments",
            //   path: "/account",
            label: "Account",
            icon: <UserCircleIcon size={18} />
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
            icon: <FileQuestion size={18} />,
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
            icon: <LucideAlignHorizontalDistributeCenter size={18} />
        },
    ]

    // Map the current path to the corresponding nav item key
    // const getActiveKey = (path: string) => {
    //     switch (path) {
    //         case "dashboard":
    //             return "dashboard"
    //         case "clients":
    //             return "clients"
    //         case "view-clients":
    //             return "view-clients"
    //         case "questionnaires":
    //             return "questionnaires"
    //         case "reminder-history":
    //         case "reminders":
    //             return "reminder-history"
    //         case "settings":
    //             return "settings"
    //         case "profile":
    //             return "profile"
    //         case "support":
    //             return "support"
    //         case "assignments":
    //             return "assignments"
    //         default:
    //             return "dashboard"
    //     }
    // }
    // const activeKey = getActiveKey(currentPath)

    return (
        <div className="w-full border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors duration-300">
            <div className="max-w-screen-2xl mx-auto px-4">
                <nav className="flex overflow-x-auto hide-scrollbar border-b border-gray-200 dark:border-gray-700 cursor-pointer">
                    {navItems.map((item) => (
                        <div
                            key={item.key}
                            //   to={item.path}
                            onClick={() => {
                                setActiveKey(item.key)
                                // getActiveKey(item.path)
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
                </nav>
                <JobsManagement />
            </div>
        </div>
    )
}

export default ClientTabNavigation;
