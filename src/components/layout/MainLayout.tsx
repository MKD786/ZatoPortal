import { useState, useEffect } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { Layout, Avatar, Dropdown } from "antd"
import { UserOutlined, LogoutOutlined, SettingOutlined } from "@ant-design/icons"
import { useSelector } from "react-redux"
import type { RootState } from "../../store"
import ThemeToggle from "../theme/ThemeToggle"
import LogoutModal from "../auth/LogoutModal"
import TabNavigation from "./TabNavigation"
import ZatoLogo from "../../assets/Zato Logo White Tilt.png"
import ClientLogoDark from "../../assets/Update CA Firm Look.png"
import { Footer } from "antd/es/layout/layout"
import ZatoLogoDark from "../../assets/Zato Logo Blue Tilt.png"
import ClientView from "@/features/client_overview/ClientView"
import ViewClients from "@/features/clients/ViewClients"
import SettingsModal from "@/features/settings/SettingsModal"
import Settings from "../../features/settings/Settings"

const { Header, Content } = Layout

const MainLayout = () => {
  const navigate = useNavigate()
  const { theme } = useSelector((state: RootState) => state.theme)
  const [logoutModalVisible, setLogoutModalVisible] = useState(false)
  const [settingsModalVisible, setSettingsModalVisible] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<string>(() => {
    return localStorage.getItem("selectedCompany") || ""
  })
  const [settingsModalVisibleTwo, setSettingsModalVisibleTwo] = useState(() => {
    if (localStorage.getItem("selectedCompany")) {
      return false
    }
    return true
  })

  useEffect(() => {
    if (selectedCompany) {
      setSettingsModalVisibleTwo(false)
    }
  }, [selectedCompany])

  const showSettingsModalTwo = () => {
    setSettingsModalVisibleTwo(true)
  }

  const hideSettingsModalTwo = () => {
    setSettingsModalVisibleTwo(false)
  }

  const showSettingsModal = () => {
    setSettingsModalVisible(true)
  }

  const hideSettingsModal = () => {
    setSettingsModalVisible(false)
  }

  const showLogoutModal = () => {
    setLogoutModalVisible(true)
  }

  const hideLogoutModal = () => {
    setLogoutModalVisible(false)
  }

  const handleCompanySelect = (company: string) => {
    if (company) {
      setSelectedCompany(company)
      localStorage.setItem("selectedCompany", company)
      hideSettingsModalTwo()
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("selectedCompany")
    setSelectedCompany("")
    showLogoutModal()
  }

  const userMenuItems = [
    {
      key: "profile",
      label: "Profile",
      icon: <UserOutlined />,
      onClick: () => navigate("/profile"),
    },
    {
      key: "Company",
      label: "Company",
      icon: <UserOutlined />,
      onClick: showSettingsModalTwo,
    },
    {
      key: "settings",
      label: "Settings",
      icon: <SettingOutlined />,
      onClick: showSettingsModal,
    },
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
    {
      key: "role-management",
      label: "Role Management",
      icon: <UserOutlined />,
      onClick: () => navigate("/role-management"),
    },
  ]

  const user_control = JSON.parse(sessionStorage.getItem("user") || "{}")
  const routerName = useLocation().pathname

  return (
    <Layout className="min-h-screen">
      <Header className="header flex items-center justify-between px-4 md:px-6 py-0 h-14 md:h-16 z-10">
        {user_control.role !== "client" ? (
          <div className="flex items-center">
            <div className="w-32">
              <img src={ZatoLogo || "/placeholder.svg"} alt="Zato Logo" width="100%" height="100%" />
            </div>
            <div className="ml-3 md:ml-4">
              <h1 className="text-white text-base md:text-lg font-medium m-0">
                Welcome, {user_control.role === "admin" ? "Sample CA Firm" : "Shiv"}
              </h1>
            </div>
          </div>
        ) : (
          <div className="flex items-center">
            <div className="dark:bg-gray-800 w-14 rounded-md">
              <img
                src={ClientLogoDark || "/placeholder.svg"}
                alt="Client Logo"
                width="100%"
                height="100%"
                className="rounded-full"
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 md:gap-4">
          {selectedCompany && (
            <div className="flex items-center">
              <p className="text-white m-0">{selectedCompany}</p>
              <p className="text-[#c6cbd5] m-0 text-sm font-normal pl-2 ml-2 relative before:content-['|'] before:absolute before:left-0 before:text-white/30">
                FY 25
              </p>
            </div>
          )}
          <ThemeToggle />
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Avatar className="cursor-pointer" size="small" icon={<UserOutlined />} style={{ backgroundColor: theme === "dark" ? "#4CCEEB" : "#0F5B6D", borderRadius: "5rem" }} />
          </Dropdown>
        </div>
      </Header>
      {routerName !== "/client-view" ? (
        <>
          {user_control?.role !== "client" ? (
            <>
              <TabNavigation />
              <Content className="p-4 md:p-6 overflow-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <Outlet />
              </Content>
            </>
          ) : routerName === "/profile" ? (
            <Content className="p-4 md:p-6 overflow-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
              <Outlet />
            </Content>
          ) : (
            <>
              <ViewClients />
              <Settings visible={settingsModalVisibleTwo} onCancel={hideSettingsModalTwo} onSave={handleCompanySelect} defaultCompany={selectedCompany} />
            </>
          )}
        </>
      ) : (
        <ClientView />
      )}
      <LogoutModal visible={logoutModalVisible} onCancel={hideLogoutModal} />
      <SettingsModal visible={settingsModalVisible} onCancel={hideSettingsModal} />
      <Footer className="fixed bottom-0 right-0 z-10 w-full text-end text-gray-500 dark:text-gray-400 p-0" style={{ padding: "0.3rem 0.5rem" }}>
        <div className="flex justify-end items-center gap-2">
          <p className="text-gray-500 dark:text-gray-400 text-xs" style={{ color: "#c6cbd5" }}>Powered by</p>
          <div className="w-10"><img src={ZatoLogoDark || "/placeholder.svg"} alt="Zato Logo" width="100%" height="100%" /></div>
        </div>
      </Footer>
    </Layout>
  )
}

export default MainLayout
