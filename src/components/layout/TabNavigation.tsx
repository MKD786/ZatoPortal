import type React from "react"
import { Link } from "react-router-dom"
import { TeamOutlined, HistoryOutlined, UserOutlined, QuestionCircleOutlined,
  //  QuestionCircleOutlined 
  } from "@ant-design/icons"
// import { useSelector } from "react-redux"
// import type { RootState } from "../../store"
import { useState } from "react"

interface NavItem {
  key: string
  path: string
  label: string
  icon: React.ReactNode
  hidden?: boolean
}

const TabNavigation = () => {
  const user_control = JSON.parse(sessionStorage.getItem("user") || "{}")
  // const location = useLocation()  
  // const currentPath = location.pathname.split("/")[1] || "dashboard"
  const [activeKey, setActiveKey] = useState("client-activities")
  // const currentPath = location.pathname.split("/")[1] || "dashboard"
  // const currentPath = user_control.role === "client" ? "/view-clients" : "settings"
  const navItems: NavItem[] = [
    // {
    //   key: "dashboard",
    //   path: "/dashboard",
    //   label: "Dashboard",
    //   icon: <HomeOutlined />,
    //   hidden: user_control?.role === "client",
    // },
    // {
    //   key: "assignments",
    //   path: "/assignments",
    //   label: "Assignments",
    //   icon: <UserOutlined />,
    //   hidden: user_control?.role === "client",
    // },
    {
      key: "rules-builder",
      path: "/add-rule",
      label: "Rules Builder",
      icon: <UserOutlined />,
      hidden: user_control?.role === "client",
    },
    // {
    //   key: "clients",
    //   path: "/clients",
    //   label: "Client Management",
    //   icon: <TeamOutlined />,
    //   hidden: user_control?.role === "client",
    // },
    // {
    //   key: "view-clients",
    //   path: "/view-clients",
    //   label: "Query Management",
    //   icon: <QuestionCircleOutlined/>,
    //   hidden: user_control?.role === "client",
    // },
    // {
    //   key: "questionnaires",
    //   path: "/questionnaires",
    //   label: "Questionnaire",
    //   icon: <FileTextOutlined />,
    // },
    // {
    //   key: "reminder-history",
    //   path: "/reminder-history",
    //   label: "Reminder History",
    //   icon: <HistoryOutlined />,
    //   hidden: user_control?.role === "client",
    // },
    {
      key: "client-activities",
      path: "/client-activities",
      label: "Clients",
      icon: <TeamOutlined  />,
      hidden: user_control?.role === "client",
    },
    {
      key: "jobs-new-screen",
      path: "/jobs-new-screen",
      label: "Jobs",
      icon: <TeamOutlined  />,
      hidden: user_control?.role === "client",
    },
    // {
    //   key: "settings",
    //   path: "/settings",
    //   label: "Settings",
    //   icon: <SettingOutlined />,
    //   hidden: user_control?.role === "client",
    // },
  ]

  // Map the current path to the corresponding nav item key
  const getActiveKey = (path: string) => {
    switch (path) {
      case "dashboard":
        return "dashboard"
      case "clients":
        return "clients"
      case "view-clients":
        return "view-clients"
      case "questionnaires":
        return "questionnaires"
      case "reminder-history":
      case "reminders":
        return "reminder-history"
      case "settings":
        return "settings"
      case "profile":
        return "profile"
      case "support":
        return "support"
      case "assignments":
        return "assignments"
      case "jobs-new-screen":
        return "jobs-new-screen"
      default:
        return "dashboard"
    }
  }
  // const activeKey = getActiveKey(currentPath)

  return (
    <div className="w-full border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors duration-300">
      <div className="max-w-screen-2xl mx-auto px-4">
        <nav className="flex overflow-x-auto hide-scrollbar">
          {navItems.map((item) => (
            <Link
              key={item.key}
              to={item.path}
              onClick={() => {
                setActiveKey(item.key)
                getActiveKey(item.path)
                
              }}
              className={`${item.hidden ? "hidden" : "flex items-center px-4 py-4 text-sm font-medium whitespace-nowrap transition-colors duration-200"} 
              ${activeKey === item.key
                  ? "text-teal-700 dark:text-teal-400 border-b-2 border-teal-700 dark:border-teal-400"
                  : "text-gray-600 dark:text-gray-300 hover:text-teal-700 dark:hover:text-teal-400"
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}

export default TabNavigation
